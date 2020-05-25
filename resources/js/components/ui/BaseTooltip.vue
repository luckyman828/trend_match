<template>
    <div class="tooltip popover">
        <div class="tooltip-inner" v-if="visible">
            <slot/>
        </div>
        <div class="tooltip-arrow popover-arrow" data-popper-arrow></div>
    </div>
</template>

<script>
export default {
    name: 'baseTooltip',
    data() { return {
        visible: false
    }},
    methods: {
        show(showArg) {
            this.visible = true
            this.$emit('show', showArg)
        },
        hide() {
            this.visible = false
            this.$emit('hide')
        }
    }
}
</script>

<style scoped land="scss">
.tooltip-inner {
    padding: 0;
}

</style>