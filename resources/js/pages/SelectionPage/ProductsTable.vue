<template>
    <div class="products-table-wrapper">
        <BaseFlexTable class="products-table" stickyHeader="true">
            <template v-slot:tabs>
                <BaseTableTab :label="`Overview`" :count="productTotals.all" :modelValue="currentProductFilter"
                value="overview" @change="setCurrentProductFilter($event)"/>
                <BaseTableTab :label="`In`" :count="productTotals.ins + productTotals.focus" :modelValue="currentProductFilter"
                value="ins" @change="setCurrentProductFilter($event)"/>
                <BaseTableTab :label="`Out`" :count="productTotals.outs" :modelValue="currentProductFilter"
                value="outs" @change="setCurrentProductFilter($event)"/>
                <BaseTableTab :label="`Nds`" :count="productTotals.nds" :modelValue="currentProductFilter"
                value="nds" @change="setCurrentProductFilter($event)"/>
            </template>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField :arrayToSearch="products" :searchKey="['datasource_id','title','category']"
                        v-model="productsFilteredBySearch"/>

                        <BaseDropdown class="dropdown-parent left">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                                    <span>Category </span>
                                    <i class="far fa-chevron-down"></i>
                                    <span v-if="selectedCategories.length > 0" class="bubble">
                                        {{selectedCategories.length}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:body>
                                <BaseSelectButtons header="Filter by category" submitOnChange="true" 
                                :options="availableCategories" v-model="selectedCategories"/>
                            </template>
                        </BaseDropdown>

                        <BaseDropdown class="dropdown-parent left">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                                    <span>Delivery</span>
                                    <i class="far fa-chevron-down"></i>
                                    <span v-if="selectedDeliveryDates.length > 0" class="bubble">
                                        {{selectedDeliveryDates.length}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:body>
                                <BaseSelectButtons header="Filter by delivery date" submitOnChange="true" 
                                :options="availableDeliveryDates" :optionNameKey="'name'" 
                                :optionValueKey="'value'" v-model="selectedDeliveryDates"/>
                            </template>
                        </BaseDropdown>

                        <BaseDropdown class="dropdown-parent left">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                                    <span>Buyer group </span>
                                    <i class="far fa-chevron-down"></i>
                                    <span v-if="selectedBuyerGroups.length > 0" class="bubble">
                                        {{selectedBuyerGroups.length}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:header>
                                <span>Filter by buyer group</span>
                            </template>
                            <template v-slot:body>
                                <BaseSelectButtons header="Filter by buyer group" submitOnChange="true" 
                                :options="availableBuyerGroups" v-model="selectedBuyerGroups"/>
                            </template>
                        </BaseDropdown>

                        <BaseSelectButton type="checkbox" :value="unreadOnly" v-model="unreadOnly" label="Show UNREAD only"/>

                        <button class="invisible primary" v-if="selectedCategories.length > 0 || selectedDeliveryDates.length > 0 || selectedBuyerGroups.length > 0 || unreadOnly"
                        @click="selectedCategories=[]; selectedDeliveryDates=[]; selectedBuyerGroups=[]; unreadOnly = false"><span>Clear filter</span></button>

                    </template>
                    <template v-slot:right>
                        <span>{{selectedProducts.length}} selected</span>
                        <span v-if="productsFilteredBySearch.length != productTotals.all">{{productsFilteredBySearch.length}}/{{productTotals.all}} showing</span>
                        <span v-else>{{productTotals.all}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select"><BaseCheckbox :modelValue="true" :value="selectedProducts.length > 0"
                @change="(checked) => checked ? selectedProducts = products : selectedProducts = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="image"></BaseTableHeader>
                <BaseTableHeader class="id" :sortKey="'datasource_id'" :currentSortKey="sortKey"
                @sort="onSort">ID</BaseTableHeader>
                <BaseTableHeader :sortKey="'title'" :currentSortKey="sortKey"
                @sort="onSort">Product Name</BaseTableHeader>
                <BaseTableHeader class="focus"></BaseTableHeader>
                <BaseTableHeader :sortKey="'ins'" :currentSortKey="sortKey"
                @sort="onSort">In</BaseTableHeader>
                <BaseTableHeader :sortKey="'outs'" :currentSortKey="sortKey"
                @sort="onSort">Out</BaseTableHeader>
                <BaseTableHeader :sortKey="'nds'" :currentSortKey="sortKey"
                @sort="onSort">ND</BaseTableHeader>
                <BaseTableHeader :sortKey="'requests'" :currentSortKey="sortKey"
                @sort="onSort">Requests</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>

                <RecycleScroller
                    class="products-scroller"
                    :items="productsFilteredBySearch"
                    :item-size="78"
                    page-mode
                    key-field="id"
                    v-slot="{ item, index }"
                >
                    <ProductsTableRow class="product-row flex-table-row"
                    :selection="selection" :currentAction="currentAction"
                    :product="item" :index="index" v-model="selectedProducts" :selectedProducts="selectedProducts"
                    @onViewSingle="onViewSingle" @updateAction="(product, action) => $emit('updateAction', product, action)"/>
                </RecycleScroller>

                <tr v-if="productsFilteredBySearch.length <= 0">
                    <p style="padding: 60px 0 100px; text-align: center; width: 100%;">
                        No products to show. Try changing your filters.</p>
                </tr>
            </template>
        </BaseFlexTable>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ProductsTableRow from './ProductsTableRow'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'productsTable',
    props: [
        'products',
        'file',
        'selection',
        'currentAction',
    ],
    mixins: [
        sortArray
    ],
    components: {
        ProductsTableRow,
    },
    data: function() { return {
        sortKey: 'datasource_id',
        selectedProducts: [],
        productsFilteredBySearch: this.products,
    }},
    computed: {
        ...mapGetters('products', ['productTotals', 'availableCategories', 'availableDeliveryDates', 'availableBuyerGroups']),
        ...mapState('products', {stateProducts: 'products'}),
        currentProductFilter: {
            get () {
                return this.$store.getters['products/currentProductFilter']
            },
            set (value) {
                this.setCurrentProductFilter(value)
            }
        },
        selectedCategories: {
            get () {
                return this.$store.getters['products/selectedCategories']
            },
            set (value) {
                this.updateSelectedCategories(value)
            }
        },
        selectedDeliveryDates: {
            get () {
                return this.$store.getters['products/selectedDeliveryDates']
            },
            set (value) {
                this.updateSelectedDeliveryDates(value)
            }
        },
        selectedBuyerGroups: {
            get () {
                return this.$store.getters['products/selectedBuyerGroups']
            },
            set (value) {
                this.updateSelectedBuyerGroups(value)
            }
        },
        unreadOnly: {
            get () {
                return this.$store.getters['products/unreadOnly']
            },
            set (value) {
                this.setUnreadOnly(value)
            }
        },
    },
    methods: {
        ...mapMutations('products', ['setSingleVisisble','updateSelectedCategories',
        'updateSelectedDeliveryDates', 'setUnreadOnly', 'setCurrentProductFilter',
        'updateSelectedBuyerGroups','setCurrentProduct', 'setAvailableProducts']),
        ...mapActions('actions', ['setAction', 'destroyAction', 'setManyActions', 'setManyTaskActions']),
        ...mapActions('comments', ['setComment', 'destroyComment']),
        onViewSingle(product) {
            this.setCurrentProduct(product)
            this.setAvailableProducts(this.products) // Save array of available products
            this.setSingleVisisble(true)
        },
        onSort(sortAsc, sortKey) {
            this.sortKey = sortKey
            // Sort the products in our state to make sure the sort happens everywhere in the dashboard
            this.sortArray(this.stateProducts, sortKey, sortKey)
        },
    },
    created () {
        // Initially sort the products
        this.onSort(this.sortKey, true)

        // Setup event broadcast listening

        // Echo.private(`workspace.${this.currentWorkspaceId}`)
        // .listen('.action.updated', (e) => {
        //     const action = e.action
        //     // console.log('%cPusher: Action Set', 'font-weight: 900')
        //     this.setAction(action)
        // })
        // .listen('.action.deleted', (e) => {
        //     const action = e.action
        //     // console.log('%cPusher: Action Deleted', 'font-weight: 900')
        //     this.destroyAction(action)
        // })
        // .listen('.actions.many.updated', (e) => {
        //     const request = e.request
        //     // console.log('%cPusher: Action Many Updated', 'font-weight: 900')
        //     this.setManyActions({ 
        //         productIds: request.product_ids, 
        //         task_id: request.task_id,
        //         user_id: request.user_id,
        //         action_code: request.action_code,
        //         is_task_action: request.is_task_action,
        //     })
        // })
        // .listen('.actions.many.created', (e) => {
        //     const actions = e.actions
        //     // console.log('%cPusher: Action Many Created', 'font-weight: 900')
        //     this.setManyActions({
        //         productIds: actions.map(x => x.product_id),
        //         task_id: actions[0].task_id,
        //         user_id: actions[0].user_id,
        //         action_code: actions[0].action,
        //         is_task_action: actions[0].is_task_action, 
        //     })
        // })
        // .listen('.comment.updated', (e) => {
        //     const comment = e.comment
        //     // console.log('%cPusher: Comment Updated', 'font-weight: 900')
        //     this.setComment(comment)
        // })
        // .listen('.comment.deleted', (e) => {
        //     const comment = e.comment
        //     // console.log('%cPusher: Comment deleted', 'font-weight: 900')
        //     this.destroyComment(comment)
        // })
        // .listen('.task.completed', (e) => {
        //     const fileTask = e.fileTask
        //     // console.log('%cPusher: Task completed', 'font-weight: 900')
        //     this.setTaskComplete({file_id: fileTask.file_id, task_id: fileTask.task_id})
        // })
        // .listen('.task.uncompleted', (e) => {
        //     const fileTask = e.fileTask
        //     // console.log('%cPusher: Task uncompleted', 'font-weight: 900')
        //     this.setTaskIncomplete({file_id: fileTask.file_id, task_id: fileTask.task_id})
        // })
    },
    destroyed () {
        // Unsub from pusher broadcasting
        // Echo.leaveChannel(`workspace.${this.currentWorkspaceId}`);
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .products-table-wrapper {
        ::v-deep {
            tr:not(.table-top-bar) > * {
                flex: 0 1 auto;
            }
            tr {
                > * {
                    &.title {
                        min-width: 220px;
                        max-width: 220px;
                        display: flex;
                        align-items: center;
                        margin-right: 32px;
                        flex: 1;
                    }
                    &.id {
                        min-width: 80px;
                        max-width: 80px;
                        margin-left: 16px
                    }
                    &.image {
                        min-width: 48px;
                        max-width: 48px;
                    }
                    &.focus, &.ins, &.nds {
                        min-width: 48px;
                        max-width: 48px;
                    }
                    &.outs{
                        min-width: 56px;
                        max-width: 56px;
                    }
                    &.requests {
                        margin-left: 32px;
                        .button {
                            padding: 0 4px;
                        }
                    }
                    &.image {
                        min-width: 48px;
                        max-width: 48px;
                    }
                    &.action {
                        flex: 1;
                        min-width: 232px;
                        margin-left: 32px;
                    }
                }
            }
        }
    }
    .product-row {
        &.action-2 {
            box-shadow: 4px 0 $primary inset
        }
        &.action-1 {
            box-shadow: 4px 0 $green inset
        }
        &.action-0 {
            box-shadow: 4px 0 $red inset
        }
    }

    // SMALL SCREENS AND HIGH DPI
    @media screen and (max-width: $screenSmall) {

        @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
        only screen and (-o-min-device-pixel-ratio: 13/10),
        only screen and (min-resolution: 120dpi)
        {
            
        }
    }
</style>
