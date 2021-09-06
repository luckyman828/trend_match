<template>
    <BaseSelectButtons
        v-if="variant"
        header="Choose size"
        slot="popover"
        type="radio"
        :submitOnChange="true"
        :options="variant.ean_sizes"
        :disabledOptions="variant.ean_sizes.filter(sizeObj => !sizeObj.inStock)"
        optionNameKey="size"
        v-model="selectedSize"
        @change="onChangeSize"
    >
        <template v-slot:after="slotProps">
            <div class="pill red xs" v-if="slotProps.option.quantity <= 0" style="margin-left: 8px;">
                <span>Sold out</span>
            </div>
        </template>
    </BaseSelectButtons>
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
