<template>
    <div class="edit-file-component">
      <EditFileHeader :file="collection"/>
        <div class="filters">
            <div class="left">
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
                    <template v-slot:header>
                        <span>Filter by category</span>
                    </template>
                    <template v-slot:body>
                        <BaseCheckboxButtons :options="dynamicCategories" ref="filterSelect" v-model="selectedCategories" @change="$refs.filterSelect.submit()"/>
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
                    <template v-slot:header>
                        <span>Filter by delivery date</span>
                    </template>
                    <template v-slot:body>
                        <BaseCheckboxButtons :options="dynamicDeliveryDates" :optionNameKey="'name'" :optionValueKey="'value'" ref="filterDelivery" v-model="selectedDeliveryDates" @change="$refs.filterDelivery.submit()"/>
                    </template>
                </BaseDropdown>

                <span v-if="selectedCategories.length > 0 || selectedDeliveryDates.length > 0" class="clear button invisible primary" @click="$refs.filterSelect.clear(); selectedCategories=[]; $refs.filterDelivery.clear(); selectedDeliveryDates=[]; unreadOnly = false">Clear filter</span>
            </div>

            <div class="right">

            </div>
        </div>
        <ProductsTable :products="productsFilteredv1" :totalProductCount="productsRaw.length" :selectedIds="selectedProductIDs" :sortBy="sortBy" :sortAsc="sortAsc" @onSortBy="onSortBy" @onSelect="setSelectedProduct"/>
        <!-- <products ref="productsComponent" :selectedIds="selectedProductIDs" :sortBy="sortBy" :sortAsc="sortAsc" @onSortBy="onSortBy" :teams="collection.teams" :totalProductCount="products.length" :selectedCount="selectedProducts.length" :collection="collection" :products="productsScopedFiltered" :loading="loadingProducts" :authUser="authUser" @onSelect="setSelectedProduct"/> -->
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import ProductsTable from './ProductsTable'
import EditFileHeader from './EditFileHeader'

export default{
    name: 'editFilePage',
    components: {
        EditFileHeader,
        ProductsTable,
    },
    data: function () { return {
        selectedProductIDs: [],
        sortBy: 'datasource_id',
        sortAsc: true,
        unsub: '',
    }},
    watch: {
        products: function(newValue, oldValue) {
            // CODE to make sure the products stay sorted in the same way
            // Save the old order of the products
            if (newValue.length == oldValue.length) {
                let index = 0
                oldValue.forEach(product => {
                    const newIndex = newValue.find(x => x.id == product.id)
                    if (newIndex) {
                        newIndex.sortIndex = index
                    }
                    product.sortIndex = index
                    index++
                })
                // Sort the products in the same was as they were before
                this.sortProducts('sortIndex')
            }
        },
    },
    computed: {
        ...mapState('entities/products', ['selectedCategories', 'selectedDeliveryDates']),
        ...mapGetters('entities/products', ['productsRaw', 'productsFilteredv1']),
        ...mapGetters('entities/collections', ['currentFile']),
        ...mapGetters('persist', ['currentWorkspaceId', 'userPermissionLevel', 'currentWorkspace', 'authUser']),
        selectedCategories: {
            get () {
                return this.$store.state.entities.products.selectedCategories
            },
            set (value) {
                this.updateSelectedCategories(value)
            }
        },
        selectedDeliveryDates: {
            get () {
                return this.$store.state.entities.products.selectedDeliveryDates
            },
            set (value) {
                this.updateSelectedDeliveryDates(value)
            }
        },
        products() {
            return this.productsFilteredv1
        },
        collection() {
            return this.currentFile
        },
        sortMethod () {
            let key = this.sortBy
            let sortMethod
            if (!this.loadingProducts) {
                if (key == 'action') {
                    sortMethod = 'action'
                }
                else if (key == 'focus') {
                    sortMethod = 'focus'
                }
                else if (key == 'ins') {
                    sortMethod = 'ins'
                }
                else {
                    if ( typeof this.products[0][key] == 'object' ) {
                        sortMethod = 'object'
                    }
                    else {
                        sortMethod = 'key'
                    }
                }
            }
            return sortMethod
        },
        selectedProducts() {
            const products = this.products
            const selectedProducts = []
            this.selectedProductIDs.forEach(index => {
                selectedProducts.push(products[index].id)
            })
            return selectedProducts
        },
        dynamicCategories() {
            const products = this.products
            let uniqueCategories = []
            products.forEach(product => {
                const found = (uniqueCategories.includes(product.category))
                if (!found)
                    uniqueCategories.push(product.category)
            })
            return uniqueCategories
        },
        dynamicDeliveryDates() {
            const products = this.products
            let uniqueDeliveryDates = []
            products.forEach(product => {
                const found = (uniqueDeliveryDates.find(x => x.value == product.delivery_date))
                if (!found)
                    uniqueDeliveryDates.push({
                        name: new Date(product.delivery_date).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'}), 
                        value: product.delivery_date
                        })
            })
            return uniqueDeliveryDates
        },
    },
    methods: {
        ...mapMutations('entities/products', ['updateSelectedCategories', 'updateSelectedDeliveryDates']),

        setSelectedProduct(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selectedProductIDs
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        clearSelectedProducts() {
            this.selectedProductIDs = []
            this.$refs.productsComponent.resetSelected()
        },
        onSortBy(key, method) {
            if (this.sortBy !== key) {
                this.sortAsc = method
                this.sortBy = key
            } else {
                this.sortAsc = !this.sortAsc
            }
            this.sortProducts()
        },
        sortProducts(keyOverwrite) {
            console.log('sorting products')

            const products = this.products
            // let key = this.sortBy
            let key = (keyOverwrite) ? keyOverwrite : this.sortBy
            let sortAsc = (keyOverwrite) ? true : this.sortAsc
            const sortMethod = (keyOverwrite) ? 'custom' : this.sortMethod
            let dataSorted = []

            if (products.length > 0) {

                // Always sort the products by datasource_id first before sorting with the chosen method, to make sure the products are always sorted in the same manner
                products.sort((a, b) => {
                    if ( a.datasource_id == b.datasource_id ) {
                        return 0
                    } else if (sortAsc) {
                        return (a.datasource_id > b.datasource_id) ? 1 : -1
                    }
                    else return (a.datasource_id < b.datasource_id) ? 1 : -1
                })

                dataSorted = products.sort((a, b) => {

                  if ( sortMethod == 'object' ) {

                      // Sort by key length (arrays)
                      if ( a[key].length == b[key].length ) {
                          return 0
                      } else if (sortAsc) {
                          return (a[key].length > b[key].length) ? 1 : -1
                      }
                      else return (a[key].length < b[key].length) ? 1 : -1

                  }

                  // If the keys aren't objects, finalActions or strings - sort by the key
                  else {

                      if ( a[key] == b[key] ) {
                          return 0
                      } else if (sortAsc) {
                          return (a[key] > b[key]) ? 1 : -1
                      }
                      else return (a[key] < b[key]) ? 1 : -1
                  }
                })
            }
            return dataSorted
        },
    },
    created() {
        // Initially sort the products
        this.sortProducts()
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .filters {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        > * {
            display: flex;
            &.left > * {
                margin-right: 16px;
            }
            &.right > * {
                margin-left: 16px;
            }
        }
    }
    .item-filter-button {
        min-width: 120px;
        background: $light2;
    }
    .button.clear {
        margin-left: -16px;
    }
    .checkbutton.checkbox {
        color: $dark;
        border: solid 1px;
        border-color: $light2;
        font-weight: 700;
        .checkmark {
            margin-left: 12px;
            margin-right: -4px;
        }
    }
    .quick-actions {
        border-bottom: solid 2px $light2;
        padding-bottom: 16px;
        margin-bottom: 16px;
        p {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
        }
        .button {
            &:not(:last-child) {
                margin-right: 12px;
            }
        }
    }
</style>
