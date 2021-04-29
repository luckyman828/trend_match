<template>
    <div class="flyin-wrapper" :class="[{ visible: isVisible }]">
        <div class="overlay" @click="close"></div>
        <div
            class="flyin"
            ref="flyIn"
            :class="[{ 'has-columns': columns > 1 }, placement == 'left' ? 'placement-left' : 'placement-right']"
        >
            <div class="flyin-inner">
                <!-- Error -->
                <BaseContentLoadError
                    v-if="status == 'error'"
                    :msg="errorMsg || 'error loading content'"
                    :callback="errorCallback"
                />

                <!-- Loading -->
                <BaseLoader v-else-if="status == 'loading'" :msg="loadingMsg || 'loading content'" />

                <!-- Ready -->
                <template v-else-if="isVisible">
                    <slot name="header" :toggle="toggle" />
                    <div class="body" :style="columnStyle">
                        <slot :toggle="toggle" />
                    </div>
                </template>
            </div>

            <slot name="alwaysVisible" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'baseFlyin',
    props: ['show', 'columns', 'disableKeyHandler', 'status', 'loadingMsg', 'errorMsg', 'errorCallback', 'placement'],
    data: function() {
        return {
            visible: false,
            flyinIndex: null,
        }
    },
    computed: {
        ...mapGetters('flyin', ['getVisibleFlyinCount']),
        ...mapGetters('lightbox', ['getLightboxIsVisible']),
        ...mapGetters('requests', ['getRequestThreadVisible']),
        ...mapGetters('contextMenu', {
            contextMenuVisible: 'getContextMenuIsVisible',
        }),
        isVisible() {
            return this.show ? this.show : this.visible
        },
        columnStyle() {
            return { gridTemplateColumns: `repeat(${this.columns}, ${100 / this.columns}%)` }
        },
    },
    watch: {
        isVisible(newVal) {
            if (newVal) {
                // SHOW
                this.init()
            } else {
                this.DECREMENT_VISIBLE_AMOUNT()
                document.body.removeEventListener('keydown', this.hotkeyHandler)
            }
        },
    },
    methods: {
        ...mapMutations('flyin', ['INCREMENT_VISIBLE_AMOUNT', 'DECREMENT_VISIBLE_AMOUNT']),
        init() {
            this.INCREMENT_VISIBLE_AMOUNT()
            this.flyinIndex = this.getVisibleFlyinCount
            document.body.addEventListener('keydown', this.hotkeyHandler)
        },
        close() {
            // this.DECREMENT_VISIBLE_AMOUNT()
            this.visible = false
            this.$emit('close')
        },
        toggle() {
            this.visible = !this.visible
            this.$emit('toggle')
        },
        reset() {
            // this.$refs.flyIn.webkitAnimationPlayState = 'running'
        },
        hotkeyHandler(event) {
            if (!this.disableKeyHandler) {
                const key = event.code
                // Only do these if the current target is not the comment box
                if (
                    !this.getLightboxIsVisible &&
                    event.target.type != 'textarea' &&
                    event.target.tagName.toUpperCase() != 'INPUT' &&
                    !this.contextMenuVisible &&
                    this.getVisibleFlyinCount == this.flyinIndex &&
                    !this.getRequestThreadVisible
                ) {
                    if (key == 'Escape') this.close()
                }
            }
        },
    },
    created() {
        if (this.isVisible) {
            this.init()
        }
    },
    destroyed() {
        if (this.isVisible) {
            this.DECREMENT_VISIBLE_AMOUNT()
            document.body.removeEventListener('keydown', this.hotkeyHandler)
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.flyin-wrapper {
    &.visible {
        > .overlay {
            display: block;
        }
        > .flyin {
            transform: none;
        }
    }
    &.light {
        .flyin-inner {
            background: white;
        }
    }
}
.overlay {
    z-index: 11;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba($dark, 50%);
    display: none;
}
.flyin {
    display: flex;
    flex-direction: column;
    right: 0;
    transform: translateX(100%);
    margin: 0;
    width: calc(100vw - 142px);
    min-width: 1032px;
    max-width: 1500px;
    z-index: 11;
    top: 0;
    position: fixed;
    height: 100vh;
    box-shadow: -2px 0 10px #0000001a;
    transition-timing-function: cubic-bezier(0.06, 0.975, 0.195, 0.985);
    transition: 0.2s;
    .flyin-inner {
        background: $bg;
        overflow: hidden;
        border-radius: 16px 0 0 0;
        height: 100%;
        width: 100%;
    }
    &.placement-left {
        right: auto;
        left: 0;
        transform: translateX(-100%);
        .flyin-inner {
            border-radius: 0 16px 0 0;
        }
    }
    .body {
        padding: 16px;
        flex: 1;
        overflow-y: auto;
    }
    &.has-columns {
        .body {
            padding: 0;
            display: grid;
            overflow: hidden;
        }
    }
}
// @keyframes flyin {
//     from {right: -100%;}
//     to {right: 0;}
// }
</style>
