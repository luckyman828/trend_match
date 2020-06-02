<template>
    <div class="variant-list"
    style="padding: 16px 12px 0; border-top: solid 2px #cfcfcf; box-sizing: border-box;">
        <table class="variant-table" style="border-collapse: collapse;">
            <tr>
                <th></th>
                <th v-for="(variant, index) in variantsToShow" :key="variant.id"
                style="text-align: center;" 
                :style="[{padding: index == 0 ? '0 16px 0 0' : index == variantsToShow.length - 1 ? '0 0 0 16px' : '0 16px'}]">
                    <div class="image" style="height: 48px; display: inline-block; width: 38px;
                    background-size: contain; background-position: center; background-repeat: no-repeat; background-color: #e4e4e4;"
                    :style="{backgroundImage: `url(${variantImage(variant)})`}"></div>
                    <!-- <img :src="variantImage(variant)" style="height: 48px; display: inline-block; min-width: 38px; width: 38px"> -->
                    <span style="display: block; font-size: 10px; margin-top: 4px; font-weight: 500; color: #3c3b54;">{{variant.name || 'Unnamed' | truncate(7)}}</span>
                </th>
                <th style="width: 100%"></th>
            </tr>
            <!-- Alignment -->
            <tr>
                <td><strong style="font-size: 11px;">Alignment</strong></td>
            </tr>
            <tr v-for="(action) in product.actions" :key="'action-'+action.selection_id">
                <td class="selection" style="padding-right: 8px; border-bottom: solid 1px #c4c4c4;">
                    <span>{{action.selection.name | truncate(16)}}</span>
                </td>
                <td v-for="(variant, index) in variantsToShow" :key="variant.id"
                style="border-bottom: solid 1px #c4c4c4; border-left: solid 1px #c4c4c4;"
                :style="[{textAlign: variant.actions.find(x => x.selection_id == action.selection_id) 
                && variant.actions.find(x => x.selection_id == action.selection_id).action == 'Out' ? 'right' : 'left'},
                {padding: index == 0 ? '1px 28px 1px 12px' : index == variantsToShow.length - 1 ? '0 12px 0 28px' : '0 28px'}]">
                <!-- <td v-for="variant in variantsToShow" :key="variant.id"
                style="font-size: 10px; max-width: 28px; min-width: 28px; margin-left: 16px;"> -->
                    <span style="font-size: 12px; margin-bottom: -3px; display: block; margin-top: -2px; font-weight: 900;">
                        <!-- <span>{{variant.actions[0].selection_id == action.selection_id}}</span> -->
                        <!-- <span>{{variant.actions.find(x => x.selection_id == action.selection_id)}}</span> -->
                        {{variant.actions.find(x => x.selection_id == action.selection_id) ?
                        variant.actions.find(x => x.selection_id == action.selection_id).action == 'Out' ? '⨯' 
                        : variant.actions.find(x => x.selection_id == action.selection_id).action == 'Focus' ? '★' 
                        : variant.actions.find(x => x.selection_id == action.selection_id).action == 'In' ? '♥' : '' : ''}}
                    </span>
                </td>
                <td style="width: 100%; border-bottom: solid 1px #c4c4c4; border-left: solid 1px #c4c4c4;"></td>
            </tr>

            
            <!-- Feedback -->
            <tr>
                <td style="padding-top: 24px"><strong style="font-size: 11px">Feedback</strong></td>
            </tr>
            <VariantListFeedbackRow v-for="variantFeedbackAuthor in uniqueFeedbackAuthors" 
            :key="`feedback-${variantFeedbackAuthor.selection_id}-${variantFeedbackAuthor.user_id}`"
            :variants="variantsToShow" :variantFeedbackAuthor="variantFeedbackAuthor"/>

        </table>
        <!-- <div class="variant-list-item" v-for="variant in variantsToShow" :key="variant.id">

        </div> -->
    </div>
</template>

<script>
import variantImage from '../../mixins/variantImage'
import VariantListFeedbackRow from './VariantListFeedbackRow'

export default {
    name: 'variantList',
    props: [
        'product'
    ],
    components: {
        VariantListFeedbackRow
    },
    mixins: [
        variantImage,
    ],
    computed: {
        variantsToShow() {
            return this.product.variants.slice(0, 10)
        },
        uniqueFeedbackAuthors() {
            const unique = []
            this.product.variants.map(variant => {
                variant.feedbacks.map(feedback => {
                    const existingUser = unique.find(x => x.user_id == feedback.user_id && x.selection_id == feedback.selection_id)
                    if (!existingUser) unique.push({
                        user_id: feedback.user_id, 
                        selection_id: feedback.selection_id, 
                        user: feedback.user,
                        selection: feedback.selection
                    })
                })
            })
            return unique
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.variant-list {
    padding: 8px 12px;
}
</style>