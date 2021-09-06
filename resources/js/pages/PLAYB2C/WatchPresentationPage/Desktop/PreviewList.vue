<template>
    <div class="preview-list-wrapper" :class="{ 'pdp-open': pdpOpen }">
        <div class="preview-list bg-blur fly-out" ref="previewList">
            <div class="rail flex-list flex-v" @scroll="onScroll">
                <template v-if="currentTiming">
                    <PreviewListItem
                        v-for="variant in currentTiming.variantList"
                        :variant="variant"
                        :key="variant.id"
                        ref="listItem"
                        @size-popover-open="onPopoverOpen(variant.id, $event)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PreviewListItem from './PreviewListItem'
export default {
    name: 'preview-list',
    components: { PreviewListItem },
    data() {
        return {
            currentTiming: null,
            openSizePopovers: [],
        }
    },
    computed: {
        ...mapGetters('playPresentation', {
            timing: 'getCurrentTiming',
            pdpItem: 'getPdpItem',
        }),
        pdpOpen() {
            return !!this.pdpItem
        },
        sizePopoverOpen() {
            return this.openSizePopovers.length > 0
        },
    },
    watch: {
        timing(newVal, oldVal) {
            if (!oldVal || !newVal || newVal.id != oldVal.id) {
                this.onNewTiming(newVal)
            }
        },
        sizePopoverOpen(isOpen) {
            if (!isOpen && this.timing && (!this.currentTiming || this.timing.id != this.currentTiming.id)) {
                this.onNewTiming(this.timing)
            }
        },
    },
    methods: {
        async onNewTiming(newTiming) {
            // Do nothing if we are in the middle of choosing a size while adding to basket
            if (this.sizePopoverOpen) return

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
        onScroll() {
            // Hide
            for (const listItem of this.$refs.listItem) {
                listItem.hidePopover()
            }
        },
        onPopoverOpen(variantId, isOpen) {
            if (isOpen) {
                this.openSizePopovers.push(variantId)
            } else {
                const index = this.openSizePopovers.findIndex(x => x == variantId)
                if (index >= 0) {
                    this.openSizePopovers.splice(index, 1)
                }
            }
        },
    },
    mounted() {
        this.onNewTiming(this.timing)
    },
}
</script>

<style lang="scss" scoped>
.preview-list-wrapper {
    transition: transform $videoPauseTransition;
    transform-origin: top left;
    pointer-events: none !important;
    position: absolute;
    z-index: 2;
    .desired-paused &,
    .recently-started & {
        transform: translateY(60px);
        &.pdp-open {
            // transform: translateY(60px) translateX(384px) scale(0.5);
            // transform: translateY(60px) translateX(384px);
        }
    }
    &.pdp-open {
        // transform: translateX(384px) scale(0.5);
        transform: translateX(384px);
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
    overflow: hidden;
    max-height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    &.fly-out {
        transform: translateX(calc(-100% - 16px));
    }
    .rail {
        overflow-y: scroll;
        padding-right: 4px;
        margin-right: -8px;
        &::-webkit-scrollbar-track {
            background: transparent;
        }
    }
}
</style>
