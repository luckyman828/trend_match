<template>
    <v-popover trigger="manual" :open="show" :autoHide="false" class="product-sort">
        <slot :activate="toggleShow" :sortItem="availableSortItems.find(sortItem => sortItem.key == currentSortKey)" />
        <BaseContextMenu slot="popover" :inline="true" v-click-outside="onHide">
            <SortListItem
                v-for="(sortItem, index) in availableSortItems"
                :key="index"
                :icon="sortItem.icon"
                :sortKey="sortItem.key"
                :label="sortItem.label"
                :sortAsc="sortItem.sortAsc"
                :currentSortKey="currentSortKey"
                detaultKey="sequence"
                :defaultAsc="true"
                @sort="onSort"
            />
        </BaseContextMenu>
    </v-popover>
</template>

<script>
import { mapGetters } from 'vuex'
import SortListItem from './SortListItem'

export default {
    name: 'productSort',
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
        disabledSortKeys() {
            const keys = []
            if (!this.labelsEnabled) keys.push('labels')
            return keys
        },
        labelsEnabled() {
            return this.availableProductLabels.length > 0
        },
        availableSortItems() {
            let labels = [
                {
                    key: 'sequence',
                    sortAsc: true,
                    label: 'Order',
                    icon: 'far fa-sort-numeric-up',
                },
                {
                    key: 'datasource_id',
                    sortAsc: true,
                    label: 'ID',
                    icon: 'far fa-sort-numeric-up',
                },
                {
                    key: 'name',
                    sortAsc: true,
                    label: 'Name',
                    icon: 'far fa-sort-alpha-up',
                },
                {
                    key: 'labels',
                    sortAsc: false,
                    label: 'Labels',
                    icon: 'far fa-tag',
                },
                {
                    key: 'quantity',
                    sortAsc: false,
                    label: 'Quantity',
                    icon: 'far fa-box',
                },
                {
                    key: 'category',
                    sortAsc: true,
                    label: 'Category',
                    icon: 'far fa-tshirt',
                },
                {
                    key: 'wholesale_price',
                    sortAsc: true,
                    label: 'WHS',
                    icon: 'far fa-dollar-sign',
                },
                {
                    key: 'recommended_retail_price',
                    sortAsc: true,
                    label: 'RRP',
                    icon: 'far fa-dollar-sign',
                },
                {
                    key: 'mark_up',
                    sortAsc: true,
                    label: 'Mark up',
                    icon: 'far fa-dollar-sign',
                },
            ]
            return labels.filter(label => !this.disabledSortKeys.includes(label.key))
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

<style scoped lang="scss"></style>
