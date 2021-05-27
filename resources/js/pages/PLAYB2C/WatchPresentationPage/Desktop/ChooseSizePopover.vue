<template>
    <v-popover class="size-selector" trigger="click" ref="sizePopover" v-bind="$attrs">
        <slot />
        <BaseSelectButtons
            v-if="variant"
            header="Choose size"
            slot="popover"
            type="radio"
            :submitOnChange="true"
            :options="variant.ean_sizes"
            optionNameKey="size"
            optionValueKey="size"
            v-model="selectedSize"
            @change="onChangeSize"
        />
    </v-popover>
</template>

<script>
export default {
    name: 'chooseSizePopover',
    props: ['variant', 'value'],
    data() {
        return {
            selectedSize: null,
        }
    },
    watch: {
        value() {
            this.selectedSize = this.value
        },
    },
    methods: {
        onChangeSize(size) {
            this.$emit('input', size)
            this.$emit('submit', size)
            this.$nextTick(() => {
                this.$refs.sizePopover.hide()
            })
        },
        reset() {
            this.selectedSize = this.value
        },
    },
}
</script>

<style></style>
