<template>
    <div class="search-products-panel">
        <div class="header">
            <div class="search-field">
                <BaseSearchField
                    ref="searchField"
                    :searchKey="['datasource_id', 'title']"
                    placeholderText="Search Product name, ID"
                    :inputClasses="''"
                    :arrayToSearch="products"
                    v-model="productsFilteredBySearch"
                />
            </div>
        </div>
        <div class="body">
            <div class="header">
                <strong>Results {{ productsFilteredBySearch.length }}</strong>
            </div>

            <RecycleScroller
                class="result-list"
                :items="productsFilteredBySearch"
                :item-size="144"
                key-field="id"
                v-slot="{ item }"
            >
                <ProductSearchListItem class="product-result" :product="item" />
            </RecycleScroller>

            <!-- <div class="footer">
                <button class="primary full-width md" @click="show = false">
                    <span>Done</span>
                </button>
            </div> -->
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductSearchListItem from './ProductSearchListItem'

export default {
    name: 'searchProductsPanel',
    components: {
        ProductSearchListItem,
    },
    data: function() {
        return {
            productsFilteredBySearch: [],
        }
    },
    computed: {
        ...mapGetters('products', {
            products: 'getProducts',
        }),
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.search-products-panel {
    width: 300px;
    background: white;
    // position: absolute;
    // left: 0;
    // top: 0;

    grid-area: sidebar;
    border-right: $borderModule;
    box-shadow: $shadowModule;
    height: calc(100vh - #{$navbarHeight});
    display: flex;
    flex-direction: column;
    .header {
        padding: 8px 12px;
    }
    .search-field input {
        height: 40px;
    }
    .search-field {
        width: 100%;
    }
    .body {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .header {
            background: $bg;
            height: 40px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
        }
        .result-list {
            overflow-y: auto;
            flex: 1;
            padding: 16px 16px 48px;
        }
        .footer {
            padding: 16px 32px 32px;
        }
    }
}
</style>
