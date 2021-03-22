<template>
    <div class="browse-product-set-section flex-list flex-v md">
        <div class="loading-wrapper" v-if="fetchingProducts">
            <BaseLoader :msg="loadingMsg" />
            <div class="flex-list flex-v center-h" v-if="fetchProgress">
                <div>
                    <strong>{{ Math.round((fetchProgress.done / fetchProgress.total) * 100) }}%</strong>
                </div>
                <div>{{ fetchProgress.done }} bundles of {{ fetchProgress.total }}</div>
            </div>
        </div>
        <template v-else>
            <BaseDropdownInputField
                innerLabel="Brand"
                :search="availableBrands.length > 5"
                placeholder="Choose brand"
                :options="availableBrands"
                nameKey="name"
                descriptionKey="company"
                v-model="selectedBrands"
                :resize="false"
                @close="onFetchBrandSeasons"
            >
                <button class="primary full-width" v-close-popover @click="onFetchBrandSeasons">
                    <span>Done</span>
                </button>
            </BaseDropdownInputField>
            <BaseLoader v-if="fetchingSeasons" msg="Getting seasons" />
            <BaseDropdownInputField
                v-else-if="selectedBrands.length > 0"
                innerLabel="Season"
                :search="availableSeasons.length > 5"
                placeholder="Choose season"
                :options="availableSeasons"
                nameKey="code"
                :resize="false"
                v-model="selectedSeasons"
            >
                <button class="primary full-width" v-close-popover>
                    <span>Done</span>
                </button>
            </BaseDropdownInputField>
            <!-- <BaseCheckboxInputField v-model="seasonStylesOnly">
                <span>Season styles only</span>
            </BaseCheckboxInputField> -->
            <BaseButton
                class="full-width import-button"
                buttonClass="primary full-width lg"
                :disabled="selectedSeasons.length <= 0"
                @click="onImportProducts"
            >
                <span>Import Products</span>
            </BaseButton>
        </template>
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'browseProductSetSection',
    data() {
        return {
            selectedSeasons: [],
            selectedBrands: [],
            fetchingSeasons: false,
            fetchingProducts: false,
            fetchProgress: null,
            // seasonStylesOnly: false,
            loadingMsg: 'Fetching Products',
        }
    },
    computed: {
        ...mapGetters('integrationDkc', {
            availableBrands: 'getBrandMap',
            availableSeasons: 'getAvailableSeasons',
        }),
        ...mapGetters('files', {
            currentFile: 'getCurrentFile',
        }),
        ...mapGetters('products', {
            allProducts: 'getProducts',
        }),
    },
    methods: {
        ...mapActions('integrationDkc', ['fetchAvailableSeasonsByBrand', 'fetchProducts']),
        ...mapActions('products', ['insertProducts']),
        async onImportProducts() {
            this.fetchingProducts = true
            let quotes = []
            const msgFetcher = setInterval(async () => {
                if (quotes.length == 0) {
                    await axios.get('https://type.fit/api/quotes').then(response => {
                        quotes = response.data
                    })
                }
                const index = Math.floor(Math.random() * quotes.length - 1) + 0
                const theQuote = quotes[index]
                this.loadingMsg = `"${theQuote.text}" - ${theQuote.author}`
            }, 10000)
            const products = await this.fetchProducts({
                seasons: this.selectedSeasons,
                brands: this.selectedBrands,
                progressCallback: progressObj => {
                    this.fetchProgress = progressObj
                },
            })
            if (!!products && products.length) {
                // Fix delivery dates for NOOS and RERUN styles
                // First, find the delivery dates on our none NOOS styles
                const seasonDeliveries = []
                const allProducts = this.allProducts
                allProducts.map(product => {
                    if (product.delivery_dates.length >= 12) return
                    product.delivery_dates.map(deliveryDate => {
                        if (!seasonDeliveries.includes(deliveryDate)) seasonDeliveries.push(deliveryDate)
                    })
                })
                products.map(product => {
                    if (product.delivery_dates.length < 12) {
                        return
                    }

                    product.delivery_dates = seasonDeliveries
                    product.variants.map(variant => {
                        variant.delivery_dates = seasonDeliveries
                    })
                })

                await this.insertProducts({ file: this.currentFile, products, addToState: true })
            }
            clearInterval(msgFetcher)
            this.fetchingProducts = false
        },
        async onFetchBrandSeasons() {
            if (this.selectedBrands.length <= 0) return
            this.fetchingSeasons = true
            await this.fetchAvailableSeasonsByBrand(this.selectedBrands)
            this.fetchingSeasons = false
        },
    },
}
</script>

<style scoped lang="scss">
.import-button {
    margin-top: 12px;
}
</style>
