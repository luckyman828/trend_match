<template>
    <div class="preview-list-wrapper">
        <div class="preview-list flex-list flex-v bg-blur" ref="previewList">
            <template v-if="currentTiming">
                <template v-if="currentTiming.type == 'Single'">
                    <VariantPreview :variant="currentTiming.variant" />
                </template>
                <template v-else>
                    <VariantPreview
                        v-for="variantMap in currentTiming.productGroup.variantMaps"
                        :variant="variantMap.variant"
                        :key="variantMap.variant_id"
                    />
                </template>
            </template>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VariantPreview from './VariantPreview'
export default {
    name: 'preview-list',
    components: { VariantPreview },
    data() {
        return {
            currentTiming: null,
        }
    },
    computed: {
        ...mapGetters('playPresentation', {
            timing: 'getCurrentTiming',
        }),
    },
    watch: {
        timing(newVal, oldVal) {
            if (!oldVal || !newVal || newVal.id != oldVal.id) {
                this.onNewTiming(newVal)
            }
        },
    },
    methods: {
        async onNewTiming(newTiming) {
            const animationDuration = 200
            const el = this.$refs.previewList

            // Add class fly-out
            el.classList.add('fly-out')

            // Wait a little
            await this._delay(animationDuration)

            // Set new timing
            this.currentTiming = newTiming

            // Add class fly-in
            if (newTiming) {
                // Wait a little before showing the new
                await this._delay(100)
                el.classList.remove('fly-out')
            } else {
                await this._delay(100)
                el.classList.add('fly-out')
            }
        },
    },
    created() {
        this.currentTiming = this.timing
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.preview-list-wrapper {
    transition: transform $videoPauseTransition;
    pointer-events: none !important;
    .desired-paused &,
    .recently-started & {
        transform: translateY(60px);
    }
}
.preview-list {
    top: 8px;
    left: 16px;
    padding: 8px;
    border-radius: 16px;
    width: 128px;
    pointer-events: all;
    transition: transform 0.2s ease-out;
    &.fly-out {
        transform: translateX(calc(-100% - 16px));
    }
}
</style>
