<template>
    <div class="example-pdf">
        <div class="overlay" @click="$emit('close')"></div>
        <div class="wrapper" ref="pdfWrapper">
            <div class="inner" style="font-family: 'Roboto', sans-serif, helvetica, arial; position: relative;">
                <div class="page" v-for="(productChunk, index) in productChunks" :key="index"
                style="width: 576pt; height: 792pt; box-sizing: border-box; padding: 60px 38px 38px;
                display: flex; flex-wrap: wrap; justify-content: space-between; align-items: space-between;">
                    <div class="product-wrapper" v-for="product in productChunk" :key="product.datasource_id"
                    style="border: solid 2px; border-radius: 4px; height: calc(100% / 3 - 24px); box-sizing: border-box;
                    padding: 8px 12px;"
                    :style="{width: exportComments ? '100%' : 'calc(50% - 12px)'}">
                        <div class="col-wrapper" style="display: flex; justify-content: space-between; height: 100%;">
                            <div class="col-left" style="width: calc(50% - 6px); display: flex; flex-direction: column;
                            justify-content: space-between; align-items: space-between;">
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
                                            <td>Rec. Retail Price:</td>
                                            <td style="text-align: right">{{product.yourPrice.recommended_retail_price}}</td>
                                        </tr>
                                        <tr>
                                            <td>Mark up:</td>
                                            <td style="text-align: right">{{product.yourPrice.mark_up}}</td>
                                        </tr>
                                        <tr style="font-weight: 700; ">
                                            <td style="padding-top: 4px;">Price ({{product.yourPrice.currency}})</td>
                                            <td style="text-align: right">{{product.yourPrice.wholesale_price}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                            <div class="col-right" style="width: calc(50% - 6px); display: flex; flex-direction: column;
                            justify-content: space-between; align-items: space-between;">
                                <div class="row-top">
                                    <table class="assortments">
                                        <tr v-for="(assortment, index) in product.assortments" :key="index">
                                            <td style="font-size: 7px;">{{assortment.name || 'Unknown assortment'}} ({{assortment.box_size || 0}})</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="row-bottom">
                                    <table class="input" style="width: 100%">
                                        <tr v-for="(user, index) in currentSelection.allUsers" :key="index">
                                            <td v-if="includeDistribution || exportComments" 
                                            style="font-size: 7px; border-bottom: solid 1px #E4E4E4; width: 60px;">
                                                {{user.name || 'Unknown user'}}
                                            </td>
                                            <td v-if="includeDistribution" 
                                            style="font-size: 7px; width: 24px; border-bottom: solid 1px #E4E4E4" 
                                            :style="{textAlign: !!product.feedbacks.find(x => x.user_id == user.id) 
                                            && product.feedbacks.find(x => x.user_id == user.id).action == 'Out' ? 'right' : 'left'}">
                                                <span v-if="!!product.feedbacks.find(x => x.user_id == user.id) 
                                                    && product.feedbacks.find(x => x.user_id == user.id).action != 'None'">
                                                    {{product.feedbacks.find(x => x.user_id == user.id).action == 'Out' ? 'O' 
                                                    : product.feedbacks.find(x => x.user_id == user.id).action == 'Focus' ? 'F' : 'I'}}
                                                </span>
                                            </td>
                                            <td v-if="exportComments" 
                                            style="font-size: 7px; width: 100%; border-bottom: solid 1px #E4E4E4;
                                            padding-left: 16px; text-align: right;">
                                                I am supposed to be a comment
                                            </td>
                                        </tr>
                                    </table>
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
        // visibility: hidden;
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