<template>
    <div class="navbar-file flex-wrapper">

        <div class="items-left">

            <router-link :to="{name: 'collection'}" class="back-link"><span class="circle primary"><i class="far fa-arrow-left"></i></span><span>Back to Collections</span></router-link>
            <div class="breadcrumbs">
                <router-link class="text-link" :to="{name: 'collection'}">Collections</router-link>
                <span class="current"><strong>{{(currentFile != null) ? currentFile.title : 'Fetching..'}}</strong></span>
            </div>

        </div>

        <div class="items-right">

            <template v-if="userPermissionLevel >= 2">
                <span class="button wide light-2" v-if="submittingTaskComplete"><Loader/></span>
                <template v-if="currentTask.completed.length <= 0">
                    <span class="button wide primary" v-if="currentTask.isActive" @click="onCompleteTask(currentFile.id, currentTask.id)">Complete task</span>
                </template>
                <span class="button wide red" v-else @click="onUndoCompleteTask(currentFile.id, currentTask.id)">Reopen task</span>
            </template>
            <!-- <span v-if="currentTask.type == 'decision'" class="button wide primary" @click="downloadPDF">Download PDF</span> -->
            <span v-if="currentTask.type == 'decision'" class="button wide primary" @click="$refs.exportModal.toggle()">Export to PDF</span>

        </div>

        <!-- PDF FOR EXPORT MARKUP -->
        <div class="example-pdf" ref="exportToPdf" v-if="currentTask.type == 'decision' && this.productsScopedByInheritance.length > 1" 
            style="font-family: arial, helvetica, sans-serif;">
            <div style="font-family: 'Roboto', sans-serif, helvetica, arial;">
                <div style="height: 1040px; width: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center;">
                    <span style="font-size: 28px; font-weight: 700; margin-top: 20px;">{{currentWorkspace.name}}</span>
                    <div>
                        <span style="font-size: 28px; font-weight: 700;">{{currentFile.title}}</span>
                        <span style="color: #3B86FF; font-size: 20px; font-weight: 700;">{{productsScopedByInheritance.length}} styles</span>
                    </div>
                    <!-- <img style="display: block; margin: 0 auto;" :src="host + '/images/kollekt-logo_color@2x.png'" /> -->
                    <!-- <img style="display: block; margin: 0 auto;" src="http://trendmatchb2b.local/images/kollekt-logo_color@2x.png" /> -->
                    <!-- <img style="display: block; margin: 0 auto;" src="http://trendmatchb2b.local/images/kollekt-logo_color.jpg"> -->
                    <!-- <img src="http://trendmatchb2b.local/images/kollekt-logo_color.jpg" alt=""> -->
                    <img style="display: block; margin: 0 auto; width: 150px;" src="https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/kollekt_logo_color.png">
                    <!-- <img height="400px; width: auto;" :src="`https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${product.color_variants[0].blob_id}_thumbnail.jpg`"> -->
                </div>
                <div v-for="(product, index) in productsScopedByInheritance" :key="product.id" style="height: 1040px; width: 100%; position: relative; overflow: hidden;">
                    <span style="display: block; color: #3B86FF; font-size: 20px; font-weight: 700; margin-top: 20px; margin-bottom: 8px;">#{{index+1}} of {{productsScopedByInheritance.length}} styles</span>
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
                    <span style="font-size: 10px; font-weight: 700; position: absolute; right: 0; bottom: 0;">Page {{index+1}} of {{productsScopedByInheritance.length}}</span>

                    <div class="comments-wrapper">
                        <div v-for="request in product.requests" :key="request.id">
                            <p>{{request.comment}}</p>
                        </div>
                        <div v-for="comment in product.commentsScoped" :key="comment.id">
                            <p>{{comment.comment}}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <!-- PDF ENDS  -->


        <Modal ref="exportModal">
            <template v-slot:header>
                <h2>Export {{currentFile.title}} to PDF</h2>
                <span class="desc">Export the current products to a PDF.</span>
            </template>
            <template v-slot:body>
                <form>
                    <!-- <label class="dropdown-parent">
                        <input type="email" name="email" :id="'invite-email-' + index" placeholder="Choose Team or Full catalogue" v-model="newUsers[index].email">
                        <Dropdown class="dark">
                            <template v-slot:button="slotProps">
                                <span @click="slotProps.toggle" class="open-dropdown dropdown-parent" :class="{active: !slotProps.collapsed}">
                                    or Choose from Users
                                    <i class="far fa-chevron-down"></i>
                                </span>
                            </template>
                            <template v-slot:header="slotProps">
                                <span>{{users.length}} users</span>
                                <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                            </template>
                            <template v-slot:body>
                                <RadioButtons :options="users" :optionNameKey="'email'" :optionValueKey="'email'" ref="userSelect" v-model="newUsers[index].email"/>
                            </template>
                            <template v-slot:footer="slotProps">
                                <div class="grid-2">
                                    <span class="button green" @click="$refs.userSelect[index].submit(); slotProps.toggle()">Save</span>
                                    <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                                </div>
                            </template>
                        </Dropdown>
                    </label> -->
                    <label class="checkbutton">
                        <div class="checkbox">
                            <input type="checkbox" v-model="exportComments">
                            <span class="checkmark solid"><i class="fas fa-check"></i></span>
                        </div>
                        <span>Include Requests and comments</span>
                    </label>
                    <label>
                        Export details
                        <textarea disabled>
                            asdasdadsas
                        </textarea>
                    </label>
                </form>
                <span class="button xl primary" @click="printToPdf">Download PDF</span>
            </template>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex'
import Loader from './Loader'
import Modal from './Modal'
import Dropdown from './Dropdown'

export default {
    name: "navbarFile",
    components: {
        Loader,
        Modal,
        Dropdown,
    },
    data: function () { return {
        submittingTaskComplete: false,
        exportComments: true,
    }},
    computed: {
        ...mapGetters('persist', ['userPermissionLevel', 'currentFile', 'currentTask', 'currentWorkspace']),
        ...mapGetters('entities/products', ['productsScopedByInheritance']),
        ...mapGetters('entities/tasks', ['userTasks']),
        host() {
            return window.location.origin
        }
    },
    methods: {
        ...mapActions('entities/tasks', ['completeTask', 'undoCompleteTask']),
        ...mapActions('persist', ['setCurrentTaskId']),
        printToPdf: async function(event) {
            var endpoint = "https://v2018.api2pdf.com/chrome/html"
            var apiKey = "16b0a04b-8c9b-48f6-ad41-4149368bff58" //Replace this API key from portal.api2pdf.com
            var config = {
                headers: {
                Authorization: apiKey
                }
            }
            var payload = {
                html: `<head><link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap" rel="stylesheet"></head><body>${this.$refs.exportToPdf.innerHTML}</body>`, //Use your own HTML
                inlinePdf: true,
                fileName: this.currentWorkspace.name + '_' + this.currentFile.title
            }
            console.log('Printing pdf ...')
            await axios.post(endpoint, payload, config)
                .then(function(response) {
                // console.log(response.data.pdf); //this is your PDF! Do something with it
                    window.open(response.data.pdf)
                })
                .catch(function(error) {
                    console.log('error?')
                    console.log(error);
                });
            console.log('Succes!?')
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
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~@/_variables.scss';

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
        z-index: 99;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .flex-wrapper {
        width: 100%;
        padding: 8px 60px;
        padding-right: 77px;
        display: flex;
        justify-content: space-between;
    }
    .items-left, .items-right {
        display: flex;
        align-items: center;
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
