<template>
    <div class="example-pdf">
        <div class="overlay" @click="$emit('close')"></div>
        <div class="wrapper" ref="pdfWrapper">
            <div class="inner" style="font-family: 'Roboto', sans-serif, helvetica, arial; position: relative;">
                <div class="page" v-for="(productChunk, index) in productChunks" :key="index"
                style="width: 576pt; height: 792pt; box-sizing: border-box; padding: 38px;
                display: flex; flex-wrap: wrap; justify-content: space-between; align-items: space-between;">
                    <div class="product-wrapper" v-for="product in productChunk" :key="product.datasource_id"
                    style="width: calc(50% - 12px); border: solid 2px; border-radius: 4px; height: calc(100% / 3 - 24px); box-sizing: border-box;">
                        <div class="col-wrapper" style="display: flex; justify-content: space-between;">
                            <div class="col-left" style="width: calc(50% - 12px); display: flex; flex-direction: column;
                            justify-content: space-between;">
                                <div class="row-top">
                                    <p>{{product.datasource_id}}</p>
                                    <p>{{product.title}}</p>
                                </div>
                                <div class="row-bottom">
                                    <div class="img-wrapper" style="position: relative; padding-top: 133.3333%;
                                    border: solid 2px; height: 0; width: 100%; margin-right: 24px;">
                                        <img :src="variantImage(product.variants[0])" style="; height: 100%; width: 100%; position: absolute;
                                        left: 0; top: 0; object-fit: contain;">
                                    </div>
                                    <table class="prices">
                                        <tr>
                                            <td>Rec. Retail Price:</td>
                                            <td style="text-align: right">{{product.prices[0] && product.prices[0].recommended_retail_price}}</td>
                                        </tr>
                                        <tr>
                                            <td>Rec. Retail Price:</td>
                                            <td style="text-align: right">{{product.prices[0] && product.prices[0].mark_up}}</td>
                                        </tr>
                                        <tr style="font-weight: 700;">
                                            <td>Price ({{product.prices[0] && product.prices[0].currency}})</td>
                                            <td style="text-align: right">{{product.prices[0] && product.prices[0].wholesale_price}}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- <div style="height: 1040px; width: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center;">
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
                    <img height="400px; width: auto;" v-if="product.variants[0] != null" :src="variantImage(product.variants[0])">
                    <div style="margin-left: 16px;">
                        <span style="display: block; font-size: 14px; font-weight: 700;">Style number</span>
                        <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.datasource_id}}</span>
                        <span style="display: block; font-size: 14px; font-weight: 700;">Category</span>
                        <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.category}}</span>
                        <span style="display: block; font-size: 14px; font-weight: 700;">Minimum production</span>
                        <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.min_order}} Units</span>
                        <span style="display: block; margin-bottom: 12px; font-size: 14px;">{{product.min_variant_order}} Units</span>
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
                    <div v-for="(variant, index) in product.variants" :key="index" style="flex: 1; overflow: hidden; padding: 8px; box-sizing: border-box; max-width: 100px;">
                        <div style="width: 100%; height: 100%;">
                            <div style="padding-top: 110%; width: 100%; position: relative; overflow: hidden;">
                                <img style="position: absolute; top: 0; left: 0; height:100%; width: 100%; object-fit: cover;" :src="variantImage(variant)">
                            </div>
                        </div>
                        <span style="font-size: 10px; font-weight: 500;">{{variant.name}}</span>
                    </div>
                </div>

                <div class="comments-wrapper" v-if="exportComments && (product.requests.length > 0 || product.comments.length > 0)">
                    <h2>Requests & Comments</h2>
                    <div v-for="request in product.requests" :key="request.id" style="border-radius: 6px; background: #3B86FF; color: white; padding: 8px 12px; margin-bottom: 16px; max-width: calc(100% - 120px);">
                        <p style="font-size: 12px; font-weight: 700; margin: 0;">{{request.selection_name}} | {{request.user_name || 'Unknown user'}}</p>
                        <p style="white-space: pre-wrap; word-wrap: break-word;">{{request.comment}}</p>
                        <p style="font-size: 10px; font-weight: 500; margin: 0;">Request ID: {{request.id}}</p>
                    </div>
                    <div v-for="comment in product.comments" :key="comment.id">
                        <p style="border-radius: 6px; background: #DFDFDF; color: #1B1C1D; padding: 8px 12px; display: inline-block; white-space: pre-wrap; word-wrap: break-word; margin-bottom: 0; max-width: calc(100% - 120px);">{{comment.comment}}</p>
                        <p style="font-size: 12px; font-weight: 500; color: #A8A8A8; margin-bottom: 16px; margin-top: 0">{{comment.selection_name}} | {{comment.user_name || 'Unknown user'}}</p>
                    </div>
                </div>

                <div class="distribution-wrapper" v-if="includeDistribution">
                    <h2>Distribution</h2>
                    <h3>IN ({{product.ins.length + product.focus.length}})</h3>
                    <div v-for="(action, index) in product.focus" :key="index" style="max-width: calc(100% - 120px); display: flex; align-items: center;">
                        <span class="impact" v-if="action.user && action.user.impact" style="width: 80px; font-size: 10px; font-weight: 500; display: inline-flex; align-items: center;">
                            Impact ({{action.user.impact}}) 
                            <span v-if="action.user.impact == 1" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #ff6565; margin-left: 4px;"></span>
                            <span v-if="action.user.impact == 2" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #f6993f; margin-left: 4px;"></span>
                            <span v-if="action.user.impact == 3" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #5ee2a0; margin-left: 4px;"></span>
                        </span>
                        <p style="font-size: 12px; font-weight: 700; margin: 0; display: inline-block;">{{action.selection_name}} | {{action.user_name || 'Unknown user'}}</p>
                        <span style="margin-left: 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #3b86ff;" v-if="action.action == 2">Focus</span>
                    </div>
                    <div v-for="(action, index) in product.ins" :key="index" style="max-width: calc(100% - 120px); display: flex; align-items: center;">
                        <span class="impact" v-if="action.user_impact" style="width: 80px; font-size: 10px; font-weight: 500; display: inline-flex; align-items: center;">
                            Impact ({{action.user_impact}}) 
                            <span v-if="action.user_impact == 1" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #ff6565; margin-left: 4px;"></span>
                            <span v-if="action.user_impact == 2" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #f6993f; margin-left: 4px;"></span>
                            <span v-if="action.user_impact == 3" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #5ee2a0; margin-left: 4px;"></span>
                        </span>
                        <p style="font-size: 12px; font-weight: 700; margin: 0; display: inline-block;">{{action.selection_name}} | {{action.user_name || 'Unknown user'}}</p>
                        <span style="margin-left: 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #3b86ff;" v-if="action.action == 2">Focus</span>
                    </div>
                    <h3>OUT ({{product.outs.length}})</h3>
                    <div v-for="(action, index) in product.outs" :key="index" style="max-width: calc(100% - 120px); display: flex; align-items: center;">
                        <span class="impact" v-if="action.user_impact" style="width: 80px; font-size: 10px; font-weight: 500; display: inline-flex; align-items: center;">
                            Impact ({{action.user_impact}}) 
                            <span v-if="action.user_impact == 1" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #ff6565; margin-left: 4px;"></span>
                            <span v-if="action.user_impact == 2" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #f6993f; margin-left: 4px;"></span>
                            <span v-if="action.user_impact == 3" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #5ee2a0; margin-left: 4px;"></span>
                        </span>
                        <p style="font-size: 12px; font-weight: 700; margin: 0; display: inline-block;">{{action.selection_name}} | {{action.user_name || 'Unknown user'}}</p>
                    </div>
                    <template v-if="includeNotDecided">
                        <h3>Not decided ({{product.nds.length}})</h3>
                        <div v-for="(user, index) in product.nds" :key="index" style="max-width: calc(100% - 120px); display: flex; align-items: center;">
                            <span class="impact" v-if="user.impact" style="width: 80px; font-size: 10px; font-weight: 500; display: inline-flex; align-items: center;">
                                Impact ({{user.impact}}) 
                                <span v-if="user.impact == 1" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #ff6565; margin-left: 4px;"></span>
                                <span v-if="user.impact == 2" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #f6993f; margin-left: 4px;"></span>
                                <span v-if="user.impact == 3" style="display: inline-block; height: 12px; width: 12px; border-radius: 50%; background: #5ee2a0; margin-left: 4px;"></span>
                            </span>
                            <p style="font-size: 12px; font-weight: 700; margin: 0; display: inline-block;">{{user.selection_name}}</p>
                        </div>
                    </template>
                </div>

            </div> -->
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import variantImage from '../../mixins/variantImage'

export default {
    name: 'exportPdf',
    mixins: [
        variantImage,
    ],
    props: [
        'products',
        'exportComments',
        'includeDistribution',
    ],
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFile']),
        productChunks() {
            const array = this.products
            const chunkedArr = [];
            const size = 6
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