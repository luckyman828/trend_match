<template>
    <div class="drawer-wrapper" :class="[{ show: show }]">
        <div class="overlay" @click="$emit('close')" />
        <div class="drawer" :class="[`pos-${position}`, { extend: extend }]" :style="extendStyle">
            <div class="header" v-touch:swipe.down="onSwipeDown" :class="{ 'show-shadow': showHeaderShadow }">
                <slot name="header" />
            </div>
            <div class="body" @scroll.passive="onScrollBody">
                <div class="body-rail" :style="bodyStyle" @scroll.passive="onScrollBody">
                    <slot />
                </div>
            </div>
        </div>
        <div class="footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseDrawer',
    props: ['show', 'position'],
    data: function() {
        return {
            extend: false,
            extendAmount: 0,
            extendMax: 100,
        }
    },
    computed: {
        extendStyle() {
            if (!this.show) return
            const max = this.extendMax

            return {
                transform: `translateY(calc(18vh - ${Math.max(Math.min(max, this.extendAmount), 0)}px))`,
            }
        },
        bodyStyle() {
            if (!this.show) return
            const max = this.extendMax

            return {
                transform: `translateY(calc(-18vh + ${Math.max(Math.min(max, this.extendAmount), 0)}px))`,
            }
        },
        showHeaderShadow() {
            return this.extendAmount > this.extendMax
        },
    },
    watch: {
        show(isVisible) {
            this.extendAmount = 0
            if (isVisible) {
                this.$store.dispatch('playEmbed/postMessage', { action: 'disableClose' })
            } else {
                this.$store.dispatch('playEmbed/postMessage', { action: 'enableClose' })
            }
        },
    },
    methods: {
        onSwipeDown() {
            this.$emit('close')
            this.extend = false
        },
        onScrollBody(e) {
            const threshold = 20
            const scrollY = e.target.scrollTop
            if (scrollY > this.extendAmount) {
                this.extendAmount = scrollY
            }
            if (scrollY > threshold) {
                this.extend = true
            } else {
                this.$nextTick(() => {
                    this.extend = false
                })
            }
        },
    },
}
</script>

<style scoped lang="scss">
.drawer-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    pointer-events: none;
    .overlay {
        display: none;
        z-index: 1;
    }
    .drawer {
        // height: 548px;
        height: 100%;
        width: 100%;
        position: absolute;
        background: white;
        transition: transform 0.2s ease-out;
        z-index: 2;
        display: flex;
        flex-direction: column;
        .header {
            padding: 12px 16px;
            // min-height: 80px;
            // &.show-shadow {
            //     box-shadow: $shadowModule;
            // }
        }
        &.extend {
            transition: transform 0.1s ease-out;
        }
        &.pos-bottom {
            bottom: 0;
            border-radius: 16px 16px 0 0;
            transform: translateY(100%);
            max-height: 85vh;
            .body {
                overflow: auto;
            }
            .body-rail {
                padding-top: 18vh;
                overflow-y: auto;
                height: 100%;
                transition: transform 0.1s ease-out;
            }
            // &.extend {
            //     transform: translateY(-18vh);
            // }
        }
    }
    &.show {
        z-index: 1;
        pointer-events: all;
        .drawer {
            transform: none;
            &.pos-bottom:not(.extend) {
                // transform: translateY(18vh);
            }
        }
        .overlay {
            display: block;
        }
    }
    > .footer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 2;
    }
}
</style>
