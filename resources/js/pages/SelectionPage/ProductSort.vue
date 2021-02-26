<template>
    <v-popover trigger="manual" :open="show" :autoHide="false" class="product-sort">
        <button class="ghost trigger" @click="toggleShow">
            <i class="far fa-sort-amount-up"></i>
            <span>Sort</span>
        </button>
        <BaseContextMenu slot="popover" :inline="true" v-click-outside="onHide">
            <SortListItem
                v-if="enabledSortKeys.includes('labels')"
                icon="far fa-tag"
                :sortKey="'labels'"
                label="Labels"
                :currentSortKey="currentSortKey"
                @sort="onSort"
            />
            <div class="item-wrapper" v-if="enabledSortKeys.length <= 0">
                <div class="icon-wrapper">
                    <i class="far fa-info-circle"></i>
                </div>
                <p>Your workspace doesn't have any keys enabled to sort by.</p>
            </div>
        </BaseContextMenu>
    </v-popover>
</template>

<script>
import { mapGetters } from 'vuex'
import SortListItem from './SortListItem'

export default {
    name: 'productFilters',
    components: { SortListItem },
    props: ['currentSortKey'],
    data: function() {
        return {
            show: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            availableProductLabels: 'getAvailableProductLabels',
        }),
        enabledSortKeys() {
            const keys = []
            if (this.labelsEnabled) keys.push('labels')
            return keys
        },
        labelsEnabled() {
            return this.availableProductLabels.length > 0
        },
    },
    methods: {
        onSort(sortKey, sortAsc) {
            this.$emit('sort', sortAsc, sortKey)
        },
        toggleShow() {
            this.show = !this.show
        },
        onHide() {
            this.show = false
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
</style>
