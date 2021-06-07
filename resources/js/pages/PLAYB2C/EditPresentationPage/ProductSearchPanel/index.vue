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
            :key="currentTab"
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
            :key="currentTab"
            class="result-list look-list"
            :items="filteredBySearch.looks"
            :item-size="118"
            key-field="id"
            v-slot="{ item }"
        >
            <SearchListLook
                :look="item"
                :ref="`look-${item.id}`"
                @edit-look="onEditLook"
                v-show-contextmenu="{
                    trigger: 'contextmenu',
                    ref: 'moreContext',
                    item: item,
                }"
                :contextMenuVisible="contextLook && contextLook.id == item.id"
            />
        </RecycleScroller>
        <EditLookPopover v-if="currentLook" />

        <BaseContextMenu ref="moreContext" class="more-context" @show="contextLook = $event" @hide="contextLook = null">
            <template v-if="contextLook">
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-times" hotkey="keyC"> <u>C</u>ancel </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-pen" hotkey="KeyR" @click="onEditName(contextLook)">
                        <u>R</u>ename
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-trash" hotkey="KeyD" @click="onDeleteLook(contextLook)">
                        <u>D</u>elete look
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseDialog ref="confirmDeleteDialog" type="confirm" confirmColor="red" confirmText="Yes, delete it">
            <div class="icon-graphic">
                <i class="lg primary far fa-layer-group"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>A video timing is linked to this look</h3>
            <p>Deleting this look, will cause any linked video timings to also be deleted</p>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SearchListItem from './SearchListItem'
import SearchListLook from './SearchListLook'
import EditLookPopover from './EditLookPopover'

export default {
    name: 'ProductSearchPanel',
    components: { SearchListItem, SearchListLook, EditLookPopover },
    data: function() {
        return {
            currentTab: 'All',
            filteredBySearch: { items: [], looks: [] },
            contextLook: null,
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
        ...mapGetters('playPresentation', {
            presentation: 'getPresentation',
            timings: 'getTimings',
        }),
    },
    methods: {
        ...mapActions('productGroups', ['instantiateBaseProductGroup', 'addVariantMap', 'deleteProductGroup']),
        ...mapActions('playPresentation', ['removeTimings']),
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
        onEditLook(look) {
            this.SET_CURRENT_GROUP(look)
        },
        onEditName(look) {
            this.$refs[`look-${look.id}`].editName = true
        },
        async onDeleteLook(look) {
            const linkedTimings = this.timings.filter(timing => timing.product_group_id == look.id)
            if (linkedTimings.length <= 0 || (await this.$refs.confirmDeleteDialog.confirm())) {
                this.removeTimings(linkedTimings)
                this.deleteProductGroup({ fileId: this.presentation.id, productGroup: look })
            }
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
