<template>
    <div class="preview-list flex-list flex-v bg-blur">
        <template v-if="currentTiming">
            <PreviewListItem v-for="variant in currentTiming.variantList" :variant="variant" :key="variant.id" />
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
}
</style>
