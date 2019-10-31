<template>
    <div class="fly-in-wrapper" :class="[{visible: isVisible}]">
        <div class="overlay" @click="close"></div>
        <div class="fly-in" ref="flyIn">
            <slot :toggle="toggle"/>
        </div>
    </div>
</template>

<script>

export default {
    name: 'flyIn',
    props: [
        'visibleOverwrite'
    ],
    data: function () { return {
        visible: false,
    }},
    computed: {
        isVisible () {
            return (this.visibleOverwrite) ? this.visibleOverwrite : this.visible
        }
    },
    methods: {
        close () {
            this.visible = false
            this.$emit('close')
        },
        show () {
            this.visible = true
            this.$emit('show')
        },
        toggle () {
            this.visible = !this.visible
            this.$emit('toggle')
        },
        reset() {
            // this.$refs.flyIn.webkitAnimationPlayState = 'running'
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .fly-in-wrapper {
        &.visible {
            .overlay {
                display: block;
            }
            .fly-in {
                right: 0%;
            }
        }
    }
    .overlay {
        z-index: 10;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba($dark, 50%);
        display: none;
    }
    .fly-in {
        right: -100%;
        margin: 0;
        max-width: 1032px;
        z-index: 11;
        top: 0;
        position: fixed;
        height: 100vh;
        overflow: hidden;
        width: 100%;
        transition-timing-function: ease-out;
        transition: .3s;
        border-radius: 6px;
        &.animate {
            animation-name: fly-in;
            animation-duration: .3s;
            animation-iteration-count: 1;
        }
    }
    @keyframes fly-in {
        from {right: -100%;}
        to {right: 0;}
    }
</style>
