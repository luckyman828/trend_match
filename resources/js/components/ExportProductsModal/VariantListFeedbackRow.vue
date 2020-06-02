<template>
    <tr>
        <td class="selection" style="padding-right: 8px; border-bottom: solid 1px #c4c4c4;">
            <span>{{variantFeedbackAuthor.user ? variantFeedbackAuthor.user.name : 'Anonymous' | truncate(16)}}</span>
        </td>
        <td v-for="(variant, index) in variants" :key="variant.id"
        style="border-bottom: solid 1px #c4c4c4; border-left: solid 1px #c4c4c4;"
        :style="[{textAlign: getVariantFeedback(variant) == 'Out' ? 'right' : 'left'},
        {padding: index == 0 ? '1px 28px 1px 12px' : index == variant.length - 1 ? '1px 12px 1px 28px' : '1px 28px'}]">
            <span style="font-size: 12px; margin-bottom: -3px; display: block; margin-top: -2px; font-weight: 900;">
                {{getVariantFeedback(variant) == 'Out' ? '⨯' 
                : getVariantFeedback(variant) == 'Focus' ? '★' 
                : getVariantFeedback(variant) == 'In' ? '♥' : ''}}
            </span>
        </td>
        <td style="width: 100%; border-bottom: solid 1px #c4c4c4; border-left: solid 1px #c4c4c4;"></td>
    </tr>
</template>

<script>
export default {
    name: 'variantListFeedbackRow',
    props: [
        'variantFeedbackAuthor',
        'variants',
    ],
    methods: {
        getVariantFeedback(variant) {
            const variantFeedback = variant.feedbacks.find(x => 
                x.selection_id == this.variantFeedbackAuthor.selection_id 
                && x.user_id == this.variantFeedbackAuthor.user_id)
            return variantFeedback ? variantFeedback.action : ''
        },
    }
}
</script>

<style>

</style>