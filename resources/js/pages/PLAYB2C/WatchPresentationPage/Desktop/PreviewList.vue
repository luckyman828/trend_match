<template>
    <div class="preview-list-wrapper">
        <div class="preview-list bg-blur" ref="previewList">
            <div class="rail flex-list flex-v" @scroll="onScroll">
                <template v-if="currentTiming">
                    <template v-if="currentTiming.type == 'Single'">
                        <PreviewListItem :variant="currentTiming.variant" />
                    </template>
                    <template v-else>
                        <PreviewListItem
                            v-for="variantMap in currentTiming.productGroup.variantMaps"
                            :variant="variantMap.variant"
                            :key="variantMap.variant_id"
                            ref="listItem"
                        />
                    </template>
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
        onScroll() {
            // Hide
            for (const listItem of this.$refs.listItem) {
                listItem.hidePopover()
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
