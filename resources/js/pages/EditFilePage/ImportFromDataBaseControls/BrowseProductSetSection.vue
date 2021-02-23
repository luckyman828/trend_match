<template>
    <div class="browse-product-set-section">
        <BaseDropdownInputField
            :search="productSets.length > 5"
            placeholder="Choose product set"
            :options="productSets"
            v-model="selectedProductSets"
        />
        <BaseButton
            class="full-width import-button"
            buttonClass="primary full-width"
            :disabled="selectedProductSets.length <= 0"
            @click="onImportProducts"
        >
            <span>Import Products</span>
        </BaseButton>
    </div>
</template>

<script>
export default {
    name: 'browseProductSetSection',
    data() {
        return {
            productSets: [],
            selectedProductSets: [],
        }
    },
    methods: {
        fetchProductSets() {
            return [
                {
                    name: 'AO 2016',
                },
                {
                    name: 'AO 2017',
                },
                {
                    name: 'AO 2018',
                },
                {
                    name: 'AO 2019',
                },
                {
                    name: 'AO 2020',
                },
                {
                    name: 'AO 2021',
                },
            ]
        },
        onImportProducts() {
            console.log('i will import products from these set:', this.selectedProductSets)
        },
    },
    async created() {
        const productSets = await this.fetchProductSets()
        this.productSets = productSets
    },
}
</script>

<style scoped lang="scss">
.import-button {
    margin-top: 12px;
}
</style>
