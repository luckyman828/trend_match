<template>
    <div class="preview-list  bg-blur">
        <template v-if="currentTiming">
            <div class="rail flex-list flex-v">
                <PreviewListItem
                    v-for="variant in currentTiming.variantList"
                    :variant="variant"
                    :key="variant.id"
                    class="no-shrink"
                />
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PreviewListItem from './PreviewListItem'
export default {
    name: 'PreviewList',
    components: { PreviewListItem },
    computed: {
        ...mapGetters('playPresentation', {
            currentTiming: 'getCurrentTiming',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.preview-list {
    margin-left: auto;
    padding: 8px;
    border-radius: 8px;
    .rail {
        overflow-y: auto;
        max-height: 50vh;
    }
}
</style>
