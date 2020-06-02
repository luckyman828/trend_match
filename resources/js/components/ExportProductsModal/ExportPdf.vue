<template>
    <div class="example-pdf" :style="testFeaturesEnabled && {visibility: 'visible'}">
        <div class="overlay" @click="$emit('close')"></div>
        <div class="wrapper" ref="pdfWrapper">
            <div class="inner" style="font-family: 'Roboto', sans-serif, helvetica, arial; position: relative;">


                <div class="page" v-for="(productChunk, index) in chunksToShow" :key="index"
                style="width: 744pt; height: 1053pt;
                box-sizing: border-box; padding: 60px 38px 38px; position: relative;">

                    <div class="header" style="display: -webkit-box; -webkit-box-pack: justify; justify-content: space-between;
                    position: absolute; top: 16px; left 0; width: 684pt;">
                        <div class="left">
                            <p style="margin: 0; font-weight: 700">{{currentFile.name}}</p>
                            <p style="margin: 0; margin-top: 8px; font-weight: 400">{{formatDate(new Date)}}</p>
                        </div>
                        <div class="right" style="text-align: right;">
                            <p style="margin: 0; font-weight: 400">Page {{index+1}} of {{totalPages}}</p>
                        </div>
                    </div>

                    <div class="product-wrapper" v-for="(product, index) in productChunk" :key="product.datasource_id"
                    style="display: block; border: solid 2px; border-radius: 4px; margin-top: 12pt"
                    :style="[{width: exportComments || includeVariants ? '100%' : '336pt'},
                    {marginRight: !(exportComments || includeVariants) && index%2 == 0 ? '12pt' : '0'},
                    {float: !exportComments && index%2 == 0 ? 'left' : 'right'},
                    {height: includeVariants ? '100%' : '306pt'}]">

                        <div class="col-wrapper" 
                        style="display: -webkit-box; -webkit-box-pack: justify; justify-content: space-between;
                        padding: 8px 12px 16px; box-sizing: border-box;"
                        :style="{height: includeVariants ? 'auto' : 'height: 336pt'}">

                            <div class="col-left" style="display: -webkit-box; -webkit-box-orient: vertical; flex-direction: column;
                            -webkit-box-pack: justify; justify-content: space-between; align-items: space-between;"
                            :style="{width: exportComments ? '24%' : '32%'}">
                                <div class="row-top">
                                    <table class="id">
                                        <tr>
                                            <td>{{product.datasource_id}}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 700;"><h4 style="margin: 0;">{{product.title}}</h4></td>
                                        </tr>
                                        <tr>
                                            <td>{{product.delivery_date}}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="row-bottom">
                                    <div class="img-sizer" :style="{width: exportComments ? '160px' : '132px'}">
                                        <div class="img-wrapper" style="position: relative; padding-top: 133.3333%;
                                        border: solid 2px; height: 0; width: 100%; margin-bottom: 8px;
                                        background-size: contain; background-position: center; background-repeat: no-repeat;"
                                        :style="{backgroundImage: `url(${variantImage(product.variants[0])})`}">
                                        </div>
                                    </div>
                                    <table class="prices">
                                        <tr>
                                            <td>Retail Price:</td>
                                            <td style="text-align: right">{{product.yourPrice.recommended_retail_price}}</td>
                                        </tr>
                                        <tr>
                                            <td>Mark up:</td>
                                            <td style="text-align: right">{{product.yourPrice.mark_up}}</td>
                                        </tr>
                                        <tr style="font-weight: 700; ">
                                            <td style="padding-top: 2px;">Price ({{product.yourPrice.currency}})</td>
                                            <td style="text-align: right">{{product.yourPrice.wholesale_price}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                            <div class="col-mid" style="display: -webkit-box; -webkit-box-orient: vertical; flex-direction: column;
                            -webkit-box-pack: justify; justify-content: space-between; align-items: space-between;"
                            :style="{width: exportComments ? '24%' : '32%'}">
                                <div class="row">
                                    <div class="assortments" style="display: -webkit-box; -webkit-box-orient: vertical; flex-direction: column; width: 100%;">
                                        <div v-for="(assortment, index) in product.assortments" :key="index"
                                        style="line-height: 1; word-break: break-word; margin-bottom: 2px;">
                                            <span style="font-size: 10px;">{{assortment.name || 'Unknown assortment'}} ({{assortment.box_size || 0}})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-right" style=""
                            :style="{width: exportComments ? '49%' : '32%'}">
                                <div class="input" v-if="includeDistribution || exportComments">
                                    <!-- Alignment -->
                                    <div class="alignment-wrapper" style="margin-bottom: 20px; border-bottom: solid 1px #E4E4E4;">
                                        <strong style="font-size: 11px; margin-bottom: 4px; display: block;">Alignment & Requests</strong>
                                        <div class="row" v-for="(action, index) 
                                        in product.actions.filter(
                                            x => includeNotDecided ? true : (x.action != 'None' 
                                            || product.requests.find(request => request.selection_id == x.selection_id)))" 
                                        :key="'alignment-'+index"
                                        style="display: -webkit-box; flex-direction: row; width: 100%; align-items: center; border-top: solid 1px #E4E4E4;">
                                            <div style="overflow: hidden; white-space: nowrap; max-width: 80px; min-width: 80px;">
                                                <td style="font-size: 10px;">
                                                    <span style="font-size: 10px;">{{action.selection.name | truncate(16)}}</span>
                                                </td>
                                            </div>  
                                            <div v-if="includeDistribution" 
                                            style="font-size: 10px; max-width: 28px; min-width: 28px; margin-left: 16px;" 
                                            :style="{textAlign: product.actions.find(x => x.selection_id == action.selection_id).action == 'Out' ? 'right' : 'left'}">
                                                <span style="font-size: 12px; margin-bottom: -3px; display: block; margin-top: -2px; font-weight: 900;">
                                                    {{product.actions.find(x => x.selection_id == action.selection_id).action == 'Out' ? '⨯' 
                                                    : product.actions.find(x => x.selection_id == action.selection_id).action == 'Focus' ? '★' 
                                                    : product.actions.find(x => x.selection_id == action.selection_id).action == 'In' ? '♥' : ''}}
                                                </span>
                                            </div>
                                            <!-- Requests -->
                                            <div v-if="exportComments" 
                                            style="font-size: 10px; -webkit-box-flex: 1; margin-left: 16px; padding: 1px;">
                                                <span style="font-size: 10px; display: block; margin-bottom: 4px;" 
                                                v-for="(request, index) in product.requests.filter(x => x.selection_id == action.selection_id)" 
                                                :key="'request-'+index">
                                                    {{request.content}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>


                                    <!-- Feedback -->
                                    <div class="feedback-wrapper" style="border-bottom: solid 1px #E4E4E4;">
                                        <strong style="font-size: 11px; margin-bottom: 4px; display: block;">Feedback & Comments</strong>
                                         <div class="row" v-for="(feedback, index) 
                                        in product.feedbacks.filter(feedback => includeNotDecided ? true
                                        : feedback.action != 'None')" 
                                        :key="index"
                                        style="display: -webkit-box; flex-direction: row; width: 100%; align-items: center; border-top: solid 1px #E4E4E4;">
                                            <div style="overflow: hidden; white-space: nowrap; max-width: 80px; min-width: 80px;">
                                                <td style="font-size: 10px;">
                                                    <span style="font-size: 10px;">{{feedback.user ? feedback.user.name : 'Anonymous' | truncate(16)}}</span>
                                                </td>
                                            </div>
                                            <div v-if="includeDistribution" 
                                            style="font-size: 10px; max-width: 28px; min-width: 28px; margin-left: 16px;" 
                                            :style="{textAlign: feedback.action == 'Out' ? 'right' : 'left'}">
                                                <span v-if="feedback.action != 'None'"
                                                style="font-size: 12px; margin-bottom: -3px; display: block; margin-top: -2px; font-weight: 900;">
                                                    {{feedback.action == 'Out' ? '⨯' 
                                                    : feedback.action == 'Focus' ? '★' : '♥'}}
                                                </span>
                                            </div>
                                            <div v-if="exportComments" 
                                            style="font-size: 10px; flex: 1; margin-left: 16px; padding: 1px;">
                                                <span style="font-size: 10px; display: block; margin-bottom: 4px;" 
                                                v-for="(comments, index) in product.comments.filter(x => x.user_id == feedback.user_id)" 
                                                :key="'comment-'+index">
                                                    {{comments.content}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <VariantList :product="product" v-if="includeVariants"/>

                    </div> 
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import variantImage from '../../mixins/variantImage'
import formatDate from '../../mixins/formatDate'
import VariantList from './VariantList'

export default {
    name: 'exportPdf',
    mixins: [
        variantImage,
        formatDate,
    ],
    components: {
        VariantList
    },
    props: [
        'products',
        'exportComments',
        'includeDistribution',
        'includeNotDecided',
        'chunkIndex',
        'includeVariants',
        'testFeaturesEnabled',
        'chunkSize',
    ],
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', ['currentSelection']),
        productChunks() {
            const array = this.products
            const chunkedArr = [];
            const size = this.includeVariants ? 1 : this.exportComments ? 3 : 6
            for (let i = 0; i < array.length; i++) {
                const last = chunkedArr[chunkedArr.length - 1];
                if (!last || last.length === size) {
                    chunkedArr.push([array[i]]);
                } else {
                    last.push(array[i]);
                }
            }
            return chunkedArr;
        },
        chunksToShow() {
            if (!this.testFeaturesEnabled || this.chunkSize <= 0) return this.productChunks
            const size = this.exportComments ? 3 : 6
            const target = this.chunkSize // MUST be divisible by 6
            const chunkAmount = target / size
            const start = this.chunkIndex * chunkAmount
            return this.productChunks.slice(start, start + chunkAmount)
        },
        totalPages() {
            return this.chunksToShow.length
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
    .example-pdf {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
        height: 100%;
        visibility: hidden;
        .overlay {
            display: block;
            z-index: 0
        }
        .wrapper {
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            width: 100%;
            max-width: 1000px;
            height: 90vh;
            top: 5vh;
            background: white;
            box-shadow: 0 0 20px rgba(black,50%);
            overflow-x: hidden;
            overflow-y: auto;
            z-index: 1;
        }
    }

</style>