<template>
    <th class="table-header" :class="sortKey">
        <template v-if="sortKey">
            <button class="icon-right small invisible light-hover sort" :class="{active: active}" @click="sort">
                <slot></slot>
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
            this.$emit('sort', this.sortKey, sortAsc)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    th {
        font-size: 12px;
        color: $dark15;
        .sort {
            &.active {
                background: $light1;
                i {
                    color: $primary;
                }
            }
            &:hover {
                color: $dark05;
            }
        }
    }

</style>