<template>
    <div class="results-page">
        <div class="header flex-list min justify">
            <div class="left">
                <h1>{{ file.name }}</h1>
            </div>

            <div class="center flex-list">
                <BaseDropdownInputField
                    :options="availableSelections"
                    valueKey="id"
                    type="radio"
                    placeholder="Choose selection"
                    v-model="selectionId"
                    innerLabel="Selection"
                >
                </BaseDropdownInputField>
                <BaseDropdownInputField
                    :options="availableUsers"
                    valueKey="id"
                    type="radio"
                    placeholder="Choose user"
                    v-model="userId"
                    innerLabel="User"
                >
                </BaseDropdownInputField>
                <BaseDropdownInputField
                    :options="['All', 'In', 'Out', 'None']"
                    type="radio"
                    placeholder="Choose action"
                    v-model="actionFilter"
                    innerLabel="Action"
                    :disabled="!selectionId"
                    disabledTooltip="You must choose a selection first"
                >
                </BaseDropdownInputField>
            </div>
            <div class="right">
                <button class="primary">
                    <span>Export PDF</span>
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </div>
        <div class="product-list">
            <BaseLoader v-if="fetchingData" />
            <ProductListItem
                v-else
                v-for="product in products"
                :key="product.id"
                :product="product"
                :actionFilter="actionFilter"
                :userId="userId"
                :selectionId="selectionId"
            />
        </div>
        <div class="order-total flex-list lg center-h theme-light" v-if="products.length > 0">
            <div class="list-item" v-if="orderedDates.length > 0">
                <label>First delivery</label>
                <div class="value">{{ getPrettyDate(orderedDates[0]) }}</div>
            </div>
            <div class="list-item" v-if="orderedDates.length > 0">
                <label>Last delivery</label>
                <div class="value">{{ getPrettyDate(orderedDates[orderedDates.length - 1]) }}</div>
            </div>
            <div class="list-item" v-if="orderedDates.length > 0">
                <label>Products</label>
                <div class="value">{{ products.length }}</div>
            </div>
            <div class="list-item" v-if="orderedDates.length > 0">
                <label>Variants</label>
                <div class="value">
                    {{ variantsFiltered.length }}
                </div>
            </div>
            <div class="list-item" v-if="orderedDates.length > 0">
                <label>Total Quantity</label>
                <div class="value">{{ totalQuantity }}</div>
            </div>
            <div class="list-item" v-if="orderedDates.length > 0">
                <label>Total Price</label>
                <div class="value">{{ totalPrice }} {{ products[0].yourPrice.currency }}</div>
            </div>
            <!-- <button class="primary">
                <i class="far fa-share"></i>
                <span>Export PDF</span>
            </button> -->
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProductListItem from './ProductListItem'
import pdfExport from './pdfExport'
export default {
    name: 'resultsPage',
    components: { ProductListItem },
    data: function() {
        return {
            selectionId: null,
            userId: null,
            fetchingData: false,
            actionFilter: 'All',
        }
    },
    computed: {
        ...mapGetters('files', {
            file: ['getCurrentFile'],
        }),
        ...mapGetters('selections', {
            availableSelections: ['getSelectionsAvailableForPresentation'],
        }),
        ...mapGetters('products', {
            allProducts: 'products',
        }),
        orderedDates() {
            const uniqueDates = []
            this.products.map(product =>
                product.delivery_dates.map(date => {
                    const existsInArray = uniqueDates.find(x => x == date)
                    if (!existsInArray) uniqueDates.push(date)
                })
            )
            return uniqueDates.sort((a, b) => {
                return new Date(a) > new Date(b) ? 1 : -1
            })
            // return this.products.sort((a, b) => {
            //     return a.delivery_dates.find(aDate => b.delivery_dates.find(bDate => new Date(aDate) < new Date(bDate)))
            //         ? 1
            //         : -1
            // })
        },
        products() {
            let productsFilterded = this.allProducts
            const actionFilter = this.actionFilter
            if (!actionFilter || actionFilter == 'All') return productsFilterded

            // Filter by action
            productsFilterded = this.allProducts.filter(product => {
                const selectionInput = product.selectionInputList.find(x => x.selection.id == this.selectionId)
                let productAction = selectionInput.action
                if (this.userId) {
                    const userFeedback = selectionInput.feedbacks.find(x => {
                        return x.selection_id == this.selectionId && x.user_id == this.userId
                    })
                    productAction = userFeedback && userFeedback.action
                }
                if (actionFilter == 'In') return ['In', 'Focus'].includes(productAction)
                return actionFilter == productAction
            })

            // Sort by delivery
            return productsFilterded.sort((a, b) => {
                return a.delivery_dates.find(aDate => b.delivery_dates.find(bDate => new Date(aDate) < new Date(bDate)))
                    ? -1
                    : 1
            })
        },
        availableUsers() {
            const users = []
            this.allProducts.map(product => {
                const selectionInput = product.getActiveSelectionInput
                if (!selectionInput) return
                selectionInput.feedbacks.map(feedback => {
                    if (!feedback.user) return
                    const alreadyAdded = users.find(x => x.id == feedback.user.id)
                    if (!alreadyAdded) users.push(feedback.user)
                })
            })
            // Add an option to not filter by user
            users.unshift({ name: 'No user', id: null })
            return users
        },
        variantsFiltered() {
            const variants = []
            this.products.map(product => {
                let variantsFiltered = product.variants
                const actionFilter = this.actionFilter
                if (this.selectionId && actionFilter && actionFilter != 'All') {
                    variantsFiltered = product.variants.filter(variant => {
                        const selectionInput = product.selectionInputList.find(x => x.selection.id == this.selectionId)
                        const variantSelectionInput = selectionInput.variants.find(x => x.id == variant.id)
                        let variantAction = variantSelectionInput.action
                        if (this.userId) {
                            const userFeedback = variantSelectionInput.feedbacks.find(x => {
                                return x.selection_id == this.selectionId && x.user_id == this.userId
                            })
                            variantAction = userFeedback && userFeedback.action
                        }
                        if (actionFilter == 'In') return ['In', 'Focus'].includes(variantAction)
                        return actionFilter == variantAction
                    })
                }
                variants.push(...variantsFiltered)
            })
            return variants
        },
        totalQuantity() {
            return Math.round(
                this.products.reduce((total, product) => {
                    let variantsFiltered = product.variants
                    const actionFilter = this.actionFilter
                    if (this.selectionId && actionFilter && actionFilter != 'All') {
                        variantsFiltered = product.variants.filter(variant => {
                            const selectionInput = product.selectionInputList.find(
                                x => x.selection.id == this.selectionId
                            )
                            const variantSelectionInput = selectionInput.variants.find(x => x.id == variant.id)
                            let variantAction = variantSelectionInput.action
                            if (this.userId) {
                                const userFeedback = variantSelectionInput.feedbacks.find(x => {
                                    return x.selection_id == this.selectionId && x.user_id == this.userId
                                })
                                variantAction = userFeedback && userFeedback.action
                            }
                            if (actionFilter == 'In') return ['In', 'Focus'].includes(variantAction)
                            return actionFilter == variantAction
                        })
                    }

                    return (total += variantsFiltered.reduce((variantTotal, variant) => {
                        if (!this.selectionId) return variantTotal
                        const selectionInput = product.selectionInputList.find(x => x.selection.id == this.selectionId)
                        if (!selectionInput) return variantTotal
                        const variantSelectionInput = selectionInput.variants.find(x => x.id == variant.id)
                        if (!variantSelectionInput) return variantTotal
                        let variantQuantity = variantSelectionInput.quantity
                        if (this.userId) {
                            const userFeedback = variantSelectionInput.feedbacks.find(x => {
                                return x.selection_id == this.selectionId && x.user_id == this.userId
                            })
                            variantQuantity = userFeedback ? userFeedback.quantity : 0
                        }
                        return (variantTotal += variantQuantity)
                    }, 0))
                }, 0)
            )
        },
        totalPrice() {
            return Math.round(
                this.products.reduce((total, product) => {
                    let variantsFiltered = product.variants
                    const actionFilter = this.actionFilter
                    if (this.selectionId && actionFilter && actionFilter != 'All') {
                        variantsFiltered = product.variants.filter(variant => {
                            const selectionInput = product.selectionInputList.find(
                                x => x.selection.id == this.selectionId
                            )
                            const variantSelectionInput = selectionInput.variants.find(x => x.id == variant.id)
                            let variantAction = variantSelectionInput.action
                            if (this.userId) {
                                const userFeedback = variantSelectionInput.feedbacks.find(x => {
                                    return x.selection_id == this.selectionId && x.user_id == this.userId
                                })
                                variantAction = userFeedback && userFeedback.action
                            }
                            if (actionFilter == 'In') return ['In', 'Focus'].includes(variantAction)
                            return actionFilter == variantAction
                        })
                    }

                    return (total += variantsFiltered.reduce((variantTotal, variant) => {
                        if (!this.selectionId) return variantTotal
                        const selectionInput = product.selectionInputList.find(x => x.selection.id == this.selectionId)
                        if (!selectionInput) return variantTotal
                        const variantSelectionInput = selectionInput.variants.find(x => x.id == variant.id)
                        if (!variantSelectionInput) return variantTotal
                        let variantQuantity = variantSelectionInput.quantity
                        if (this.userId) {
                            const userFeedback = variantSelectionInput.feedbacks.find(x => {
                                return x.selection_id == this.selectionId && x.user_id == this.userId
                            })
                            variantQuantity = userFeedback ? userFeedback.quantity : 0
                        }
                        return (variantTotal += variantQuantity * product.yourPrice.wholesale_price)
                    }, 0))
                }, 0)
            )
        },
    },
    watch: {
        selectionId(newVal) {
            if (this.$route.query.selectionId == newVal) return
            this.$router.replace({ query: { ...this.$route.query, selectionId: newVal } })
            this.onNewSelectionId(newVal)
        },
        userId(newVal) {
            if (this.$route.query.userId == newVal) return
            this.$router.replace({ query: { ...this.$route.query, userId: newVal } })
            this.onNewUserId(newVal)
        },
    },
    methods: {
        ...mapActions('products', ['fetchSelectionProducts']),
        ...mapActions('selections', ['fetchSelection']),
        ...mapMutations('products', ['setCurrentProductFilter']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        async onNewSelectionId(selectionId) {
            this.fetchingData = true
            const selection = this.availableSelections.find(x => x.id == selectionId)
            this.SET_CURRENT_SELECTIONS([selection])
            if (!this.allProducts[0].selectionInputList.find(x => x.selection_id == selectionId)) {
                await this.fetchSelectionProducts(selection)
            }
            this.fetchingData = false
        },
        onNewUserId(userId) {},
        async initSelection() {
            const selectionId = this.$route.query.selectionId
            if (!selectionId) return
            this.fetchingData = true

            let selectionIsAvailable = !!this.availableSelections.find(x => x.id == selectionId)
            if (!selectionIsAvailable) {
                const selection = await this.fetchSelection({ selectionId })
                selectionIsAvailable = true
            }
            if (selectionIsAvailable) {
                this.selectionId = selectionId
                await this.onNewSelectionId(selectionId)
            }
            this.actionFilter = 'In'
        },
    },
    async created() {
        // Check if the selection is available
        this.initSelection()

        const userId = this.$route.query.userId
        const userIsAvailable = this.availableUsers.find(x => x.id == userId)
        if (userIsAvailable) {
            this.userId = userId
            this.onNewUserId(userId)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.results-page {
    padding: 20px;
    padding-bottom: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
    h1 {
        margin: 0;
    }
    .header {
        padding-bottom: 20px;
        > * {
            flex: 1;
            display: flex;
        }
        .center {
            justify-content: center;
        }
        .right {
            justify-content: flex-end;
        }
    }
    .product-list {
        width: 600px;
        margin: 0 auto;
        padding: 0px 20px 0 30px;
        overflow-y: auto;
        &::-webkit-scrollbar-track {
            border-radius: 6px;
        }
    }
    .order-total {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 20px;
        border-top: $borderModule;
        box-shadow: $shadowModule;
    }
    .list-item {
        > * {
            display: block;
            &:first-line {
                line-height: 1;
                white-space: normal;
            }
        }

        label {
            font-size: 11px;
            font-weight: 400;
            display: block;
            margin-bottom: 6px;
            color: $bluegrey500;
        }
        .value {
            font-size: 14px;
            font-weight: 700;
            &.description {
                white-space: pre-line;
                word-break: break-word;
                &:first-line {
                    line-height: 1.6;
                }
            }
        }
    }
}
</style>
