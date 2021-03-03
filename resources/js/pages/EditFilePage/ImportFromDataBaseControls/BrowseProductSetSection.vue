<template>
    <div class="browse-product-set-section flex-list flex-v md">
        <BaseDropdownInputField
            innerLabel="Season"
            :search="productSets.length > 5"
            placeholder="Choose season"
            :options="productSets"
            v-model="selectedProductSets"
        />
        <BaseDropdownInputField
            innerLabel="Brand"
            :search="availableBrands.length > 5"
            placeholder="Choose brand"
            :options="availableBrands"
            v-model="selectedBrands"
        />
        <BaseCheckboxInputField v-model="seasonStylesOnly">
            <span>Season styles only</span>
        </BaseCheckboxInputField>
        <BaseButton
            class="full-width import-button"
            buttonClass="primary full-width lg"
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
            availableBrands: ['Fransa', 'Dranella', 'InWear', 'Matinique', 'Cream'],
            selectedBrands: [],
            seasonStylesOnly: false
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
