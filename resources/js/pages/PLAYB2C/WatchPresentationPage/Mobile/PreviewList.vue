<template>
    <div class="preview-list-wrapper">
        <div class="preview-list bg-blur fly-out" ref="previewList">
            <div class="rail flex-list flex-v">
                <template v-if="currentTiming">
                    <PreviewListItem
                        v-for="variant in currentTiming.variantList"
                        :variant="variant"
                        :key="variant.id"
                        class="no-shrink"
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
    name: 'PreviewList',
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
    mounted() {
        this.onNewTiming(this.timing)
    },
}
</script>

<style lang="scss" scoped>
.preview-list-wrapper {
    margin-left: auto;
}
.preview-list {
    margin-left: auto;
    padding: 8px;
    border-radius: 8px;
    transition: transform 0.2s ease-out;
    &.fly-out {
        transform: translateX(calc(100% + 8px));
    }
    .rail {
        overflow-y: auto;
        max-height: 50vh;
    }
}
</style>
