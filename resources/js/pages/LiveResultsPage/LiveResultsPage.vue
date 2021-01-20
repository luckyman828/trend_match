<template>
    <div class="live-results-page">
        <div class="header flex-list min justify">
            <div class="left">
                <h1>{{ file.name }}</h1>
            </div>

            <div class="center flex-list">
                <button
                    class="white"
                    :class="{ 'is-current': currentSelectionId == selection.id }"
                    v-for="selection in availableSelections"
                    :key="selection.id"
                    @click="onNewSelectionId(selection.id)"
                >
                    <SelectionIcon :selection="selection" />
                    <span>{{ selection.name }}</span>
                </button>
            </div>
            <div class="right flex-list">
                <BaseButton buttonClass="primary" :disabled="true" disabledTooltip="Not implemented yet.">
                    <span>Share</span>
                    <i class="fas fa-share"></i>
                </BaseButton>
            </div>
        </div>

        <div class="body">
            <BaseLoader v-if="fetchingData" />
            <div v-else class="flex-list lg">
                <div class="product-column">
                    <h3>Top 10 Most IN</h3>
                    <div class="product-list">
                        <ProductListItem
                            v-for="(product, index) in topProductsByAction.ins"
                            :key="product.id"
                            :product="product"
                            :index="index"
                            :actions="['Focus', 'In']"
                        />
                    </div>
                </div>
                <div class="product-column">
                    <h3>Top 10 Most OUT</h3>
                    <div class="product-list">
                        <ProductListItem
                            v-for="(product, index) in topProductsByAction.outs"
                            :key="product.id"
                            :product="product"
                            :index="index"
                            :actions="['Out']"
                        />
                    </div>
                </div>
                <div class="product-column">
                    <h3>Top 10 Most FOCUS</h3>
                    <div class="product-list">
                        <ProductListItem
                            v-for="(product, index) in topProductsByAction.focus"
                            :key="product.id"
                            :product="product"
                            :index="index"
                            :actions="['Focus']"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SelectionIcon from '../../components/common/SelectionIcon.vue'
import ProductListItem from './ProductListItem'
export default {
    name: 'liveResults',
    components: {
        SelectionIcon,
        ProductListItem,
    },
    data: function() {
        return {
            currentSelectionId: null,
            fetchingData: false,
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
            allProducts: ['getProducts'],
        }),
        topProductsByAction() {
            const getFeedbackCount = function(product, actions) {
                const selectionInput = product.getActiveSelectionInput
                if (!selectionInput) return 0
                // console.log(
                //     'get feedback count',
                //     actions,
                //     selectionInput.feedbacks.filter(feedback => actions.includes(feedback.action))
                // )
                const count = selectionInput.feedbacks.filter(feedback => actions.includes(feedback.action)).length
                product[`acount_${actions[0]}`] = count
                return count
            }

            const topIn = [...this.allProducts].sort((a, b) => {
                // console.log('get top in', getFeedbackCount(a, ['Focus', 'In']), getFeedbackCount(b, ['Focus', 'In']))
                return getFeedbackCount(a, ['In', 'Focus']) > getFeedbackCount(b, ['In', 'Focus']) ? -1 : 1
            })
            const topOut = [...this.allProducts].sort((a, b) => {
                return getFeedbackCount(a, ['Out']) > getFeedbackCount(b, ['Out']) ? -1 : 1
            })
            const topFocus = [...this.allProducts].sort((a, b) => {
                return getFeedbackCount(a, ['Focus']) > getFeedbackCount(b, ['Focus']) ? -1 : 1
            })

            const limit = 10
            return {
                ins: topIn.slice(0, limit),
                outs: topOut.slice(0, limit),
                focus: topFocus.slice(0, limit),
            }
        },
    },
    methods: {
        ...mapActions('products', ['fetchSelectionProducts']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        async onNewSelectionId(selectionId) {
            this.fetchingData = true
            this.currentSelectionId = selectionId
            const selection = this.availableSelections.find(x => x.id == selectionId)
            this.SET_CURRENT_SELECTIONS([selection])
            if (!this.allProducts[0].selectionInputList.find(x => x.selection_id == selectionId)) {
                await this.fetchSelectionProducts(selection)
            }
            this.fetchingData = false
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.live-results-page {
    padding: 20px;
    padding-right: 40px;
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
            flex: 3;
        }
        .right {
            justify-content: flex-end;
        }
        button {
            &:not(.is-current) {
                opacity: 0.5;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
    .product-column {
        flex: 1;
        h3 {
            margin-left: 20px;
        }
    }
}
</style>
