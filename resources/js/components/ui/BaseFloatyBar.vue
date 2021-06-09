<template>
    <portal to="modals">
        <div
            class="base-floaty-bar bg-blur"
            :class="[{ show: show }, 'pos-' + pos, classes]"
            v-click-outside="onClickOutside"
        >
            <slot />
        </div>
    </portal>
</template>

<script>
export default {
    name: 'baseFloatyBar',
    props: ['show', 'autoHide', 'pos', 'classes'],
    methods: {
        onHide() {
            this.$emit('hide')
        },
        onClickOutside(e) {
            if (
                !this.autoHide ||
                (e && e.target && (e.target.classList.contains('popover') || e.target.closest('.popover')))
            )
                return
            this.onHide()
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.base-floaty-bar {
    position: fixed;
    bottom: -64px;
    left: 8px;
    height: 64px;
    width: calc(100vw - 16px);
    z-index: 9;
    border-radius: 8px;
    padding: 8px;
    button {
        font-size: 12px;
    }
    &.rounded {
        border-radius: 50px;
    }
    // transition: bottom 0.1s ease-out;
    // transition: transform 0.2s ease-out;
    // transform: translateY(calc(8px + 100%));
    &.show {
        // transform: none;
        animation: fly-in forwards ease-out 0.2s;
        animation-delay: 0.1s;
    }
    @keyframes fly-in {
        from {
            bottom: -64px;
        }
        to {
            bottom: 8px;
        }
    }
}
</style>
