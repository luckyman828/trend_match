<template>
    <div class="example-pdf">
        <div class="overlay" @click="$emit('close')"></div>
        <div class="wrapper" ref="pdfWrapper">
            <div class="inner" style="font-family: 'Roboto', sans-serif, helvetica, arial; position: relative;">
                <div class="page" v-for="(productChunk, index) in productChunks" :key="index"
                style="width: 576pt; height: 792pt; box-sizing: border-box; padding: 60px 38px 38px;
                display: flex; flex-wrap: wrap; justify-content: space-between; align-items: space-between;">
                    <div class="product-wrapper" v-for="product in productChunk" :key="product.datasource_id"
                    style="border: solid 2px; border-radius: 4px; height: calc(100% / 3 - 12px); box-sizing: border-box;
                    padding: 8px 12px;"
                    :style="{width: exportComments ? '100%' : 'calc(50% - 12px)'}">
                        <div class="col-wrapper" style="display: flex; justify-content: space-between; height: 100%;">
                            <div class="col-left" style="display: flex; flex-direction: column;
                            justify-content: space-between; align-items: space-between;"
                            :style="{width: exportComments ? 'calc(25% - 6px)' : 'calc(33% - 6px)'}">
                                <div class="row-top">
                                    <table class="id">
                                        <tr>
                                            <td>{{product.datasource_id}}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 700;">{{product.title}}</td>
                                        </tr>
                                        <tr>
                                            <td>{{product.delivery_date}}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="row-bottom">
                                    <div class="img-sizer" style="width: 92px;">
                                        <div class="img-wrapper" style="position: relative; padding-top: 133.3333%;
                                        border: solid 2px; height: 0; width: 100%;">
                                            <img :src="variantImage(product.variants[0])" style="height: 100%; width: 100%; position: absolute;
                                            left: 0; top: 0; object-fit: contain;">
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

                            <div class="col-mid" style="display: flex; flex-direction: column;
                            justify-content: space-between; align-items: space-between;"
                            :style="{width: exportComments ? 'calc(25% - 6px)' : 'calc(33% - 6px)'}">
                                <div class="row">
                                    <div class="assortments" style="display: flex; flex-direction: column; width: 100%;">
                                        <div v-for="(assortment, index) in product.assortments" :key="index"
                                        style="line-height: 1; word-break: break-word; margin-bottom: 2px;">
                                            <span style="font-size: 7px;">{{assortment.name || 'Unknown assortment'}} ({{assortment.box_size || 0}})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-right" style="display: flex; flex-direction: column;
                            justify-content: space-between; align-items: space-between;"
                            :style="{width: exportComments ? 'calc(50% - 6px)' : 'calc(33% - 6px)'}">
                                <div class="input" v-if="includeDistribution || exportComments">
                                    <!-- Alignment -->
                                    <div class="alignment-wrapper" style="margin-bottom: 12px; border-bottom: solid 1px #E4E4E4;">
                                        <strong style="font-size: 8px;">Alignment & Requests</strong>
                                        <div class="row" v-for="(action, index) 
                                        in product.actions.filter(
                                            x => includeNotDecided ? true : (x.action != 'None' 
                                            || product.requests.find(request => request.selection_id == x.selection_id)))" 
                                        :key="'alignment-'+index"
                                        style="display: flex; flex-direction: row; width: 100%; align-items: center; border-top: solid 1px #E4E4E4;">
                                            <div style="overflow: hidden; white-space: nowrap; max-width: 60px; min-width: 60px;">
                                                <td style="font-size: 7px;">
                                                    <span style="font-size: 7px;">{{action.selection.name}}</span>
                                                </td>
                                            </div>
                                            <div v-if="includeDistribution" 
                                            style="font-size: 7px; max-width: 24px; min-width: 24px; margin-left: 8px;" 
                                            :style="{textAlign: product.actions.find(x => x.selection_id == action.selection_id).action == 'Out' ? 'right' : 'left'}">
                                                <span>
                                                    {{product.actions.find(x => x.selection_id == action.selection_id).action == 'Out' ? 'O' 
                                                    : product.actions.find(x => x.selection_id == action.selection_id).action == 'Focus' ? 'F' 
                                                    : product.actions.find(x => x.selection_id == action.selection_id).action == 'In' ? 'I' : ''}}
                                                </span>
                                            </div>
                                            <!-- Requests -->
                                            <div v-if="exportComments" 
                                            style="font-size: 7px; flex: 1; margin-left: 12px;">
                                                <span style="font-size: 7px; display: block;" 
                                                v-for="(request, index) in product.requests.filter(x => x.selection_id == action.selection_id)" 
                                                :key="'request-'+index">
                                                    {{request.content}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>


                                    <!-- Feedback -->
                                    <div class="feedback-wrapper" style="border-bottom: solid 1px #E4E4E4;">
                                        <strong style="font-size: 8px;">Feedback & Comments</strong>
                                        <div class="row" v-for="(user, index) 
                                        in currentSelection.users.filter(user => includeNotDecided ? true
                                        : (product.feedbacks.find(x => x.user_id == user.id) && product.feedbacks.find(x => x.user_id == user.id).action != 'None')
                                        || product.comments.filter(x => x.user_id == user.id).length > 0)" 
                                        :key="index"
                                        style="display: flex; flex-direction: row; width: 100%; align-items: center; border-top: solid 1px #E4E4E4;">
                                            <div style="overflow: hidden; white-space: nowrap; max-width: 60px; min-width: 60px;">
                                                <td style="font-size: 7px;">
                                                    <span style="font-size: 7px;">{{user.name || 'Unknown user'}}</span>
                                                </td>
                                            </div>
                                            <div v-if="includeDistribution" 
                                            style="font-size: 7px; max-width: 24px; min-width: 24px; margin-left: 8px;" 
                                            :style="{textAlign: !!product.feedbacks.find(x => x.user_id == user.id) 
                                            && product.feedbacks.find(x => x.user_id == user.id).action == 'Out' ? 'right' : 'left'}">
                                                <span v-if="!!product.feedbacks.find(x => x.user_id == user.id) 
                                                && product.feedbacks.find(x => x.user_id == user.id).action != 'None'"
                                                style="font-size: 7px;">
                                                    {{product.feedbacks.find(x => x.user_id == user.id).action == 'Out' ? 'O' 
                                                    : product.feedbacks.find(x => x.user_id == user.id).action == 'Focus' ? 'F' : 'I'}}
                                                </span>
                                            </div>
                                            <div v-if="exportComments" 
                                            style="font-size: 7px; flex: 1; margin-left: 12px;">
                                                <span style="font-size: 7px; display: block;" 
                                                v-for="(comments, index) in product.comments.filter(x => x.user_id == user.id)" 
                                                :key="'comment-'+index">
                                                    {{comments.content}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default {
    name: 'exportPdf',
    mixins: [
        variantImage,
        formatDate,
    ],
    props: [
        'products',
        'exportComments',
        'includeDistribution',
        'includeNotDecided',
    ],
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', ['currentSelection']),
        productChunks() {
            const array = this.products
            const chunkedArr = [];
            const size = this.exportComments ? 3 : 6
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