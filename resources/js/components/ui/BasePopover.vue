<template>
    <div class="base-popover popover vue-popover-theme">
        <div class="wrapper">
            <div class="popover-inner" v-if="visible">
                <slot />
            </div>
            <!-- <div class="tooltip-arrow popover-arrow" data-popper-arrow></div> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'basePopover',
    data() {
        return {
            visible: false,
        }
    },
    methods: {
        show(showArg) {
            this.visible = true
            this.$emit('show', showArg)
        },
        hide() {
            this.visible = false
            this.$emit('hide')
        },
    },
}
</script>

<style scoped land="scss">
.popover {
    position: absolute;
    top: 0;
    left: 0;
    /* overflow-x: hidden;
    overflow-y: auto; */
}
.popover-inner {
    padding: 0;
    height: 100%;
    overflow-y: auto;
    font-size: 12px;
}
</style>
