<template>
    <div class="fly-in-wrapper" :class="[{visible: isVisible}]">
        <div class="overlay" @click="close"></div>
        <div class="fly-in" ref="flyIn" :class="[{'has-columns': columns > 1}, placement == 'left' ? 'placement-left' : 'placement-right']">
            <template v-if="!loading">
                <slot name="header" :toggle="toggle"/>
                <div class="body" :style="columnStyle">
                    <slot :toggle="toggle"/>
                </div>
            </template>
            <BaseLoader v-else/>
        </div>
    </div>
</template>

<script>

export default {
    name: 'baseFlyin',
    props: [
        'show',
        'columns',
        'disableKeyHandler',
        'loading',
        'placement',
    ],
    data: function () { return {
        visible: false,
    }},
    computed: {
        isVisible () {
            return (this.show) ? this.show : this.visible
        },
        columnStyle () {
            return {gridTemplateColumns: `repeat(${this.columns}, ${100/this.columns}%)`}
        }
    },
    methods: {
        close () {
            this.visible = false
            this.$emit('close')
        },
        toggle () {
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
                if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT') {
                    if (key == 'Escape')
                        this.close()
                }
            }
        }
    },
    created() {
        document.body.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .fly-in-wrapper {
        &.visible {
            > .overlay {
                display: block;
            }
            > .fly-in {
                transform: none;
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
    .fly-in {
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
        box-shadow: -2px 0 10px #0000001A;
        background: $bg;
        // transition-timing-function: ease-out;
        transition-timing-function: cubic-bezier(0.060, 0.975, 0.195, 0.985);;
        transition: .2s;
        // &.animate {
        //     animation-name: fly-in;
        //     animation-duration: .2s;
        //     animation-iteration-count: 1;
        // }
        &.placement-left {
            right: auto;
            left: 0;
            transform: translateX(-100%);
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
    // @keyframes fly-in {
    //     from {right: -100%;}
    //     to {right: 0;}
    // }
</style>
