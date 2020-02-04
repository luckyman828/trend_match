<template>
    <th class="table-header" :class="sortKey">
        <template v-if="sortKey">
            <button class="invisible sm sort" :class="{active: active}" @click="sort">
                <span><slot></slot></span>
                <i class="fas fa-sort" v-if="!active"></i>
                <i class="fas fa-sort-down" v-else-if="active && sortAsc"></i>
                <i class="fas fa-sort-up" v-else-if="active && !sortAsc"></i>
            </button>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </th>
</template>

<script>
export default {
    name: 'tableHeader',
    props: [
        'sortKey',
        'currentSortKey',
        'sortAsc',
        'descDefault'
    ],
    computed: {
        active () {
            return this.sortKey == this.currentSortKey
        }
    },
    methods: {
        sort() {
            const sortAsc = this.descDefault ? false : true
            this.$emit('sort', sortAsc, this.sortKey)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    th {
        font-size: 12px;
        color: $tableHeader;
        .sort {
            &.active {
                background: $light1;
                color: $font;
                i {
                    color: $primary;
                }
            }
            &:hover {
                color: $dark05;
            }
        }
        button {
            margin-left: -8px;
        }
    }

</style>