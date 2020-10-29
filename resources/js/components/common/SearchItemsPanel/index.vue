<template>
    <div class="search-items-panel">
        <template v-if="items">
            <div class="header">
                <div class="search-field">
                    <BaseSearchField
                        ref="searchField"
                        :searchKey="searchKey"
                        :placeholderText="searchPlaceholder ? searchPlaceholder : 'Search..'"
                        :inputClasses="''"
                        :arrayToSearch="items"
                        v-model="itemsFilteredBySearch"
                    />
                </div>
            </div>
            <div class="body">
                <div class="header">
                    <strong>Results {{ itemsFilteredBySearch.length }}</strong>
                </div>

                <RecycleScroller
                    class="result-list"
                    :items="itemsFilteredBySearch"
                    :item-size="itemSize ? itemSize : 100"
                    key-field="id"
                    v-slot="{ item }"
                >
                    <slot :item="item" />
                </RecycleScroller>
            </div>
        </template>
        <BaseLoader v-else />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'searchItemsPanel',
    props: ['items', 'itemSize', 'searchPlaceholder', 'searchKey'],
    data: function() {
        return {
            itemsFilteredBySearch: [],
        }
    },
    methods: {
        hotkeyHandler(e) {
            const key = e.code
            if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT') return

            // Focus search
            if (key == 'KeyS') {
                e.preventDefault()
                this.$refs.searchField.setFocus()
            }
        },
    },
    created() {
        document.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.removeEventListener('keydown', this.hotkeyHandler)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.search-items-panel {
    width: 300px;
    background: white;
    border-right: $borderModule;
    box-shadow: $shadowModule;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
        padding: 8px 12px;
    }
    .search-field input {
        height: 40px;
    }
    .search-field {
        width: 100%;
    }
    .body {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .header {
            background: $bg;
            height: 40px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
        }
        .result-list {
            overflow-y: auto;
            flex: 1;
            padding: 16px 16px 48px;
        }
        .footer {
            padding: 16px 32px 32px;
        }
    }
}
</style>
