<template>
    <BaseModal ref="exportModal" :header="'Export <strong>' + currentFile.name + '</strong> to PDF'"
    @close="$emit('close')" :show="show">
        <template v-slot v-if="show">
            <h3 style="text-align: center">The products in your current view will be exported</h3>
            <form @submit.prevent>

                <!-- Selection export options -->
                <template v-if="$route.name == 'selection'">
                    <h4>Requests & comments</h4>
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="exportComments">
                            Include Requests and comments
                        </BaseCheckboxInputField>
                    </div>
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="onlyWithRequests">
                            Only include Products with Requests
                        </BaseCheckboxInputField>
                    </div>

                    <h4>Distribution</h4>
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="includeDistribution">
                            Include distribution (In/Out/Focus)
                        </BaseCheckboxInputField>
                    </div>
                    <div class="form-element" v-if="includeDistribution">
                        <BaseCheckboxInputField v-model="includeNotDecided">
                            Include "Not Decided" in distribution
                        </BaseCheckboxInputField>
                    </div>
                </template>

                <div class="form-element">
                    <h4>Export details</h4>
                    <div class="input-wrapper multiline disabled">
                        <p>{{productsToExport.length}} products, <br>
                            <template v-if="exportComments">
                                {{productsToExport.reduce((acc, x) => acc + x.requests.length > 0 ? 1 : 0, 0)}} with requests,
                            </template><br>
                            <template v-if="exportComments">
                                {{productsToExport.reduce((acc, x) => acc + x.comments.length > 0 ? 1 : 0, 0)}} with comments,
                            </template><br>
                            <template v-if="includeDistribution">
                                <span>with {{productsToExport.reduce((acc, x) => acc + x.feedbacks.filter(x => x.action != 'None').length, 0)}} feedback actions</span
                                ><template v-if="includeNotDecided">
                                    <span> ({{productsToExport.reduce((acc, x) => acc + x.nds.length, 0)}} not decided)</span>
                                </template>,
                            </template><br>
                            <template v-if="includeDistribution">
                                <span>with {{productsToExport.reduce((acc, x) => acc + x.actions.filter(x => x.action != 'None').length, 0)}} alignment actions</span
                                ><template v-if="includeNotDecided">
                                    <span> ({{productsToExport.reduce((acc, x) => acc + x.alignmentNds.length, 0)}} not decided)</span>
                                </template>,
                            </template>
                        </p>
                    </div>
                </div>
                <BaseLoader v-if="exportingPDF"/>
                <button v-else-if="!generatedPDF" class="button lg dark full-width" @click="printToPdf"><span>Export as PDF</span></button>
                <template v-else>
                    <Button class="button lg dark full-width" @click="printToPdf"><span>Generate New PDF</span></Button>
                    <a class="button lg ghost dark full-width" style="margin-top: 20px;" :href="generatedPDF" target="_blank" :download="(currentWorkspace.name + '_' + currentFile.title).replace(/ /g, '_') + '.pdf'">Download PDF</a>
                </template>
            </form>
            <!-- <button class="ghost md full-width" style="margin-bottom: 20px;" 
            @click="previewPdf = true">
                Preview PDF
            </button> -->

            <ExportPdf ref="exportToPdf" v-if="previewPdf" :products="productsToExport"
            :includeDistribution="includeDistribution" :exportComments="exportComments"
            :includeNotDecided="includeNotDecided"
            @close="previewPdf = false"/>
        </template>
    </BaseModal>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex'
import ExportPdf from './ExportPdf'
import formatDate from '../../mixins/formatDate'


export default {
    name: "exportPDFModal",
    props: [
        'show'
    ],
    components: {
        ExportPdf
    },
    mixins: [
        formatDate
    ],
    data: function () { return {
        exportingPDF: false,
        exportComments: this.$route.name == 'selection' ? true : false,
        generatedPDF: null,
        onlyWithRequests: false,
        includeDistribution: true,
        includeNotDecided: false,
        previewPdf: false,
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('products', ['productsFiltered']),
        ...mapGetters('files', ['currentFile']),
        productsToExport() {
            const products = this.productsFiltered
            if (this.onlyWithRequests) {
                return products.filter(product => product.requests.length > 0)
            } else return products
        }
    },
    methods: {
        printToPdf: async function(event) {
            const vm = this
            var endpoint = "https://v2018.api2pdf.com/chrome/html"
            var apiKey = "16b0a04b-8c9b-48f6-ad41-4149368bff58" //Replace this API key from portal.api2pdf.com
            var config = {
                headers: {
                Authorization: apiKey
                }
            }

            this.exportingPDF = true
            this.previewPdf = true

            this.$nextTick(() => {
                this.$nextTick(async () => {
                    const payload = {
                        html: `<head>
                        <style>
                            @page {
                                size: 576pt 792pt;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                            }
                            p {
                                margin: none;
                            }
                            td {
                                line-height: 1;
                            }
                            td, p, span {
                                font-size: 9px;
                            }
                        </style>
                        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap" rel="stylesheet">
                        </head>
                        <body>${this.$refs.exportToPdf.$refs.pdfWrapper.innerHTML}</body>`, //Use your own HTML
                        // <body>${this.$refs.exportToPdf.$refs.pdfWrapper.innerHTML}</body>`, //Use your own HTML
                        inlinePdf: true,
                        fileName: (this.currentWorkspace.name + '_' + this.currentFile.title).replace(/ /g, '_'),
                        options: {
                            displayHeaderFooter: true,
                            preferCSSPageSize: true,
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            headerTemplate: `<div class="page-header" style="font-family: Roboto, sans-serif, helvetica, arial; display: flex; justify-content: space-between; width: 100%; box-sizing: border-box;"><div class"col-left" style="padding-left: 38px; width: 33%;"><table><tr><td style="font-size: 6px; font-weight: 700; line-height: 1;">${this.currentFile.name}</td></tr><tr><td style="font-size: 6px; line-height: 1;">${this.formatDate(new Date)}</td></tr></table></div><div class="col-mid"></div><div classs="col-right" style="font-size: 6px; padding-right: 38px; text-align: right; width: 33%">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div></div>`,
                            // footerTemplate: '<div class="page-footer" style="width:100%; text-align:right; font-size: 8px; font-weight: 700; font-family: Roboto, sans-serif, helvetica, arial; box-sizing: border-box; padding-right: 32px; padding-bottom: 12px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
                        }
                    }

                    await axios.post(endpoint, payload, config)
                        .then(function(response) {
                            window.open(response.data.pdf)
                            vm.generatedPDF = response.data.pdf
                        })
                        .catch(function(error) {
                            console.log(error);
                    });
                    this.exportingPDF = false
                    this.previewPdf = false
                })
            })
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    // .navbar-file {
    //     width: 100%;
    //     padding: 8px 60px;
    //     padding-right: 77px;
    //     display: flex;
    //     justify-content: space-between;
    //     > * {
    //         display: flex;
    //         align-items: center;
    //     }
    //     .example-pdf {
    //         display: none;
    //         position: fixed;
    //         left: 50%;
    //         transform: translateX(-50%);
    //         width: 100%;
    //         max-width: 1000px;
    //         height: 90vh;
    //         top: 5vh;
    //         background: white;
    //         box-shadow: 0 0 20px rgba(black,50%);
    //         z-index: -99;
    //         overflow-x: hidden;
    //         overflow-y: auto;
    //     }
    // }
    // .items-center {
    //     flex: 1;
    //     padding: 0 40px;
    // }
    // .back-link {
    //     padding-right: 28px;
    //     border-right: solid 2px $light2;
    //     margin-right: 28px;
    //     .circle {
    //         margin-right: 8px;
    //     }
    // }
    // .breadcrumbs {
    //     display: flex;
    //     > * {
    //         display: inline-flex;
    //         align-items: center;
    //     }
    //     > *:not(:first-child)::before {
    //         content: '';
    //         pointer-events: none;
    //         color: $dark1;
    //         margin-left: 8px;
    //         margin-right: 10px;
    //         margin-bottom: 2px;
    //         font-size: 10px;
    //         font-family: "Font Awesome 5 Pro";
    //         font-weight: 900;
    //         -moz-osx-font-smoothing: grayscale;
    //         -webkit-font-smoothing: antialiased;
    //         display: inline-block;
    //         font-style: normal;
    //         font-variant: normal;
    //         text-rendering: auto;
    //         line-height: 1;
    //     }
    //     > *:last-child::before {
    //         content: '';
    //     }
    // }

</style>
