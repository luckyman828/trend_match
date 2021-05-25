<template>
    <div class="preview-list flex-list flex-v bg-blur">
        <VariantPreview v-for="variant in timing.variants" :variant="variant" :key="variant.id" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VariantPreview from './VariantPreview'
export default {
    name: 'preview-list',
    components: { VariantPreview },
    computed: {
        ...mapGetters('playPresentation', {
            timing: 'getCurrentTiming',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.preview-list {
    top: 8px;
    left: 16px;
    padding: 8px;
    border-radius: 16px;
    width: 128px;
    transition: transform $videoPauseTransition;
    .desired-paused &,
    .recently-started & {
        transform: translateY(60px);
    }
}
</style>
