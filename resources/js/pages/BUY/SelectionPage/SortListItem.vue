<template>
    <div class="item-group">
        <BaseContextMenuItem class="sort-list-item" :iconClass="icon" :class="{ active: isActive }" @click="onSort">
            <div class="flex-list justify full-width">
                <span>{{ label }}</span>
                <i class="far sort-icon md" :class="sortAsc ? `fa-sort-amount-down-alt` : `fa-sort-amount-down`"></i>
            </div>
        </BaseContextMenuItem>
    </div>
</template>

<script>
export default {
    name: 'sortListItem',
    props: ['sortKey', 'label', 'icon', 'currentSortKey'],
    data() {
        return {
            sortAsc: false,
            defaultAsc: false,
        }
    },
    computed: {
        isActive() {
            return this.currentSortKey == this.sortKey
        },
    },
    methods: {
        onSort() {
            const sortAsc = this.isActive ? !this.sortAsc : this.defaultAsc
            this.sortAsc = sortAsc
            this.$emit('sort', this.sortKey, sortAsc)
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.sort-list-item {
    .full-width {
        width: 100%;
    }
    .sort-icon {
        display: none;
    }
    &.active,
    &:hover {
        .sort-icon {
            display: block;
        }
    }
    &.active {
        font-weight: 700;
        .sort-icon {
            color: $primary;
        }
        ::v-deep {
            .icon-wrapper {
                i {
                    color: $primary;
                }
            }
        }
    }
}
</style>
