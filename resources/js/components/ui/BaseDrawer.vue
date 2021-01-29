<template>
    <div class="drawer-wrapper" :class="[{ show: show }]">
        <div class="overlay" @click="$emit('close')" />
        <div class="drawer" :class="[`pos-${position}`, { extend: extend }]" :style="extendStyle">
            <div class="header" v-touch:swipe.down="onSwipeDown">
                <slot name="header" />
            </div>
            <div class="body" @scroll.capture.passive="onScrollBody">
                <slot />
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
        }
    },
    computed: {
        extendStyle() {
            if (!this.show) return
            const max = 100

            return {
                transform: `translateY(calc(18vh - ${Math.max(Math.min(max, this.extendAmount), 0)}px))`,
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
            this.extendAmount = scrollY
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
            padding: 20px 16px;
            // min-height: 80px;
        }
        &.extend {
            transition: transform 0.1s ease-out;
        }
        &.pos-bottom {
            bottom: 0;
            border-radius: 16px 16px 0 0;
            transform: translateY(100%);
            max-height: 90vh;
            .body {
                overflow-y: auto;
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
