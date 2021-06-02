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
            itemsFilteredBySearch: [],
        }
    },
    computed: {
        ...mapGetters('products', {
            items: 'getProducts',
        }),
        ...mapGetters('productGroups', {
            currentLook: 'getCurrentProductGroup',
        }),
    },
    methods: {
        ...mapActions('productGroups', ['instantiateBaseProductGroup', 'addVariantMap']),
        ...mapMutations('productGroups', ['SET_CURRENT_GROUP']),
        async onStartNewLook(variant) {
            const newLook = await this.instantiateBaseProductGroup()
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
