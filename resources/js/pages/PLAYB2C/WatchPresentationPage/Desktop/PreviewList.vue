<template>
    <div class="preview-list-wrapper">
        <div class="preview-list flex-list flex-v bg-blur" ref="previewList">
            <VariantPreview v-for="variant in currentTiming.variants" :variant="variant" :key="variant.id" />
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
            if (!oldVal || newVal.id != oldVal.id) {
                this.onNewTiming(newVal)
            }
        },
    },
    methods: {
        onNewTiming(newTiming) {
            const duration = 400
            this.$refs.previewList.classList.add('animate')
            setTimeout(() => {
                this.$refs.previewList.classList.remove('animate')
            }, duration)
            setTimeout(() => {
                this.currentTiming = newTiming
            }, (duration / 100) * 40)
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
    &.animate {
        animation: flyin 0.4s ease-out 1 forwards;
    }
    &.fly-out {
        animation: flyin 0.4s ease-out 1 forwards reverse;
    }
    @keyframes flyin {
        0% {
            transform: translateX(0);
        }
        40% {
            transform: translateX(calc(-100% - 16px));
        }
        60% {
            transform: translateX(calc(-100% - 16px));
        }
        100% {
            transform: translateX(0);
        }
    }
}
</style>
