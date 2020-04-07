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

                <!-- Selection Selector -->
                <div class="selection-selector" v-if="currentSelectionMode == 'Alignment'">
                    <v-popover trigger="click">
                        <button class="white">
                            <!-- <i class="fas primary" :class="currentSelections.length > 1 ? 'fa-users-class' : 'fa-user'"></i> -->
                            <i class="fas primary fa-users-class"></i>
                            <span>{{currentSelections[0].name}} {{`${currentSelections.length > 1 ? '+ ' + Math.abs(currentSelections.length - 1) : ''}`}}</span>
                            <i class="fas fa-caret-down"></i>
                        </button>
                        <template slot="popover">
                            <BaseSelectButton v-for="theSelection in availableSelections" :key="theSelection.id"
                            :modelValue="theSelection" v-model="selectedSelections">
                                <i v-if="!theSelection.is_visible" class="far fa-eye-slash" style="margin-right: 4px;"
                                v-tooltip="'Selection is <strong>Hidden</strong>. You can still make new input, even though the selection is hidden'"></i>
                                <i v-if="!theSelection.is_open" class="far fa-lock" style="margin-right: 4px;"
                                v-tooltip="'Selection is <strong>Locked</strong>. You can view input from a locked selection, but not make any new'"></i>
                                {{theSelection.name}}
                            </BaseSelectButton>
                            <div class="item-group actions">
                                <button class="primary" v-close-popover @click="onSetCurrentSelections"><span>Apply</span></button>
                                <button class="invisible ghost-hover" v-close-popover><span>Cancel</span></button>
                            </div>
                        </template>
                    </v-popover>
                    
                    <!-- <button class="white">
                        <i class="far fa-user"></i>
                    </button> -->
                </div>
                <!-- Selection Selector Ends -->

            </template>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField :arrayToSearch="products" :searchKey="['datasource_id','title','category']"
                        v-model="productsFilteredBySearch"/>

                        <v-popover trigger="click">
                            <button class="ghost">
                                <span>Category </span>
                                <i class="far fa-chevron-down"></i>
                                <span v-if="selectedCategories.length > 0" class="circle primary xs">
                                    <span>{{selectedCategories.length}}</span>
                                </span>
                            </button>
                            <template slot="popover">
                                <BaseSelectButtons style="width: 200px; padding-top: 8px;" submitOnChange="true" 
                                :options="availableCategories" v-model="selectedCategories"/>
                            </template>
                        </v-popover>

                        <v-popover trigger="click">
                            <button class="ghost">
                                <span>Delivery</span>
                                <i class="far fa-chevron-down"></i>
                                <span v-if="selectedDeliveryDates.length > 0" class="circle primary xs">
                                    <span>{{selectedDeliveryDates.length}}</span>
                                </span>
                            </button>
                            <template slot="popover">
                                <BaseSelectButtons submitOnChange="true" 
                                :options="availableDeliveryDates" v-model="selectedDeliveryDates"/>
                            </template>
                        </v-popover>

                        <v-popover trigger="click">
                            <button class="ghost">
                                <span>Buyer group </span>
                                <i class="far fa-chevron-down"></i>
                                <span v-if="selectedBuyerGroups.length > 0" class="circle primary xs">
                                    <span>{{selectedBuyerGroups.length}}</span>
                                </span>
                            </button>
                            <template slot="popover">
                                <BaseSelectButtons submitOnChange="true" 
                                :options="availableBuyerGroups" v-model="selectedBuyerGroups"/>
                            </template>
                        </v-popover>

                        <!-- Temp. disabled until the functionality gets hooked up -->
                        <!-- <BaseCheckboxInputField class="small" v-model="unreadOnly">
                            <span>Unread only</span>
                        </BaseCheckboxInputField> -->

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
                <BaseTableHeader :sortKey="['allFocus', 'allIns']" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">In</BaseTableHeader>
                <BaseTableHeader :sortKey="'allOuts'" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">Out</BaseTableHeader>
                <BaseTableHeader :sortKey="'allNds'" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">ND</BaseTableHeader>
                <BaseTableHeader :sortKey="['requests', 'comments']" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">Requests</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>

                <RecycleScroller
                    class="products-scroller"
                    :items="productsFilteredBySearch"
                    :item-size="currentSelections.length > 1 ? 186 : 78"
                    page-mode
                    key-field="id"
                    v-slot="{ item, index }"
                >
                    <ProductsTableRow class="product-row flex-table-row"
                    :selection="selection" :currentAction="currentAction"
                    :product="item" :index="index" v-model="selectedProducts" :selectedProducts="selectedProducts"
                    @onViewSingle="onViewSingle" @updateAction="(product, action, selection) => $emit('updateAction', product, action, selection)"/>
                    
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
        selectedSelections: [],
    }},
    computed: {
        ...mapGetters('products', ['productTotals', 'availableCategories', 'availableDeliveryDates', 'availableBuyerGroups']),
        ...mapGetters('selections', ['getCurrentSelections', 'getSelectionsAvailableForAlignment', 'currentSelectionMode']),
        ...mapState('products', {stateProducts: 'products'}),
        currentSelections() {
            return this.getCurrentSelections
        },
        availableSelections() {
            return this.getSelectionsAvailableForAlignment
        },
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
        ...mapActions('products', ['fetchProductsForMultipleSelections']),
        ...mapActions('comments', ['setComment', 'destroyComment']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        onViewSingle(product) {
            this.setCurrentProduct(product)
            this.setAvailableProducts(this.products) // Save array of available products
            this.setSingleVisisble(true)
        },
        async onSetCurrentSelections() {
            const selections = this.selectedSelections
            // Fetch data for all the selections
            // Process all their data
            await this.fetchProductsForMultipleSelections(selections)
            // Set them as current
            this.SET_CURRENT_SELECTIONS(selections)
        },
        onSort(sortAsc, sortKey) {
            this.sortKey = sortKey
            // Sort the products in our state to make sure the sort happens everywhere in the dashboard
            this.sortArray(this.stateProducts, sortAsc, sortKey)
        },
    },
    created () {

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
                th, td {
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
                    &.focus, &.ins {
                        min-width: 52px;
                        max-width: 52px;
                    }
                    &.outs {
                        min-width: 56px;
                        max-width: 56px;
                    }
                    &.nds {
                        min-width: 48px;
                        max-width: 48px;
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

    .selection-selector {
        display: flex;
        margin-left: auto;
        > *:not(:first-child) {
            margin-left: 8px;
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
