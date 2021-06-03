<template>
    <div class="product-search-panel">
        <div class="search-field">
            <BaseSearchFieldV2
                :searchKey="['datasource_id', 'title', 'eans']"
                placeholderText="Search for Style or Look"
                :arraysToSearch="{ items, looks }"
                v-model="filteredBySearch"
                :hotkeyEnabled="true"
            />
        </div>
        <div class="filters flex-list justify">
            <BaseSegmentedControl
                :options="[
                    { label: 'All', value: 'All', count: filteredBySearch.items.length },
                    { label: 'Looks', value: 'Looks', count: filteredBySearch.looks.length },
                ]"
                v-model="currentTab"
                theme="light"
                activeClass="white"
            />
        </div>
        <RecycleScroller
            v-if="currentTab != 'Looks'"
            class="result-list item-list"
            :items="filteredBySearch.items"
            :item-size="118"
            key-field="id"
            v-slot="{ item }"
        >
            <SearchListItem :product="item" @create-look="onStartNewLook" />
        </RecycleScroller>
        <RecycleScroller
            v-else
            class="result-list look-list"
            :items="filteredBySearch.looks"
            :item-size="118"
            key-field="id"
            v-slot="{ item }"
        >
            <SearchListItem :product="item" @create-look="onStartNewLook" />
        </RecycleScroller>
        <EditLookPopover v-if="currentLook" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SearchListItem from './SearchListItem'
import EditLookPopover from './EditLookPopover'

export default {
    name: 'ProductSearchPanel',
    components: { SearchListItem, EditLookPopover },
    data: function() {
        return {
            currentTab: 'All',
            filteredBySearch: { items: [], looks: [] },
        }
    },
    computed: {
        ...mapGetters('products', {
            items: 'getProducts',
        }),
        ...mapGetters('productGroups', {
            currentLook: 'getCurrentProductGroup',
            looks: 'getProductGroups',
        }),
    },
    methods: {
        ...mapActions('productGroups', ['instantiateBaseProductGroup', 'addVariantMap']),
        ...mapMutations('productGroups', ['SET_CURRENT_GROUP']),
        async onStartNewLook(variant) {
            const newLook = await this.instantiateBaseProductGroup()
            newLook.name = `Look: ${variant.product.name}`
            this.addVariantMap({
                productGroup: newLook,
                variant,
            })

            this.SET_CURRENT_GROUP(newLook)
        },
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
    .filters {
        margin: 12px 0;
    }
    .result-list {
        overflow-y: scroll;
        padding-right: 14px;
        margin-right: -14px;
        padding-bottom: 40px;
    }
}
</style>
