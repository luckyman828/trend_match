<template>
    <th class="table-header" :class="sortKey">
        <template v-if="sortKey">
            <button class="no-bg sm sort" :class="{ active: active }" @click="sort">
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
    props: ['sortKey', 'currentSortKey', 'descDefault', 'defaultTo'],
    data: function() {
        return {
            sortAsc: this.descDefault ? false : true,
            sortKeyIndex: 0,
            consecutiveSortCount: 0,
        }
    },
    computed: {
        active() {
            if (Array.isArray(this.sortKey)) {
                return JSON.stringify(this.sortKey) == JSON.stringify(this.currentSortKey)
                // return this.sortKey.includes(this.currentSortKey)
            } else {
                return this.sortKey == this.currentSortKey
            }
        },
    },
    watch: {
        active: function(newVal, oldVal) {
            // on activate
            if (newVal) {
                this.sortAsc = this.descDefault ? false : true
            }
        },
    },
    methods: {
        sort() {
            let sortKeyToEmit = this.sortKey
            // If this header is already active, flip the sort order
            if (this.active) {
                this.sortAsc = !this.sortAsc
                this.consecutiveSortCount++
                if (this.defaultTo != null && this.consecutiveSortCount >= 2) {
                    sortKeyToEmit = this.defaultTo
                    this.sortAsc = true
                }
            } else {
                this.sortAsc = this.descDefault ? false : true
                this.consecutiveSortCount = 0
            }
            // if (Array.isArray(this.sortKey)) {
            //     this.$emit('sort', this.sortAsc, this.sortKey)
            // } else {
            this.$emit('sort', this.sortAsc, sortKeyToEmit)
            // }
        },
    },
    mounted() {
        if (this.active) {
            this.$emit('sort', this.sortAsc, this.sortKey)
        }
    },
}
</script>

<style lang="scss" scoped>
th {
    font-size: 12px;
    color: $fontTableHeader;
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
        // &:focus {
        //     box-shadow: none;
        // }
    }
    button.no-bg:not(.ghost-hover):hover {
        color: $primary;
    }
    button.no-bg:not(.ghost-hover):not(.active):hover {
        background: none;
    }
}
</style>
