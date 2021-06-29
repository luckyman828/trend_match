<template>
    <BaseSelectButtons
        v-if="variant"
        header="Choose size"
        slot="popover"
        type="radio"
        :submitOnChange="true"
        :options="variant.ean_sizes"
        optionNameKey="size"
        v-model="selectedSize"
        @change="onChangeSize"
    />
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
        },
        reset() {
            this.selectedSize = this.value
        },
    },
    created() {
        this.selectedSize = this.value
    },
}
</script>

<style></style>
