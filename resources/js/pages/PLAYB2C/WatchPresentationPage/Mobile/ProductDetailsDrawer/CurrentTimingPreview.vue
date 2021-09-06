<template>
    <div class="current-timing-preview bg-blur" v-if="currentTiming">
        <div class="rail flex-list">
            <PreviewListItem
                class="flex-shrink-0"
                v-for="variant in currentTiming.variantList"
                :key="variant.id"
                :variant="variant"
                :isCurrent="pdpItem.variant.id == variant.id"
                @click.native="onSetPdpItem(variant)"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PreviewListItem from './PreviewListItem'

export default {
    name: 'currentTimingPreview',
    components: { PreviewListItem },
    computed: {
        ...mapGetters('playPresentation', {
            currentTiming: 'getCurrentTiming',
            pdpItem: 'getPdpItem',
        }),
    },
    methods: {
        onSetPdpItem(variant) {
            this.$store.commit('playPresentation/SET_PDP_ITEM', { product: variant.product, variant })
        },
    },
}
</script>

<style lang="scss" scoped>
.current-timing-preview {
    padding: 8px;
    border-radius: 16px;
    max-width: calc(100% - 16px);
    .rail {
        overflow-x: auto;
        width: 100%;
    }
}
</style>
