<template>
    <v-popover trigger="manual" :open="show" :autoHide="false" class="product-sort">
        <button class="ghost trigger" @click="toggleShow">
            <i class="far fa-sort-amount-up"></i>
            <span>Sort</span>
        </button>
        <BaseContextMenu slot="popover" :inline="true" v-click-outside="onHide">
            <SortListItem
                icon="far fa-tag"
                :sortKey="'labels'"
                label="Labels"
                :currentSortKey="currentSortKey"
                @sort="onSort"
            />
        </BaseContextMenu>
    </v-popover>
</template>

<script>
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
