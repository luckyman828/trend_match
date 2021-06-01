<template>
    <div class="product-search-panel">
        <div class="search-field">
            <BaseSearchFieldV2
                :searchKey="['datasource_id', 'title', 'eans']"
                placeholderText="Search for Style or Look"
                :arrayToSearch="items"
                v-model="itemsFilteredBySearch"
                :hotkeyEnabled="true"
            />
        </div>
        <RecycleScroller
            class="result-list"
            :items="itemsFilteredBySearch"
            :item-size="118"
            key-field="id"
            v-slot="{ item }"
        >
            <SearchListItem :product="item" />
        </RecycleScroller>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchListItem from './SearchListItem'

export default {
    name: 'ProductSearchPanel',
    components: { SearchListItem },
    data: function() {
        return {
            itemsFilteredBySearch: [],
        }
    },
    computed: {
        ...mapGetters('products', {
            items: 'getProducts',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.product-search-panel {
    padding: 8px 16px 8px;
    background: white;
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .result-list {
        overflow-y: scroll;
        padding-right: 14px;
        margin-right: -14px;
        padding-bottom: 40px;
    }
    .search-field {
        margin-bottom: 12px;
    }
}
</style>
