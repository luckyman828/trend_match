<template>
    <div class="navbar-file flex-wrapper">

        <div class="items-left">

            <router-link :to="{name: 'collection'}" class="back-link"><span class="circle primary"><i class="far fa-arrow-left"></i></span><span>Back to Collections</span></router-link>
            <div class="breadcrumbs">
                <router-link class="text-link" :to="{name: 'collection'}">Collections</router-link>
                <span class="current"><strong>{{(currentFile != null) ? currentFile.title : 'Fetching..'}}</strong></span>
            </div>

        </div>

        <div class="items-center">
            <!-- <input type="search" class="input-wrapper"> -->
            <div class="input-wrapper small clickable" @click="openSearch">
                <i class="fas fa-search"></i>
                Search..
            </div>
        </div>

        <div class="items-right">

            <template v-if="userPermissionLevel >= 2 && userPermissionLevel != 3">
                <span class="button wide light-2" v-if="submittingTaskComplete"><Loader/></span>
                <template v-if="currentTask.completed.length <= 0">
                    <span class="button wide primary" v-if="currentTask.isActive" @click="onCompleteTask(currentFile.id, currentTask.id)">Complete task</span>
                </template>
                <span class="button wide red" v-else @click="onUndoCompleteTask(currentFile.id, currentTask.id)">Reopen task</span>
            </template>
            <span v-if="(currentTask.type == 'decision' || currentTask.type == 'approval') && currentTask.completed.find(x => x.task_id == currentTask.id)" class="button wide primary" @click="$refs.exportModal.toggle(); setPageHeight()">Export to PDF</span>

        </div>

        <!-- PDF FOR EXPORT MARKUP -->
        <div class="example-pdf" ref="exportToPdf" v-if="(currentTask.type == 'decision' || currentTask.type == 'approval') && this.products.length > 0" 
            style="font-family: arial, helvetica, sans-serif;">
            <div ref="pdfWrapper" style="font-family: 'Roboto', sans-serif, helvetica, arial; position: relative;">
                <div style="height: 1040px; width: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center;">
                    <span style="font-size: 28px; font-weight: 700; margin-top: 20px;">{{currentWorkspace.name}}</span>
                    <div>
                        <span style="font-size: 28px; font-weight: 700; display: block; margin-bottom: 20px;">{{currentFile.title}}</span>
                        <span style="color: #3B86FF; font-size: 20px; font-weight: 700; display: block;">{{products.length}} style{{products.length > 1 ? 's' : ''}}</span>
                    </div>
                    <img style="display: block; margin: 0 auto; width: 150px;" src="https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/kollekt_logo_color.png">
                </div>
                <div v-for="(product, index) in products" :key="product.id" style="min-height: 1040px; width: 100%;" ref="productPage">
                    <span style="display: block; color: #3B86FF; font-size: 20px; font-weight: 700; padding-top: 20px; box-sizing: border-box; margin-bottom: 8px;">#{{index+1}} of {{products.length}} styles</span>
                    <span style="display: block; font-size: 24px; margin-bottom: 12px;">{{product.title}}</span>
                    <div style="display: flex; margin-bottom: 12px;">
                        <img height="400px; width: auto;" :src="`https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${product.color_variants[0].blob_id}_thumbnail.jpg`">
                        <div style="margin-left: 16px;">
                            <span style="display: block; font-size: 14px; font-weight: 700;">Style number</span>
                            <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.datasource_id}}</span>
                            <span style="display: block; font-size: 14px; font-weight: 700;">Category</span>
                            <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.category}}</span>
                            <span style="display: block; font-size: 14px; font-weight: 700;">Minimum production</span>
                            <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.quantity}} Units</span>
                            <span style="display: block; font-size: 14px; font-weight: 700;">WHS ({{product.userPrices.currency}})</span>
                            <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.userPrices.wholesale_price}}</span>
                            <span style="display: block; font-size: 14px; font-weight: 700;">RPP ({{product.userPrices.currency}})</span>
                            <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.userPrices.recommended_retail_price}}</span>
                            <span style="display: block; font-size: 14px; font-weight: 700;">MU</span>
                            <span style="display: block; font-size: 14px;">{{product.userPrices.markup}}</span>
                        </div>
                    </div>

                    <span style="display: block; font-size: 14px; font-weight: 700;">Composition</span>
                    <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.composition}}</span>
                    <span style="display: block; font-size: 14px; font-weight: 700;">Delivery date</span>
                    <span style="display: block; font-size: 14px;">{{new Date(product.delivery_date).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}}</span>

                    <div style="display: flex; height: 150px; overflow: hidden; margin-left: -8px; margin-right: -8px;">
                        <div v-for="(variant, index) in product.color_variants" :key="index" style="flex: 1; overflow: hidden; padding: 8px; box-sizing: border-box; max-width: 100px;">
                            <div style="width: 100%; height: 100%;">
                                <div style="padding-top: 110%; width: 100%; position: relative; overflow: hidden;">
                                    <img style="position: absolute; top: 0; left: 0; height:100%; width: 100%; object-fit: cover;" :src="`https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`">
                                </div>
                            </div>
                            <span style="font-size: 10px; font-weight: 500;">{{variant.color}}</span>
                        </div>
                    </div>

                    <div class="comments-wrapper" v-if="exportComments && (product.requests.length > 0 || product.commentsScoped.length > 0)">
                        <h2>Requests & Comments</h2>
                        <div v-for="request in product.requests" :key="request.id" style="border-radius: 6px; background: #3B86FF; color: white; padding: 8px 12px; margin-bottom: 16px; max-width: calc(100% - 120px);">
                            <p style="font-size: 12px; font-weight: 700; margin: 0;">{{request.user.name}}</p>
                            <p style="white-space: pre-wrap; word-wrap: break-word;">{{request.comment}}</p>
                            <p style="font-size: 10px; font-weight: 500; margin: 0;">Request ID: {{request.id}}</p>
                        </div>
                        <div v-for="comment in product.commentsScoped" :key="comment.id">
                            <p style="border-radius: 6px; background: #DFDFDF; color: #1B1C1D; padding: 8px 12px; display: inline-block; white-space: pre-wrap; word-wrap: break-word; margin-bottom: 0; max-width: calc(100% - 120px);">{{comment.comment}}</p>
                            <p style="font-size: 12px; font-weight: 500; color: #A8A8A8; margin-bottom: 16px; margin-top: 0">{{comment.task.title}} | {{comment.user.name}}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <!-- PDF ENDS  -->


        <Modal ref="exportModal" :header="'Export <strong>' + currentFile.title + '</strong> to PDF'" :subHeader="'The products in your current view will be exported'">
            <template v-slot:body>
                <form>
                    <div class="form-element">
                        <label class="input-wrapper check-button">
                            <div class="checkbox">
                                <input type="checkbox" v-model="exportComments">
                                <span class="checkmark solid"><i class="fas fa-check"></i></span>
                            </div>
                            <span>Include Requests and comments</span>
                        </label>
                    </div>
                    <div class="form-element">
                        <label>Export details</label>
                        <div class="input-wrapper disabled">
                            <p>{{products.length}} products <template v-if="exportComments">, {{products.filter(x => x.requests.length > 0).length}} with requests</template></p>
                        </div>
                    </div>
                </form>
                <span v-if="exportingPDF" class="button xl dark disabled"><Loader/></span>
                <template v-else-if="generatedPDF">
                    <a class="button xl primary" :href="generatedPDF" target="_blank" :download="(currentWorkspace.name + '_' + currentFile.title).replace(/ /g, '_') + '.pdf'">Download PDF</a>
                    <span style="margin-top: 32px;" class="button xl dark" @click="printToPdf">Generate new PDF</span>
                </template>
                <span v-else class="button xl dark" @click="printToPdf">Export as PDF</span>
            </template>
        </Modal>

        <SearchModal ref="searchModal"/>
    </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex'
import SearchModal from './SearchModal'

export default {
    name: "navbarFile",
    components: {
        SearchModal
    },
    data: function () { return {
        submittingTaskComplete: false,
        exportingPDF: false,
        exportComments: true,
        generatedPDF: null
    }},
    computed: {
        ...mapGetters('persist', ['userPermissionLevel', 'currentFile', 'currentTask', 'currentWorkspace']),
        // ...mapGetters('entities/products', ['productsScopedFiltered']),
        ...mapGetters('entities/products', {products: 'productsScopedFiltered'}),
        ...mapGetters('entities/tasks', ['userTasks']),
    },
    methods: {
        ...mapActions('entities/tasks', ['completeTask', 'undoCompleteTask']),
        ...mapActions('persist', ['setCurrentTaskId']),
        printToPdf: async function(event) {
            const vm = this
            var endpoint = "https://v2018.api2pdf.com/chrome/html"
            var apiKey = "16b0a04b-8c9b-48f6-ad41-4149368bff58" //Replace this API key from portal.api2pdf.com
            var config = {
                headers: {
                Authorization: apiKey
                }
            }
            var payload = {
                html: `<head><title>Flemming</title><link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap" rel="stylesheet"></head><body>${this.$refs.exportToPdf.innerHTML}</body>`, //Use your own HTML
                inlinePdf: true,
                fileName: (this.currentWorkspace.name + '_' + this.currentFile.title).replace(/ /g, '_'),
                options: {
                    displayHeaderFooter: true,
                    footerTemplate: '<div class="page-footer" style="width:100%; text-align:right; font-size: 8px; font-weight: 700; font-family: Roboto, sans-serif, helvetica, arial; box-sizing: border-box; padding-right: 32px; padding-bottom: 12px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
                }
            }
            this.exportingPDF = true
            this.$refs.exportToPdf.style.display = 'block'; // Show the pdf element for sizing purposes
            await this.setPageHeight()

            await axios.post(endpoint, payload, config)
                .then(function(response) {
                    window.open(response.data.pdf)
                    vm.generatedPDF = response.data.pdf
                })
                .catch(function(error) {
                    console.log(error);
                });
            this.$refs.exportToPdf.style.display = 'none'; // Hide the pdf element again
            this.exportingPDF = false
        },
        async onCompleteTask(file_id, task_id) {
            this.submittingTaskComplete = true
            await this.completeTask({file_id: file_id, task_id: task_id})
            // .then(reponse => succes = response)
            this.submittingTaskComplete = false
            // Skip to next task
            if (this.userTasks[this.userTasks.findIndex(x => x.id == this.currentTask.id) + 1]) {
                this.setCurrentTaskId(this.userTasks[this.userTasks.findIndex(x => x.id == this.currentTask.id) + 1].id)
            }
        },
        async onUndoCompleteTask(file_id, task_id) {
            this.submittingTaskComplete = true
            await this.undoCompleteTask({file_id: file_id, task_id: task_id})
            // .then(reponse => succes = response)
            this.submittingTaskComplete = false
        },
        setPageHeight() {
            const pages = this.$refs.productPage
            console.log(pages)
            let nextPageIndex = 1
            pages.forEach(page => {
                const pageHeight = 1040
                const heightDif = pageHeight - (page.clientHeight - pageHeight)
                if (heightDif > 0 && nextPageIndex < pages.length) {
                    pages[nextPageIndex].style.marginTop = heightDif + 'px'
                }
                nextPageIndex++
            })
        },
        openSearch() {
            this.$refs.searchModal.toggle()
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~@/_variables.scss';

    .navbar-file {
        width: 100%;
        padding: 8px 60px;
        padding-right: 77px;
        display: flex;
        justify-content: space-between;
        > * {
            display: flex;
            align-items: center;
        }
        .example-pdf {
            display: none;
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 1000px;
            height: 90vh;
            top: 5vh;
            background: white;
            box-shadow: 0 0 20px rgba(black,50%);
            z-index: -99;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }
    .items-center {
        flex: 1;
        padding: 0 40px;
    }
    .back-link {
        padding-right: 28px;
        border-right: solid 2px $light2;
        margin-right: 28px;
        .circle {
            margin-right: 8px;
        }
    }
    .breadcrumbs {
        display: flex;
        > * {
            display: inline-flex;
            align-items: center;
        }
        > *:not(:first-child)::before {
            content: '';
            pointer-events: none;
            color: $dark1;
            margin-left: 8px;
            margin-right: 10px;
            margin-bottom: 2px;
            font-size: 10px;
            font-family: "Font Awesome 5 Pro";
            font-weight: 900;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
        }
        > *:last-child::before {
            content: '';
        }
    }

</style>
