<template>
    <BaseFlyin class="presenter-queue-search-flyin" :show="show" @close="show = false" placement="left">
        <template v-slot:header v-if="show">
            <BaseFlyinHeader v-if="show" :disableNavigation="true"
            @close="show = false" placement="left">
                <template v-slot:left>

                    <div class="search-field">
                        <BaseSearchField ref="searchField" :searchKey="['id', 'title']"
                        placeholderText="Search Product name, ID" :inputClasses="''"
                        :arrayToSearch="products" v-model="productsFilteredBySearch"/>
                    </div>

                </template>
            </BaseFlyinHeader>
        </template>

        <template v-slot:default>
            <div class="inner">
                <div class="header">
                    <strong>Results</strong>
                </div>

                <RecycleScroller
                class="result-list"
                    :items="productsFilteredBySearch"
                    :item-size="176"
                    key-field="id"
                    v-slot="{ item }"
                >
                    <SearchResult class="product-result" :product="item"/>
                    
                </RecycleScroller>

                <div class="footer">
                    <button class="primary full-width md"
                    @click="show = false">
                        <span>Done</span>
                    </button>
                </div>
            </div>


            <!-- Will always be visible to the right of the flyin -->
            <PresenterQueue @showSearchFlyin="onShow" :flyinVisible="show"/>

        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchResult from './SearchResult'
import PresenterQueue from './PresenterQueue'

export default {
    name: 'searchFlyin',
    components: {
        SearchResult,
        PresenterQueue,
    },
    data: function() { return {
        productsFilteredBySearch: [],
        show: false,
    }},
    computed: {
        ...mapGetters('products', ['products'])
    },
    methods: {
        onShow() {
            
            this.show = true
            // Wait for the flyin to become visible
            this.$nextTick(() => { this.$nextTick(() => {
                this.$refs.searchField.setFocus()
            })})
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.presenter-queue-search-flyin {
    ::v-deep {
        .flyin {
            width: 400px;
            min-width: 0;
            .body {
                background: white;
            }
        }
        .flyin-header {
            .left{
                width: 100%;
            }
            .close {

            }
        }
        .search-field input {
            height: 40px;
        }
    }
    .search-field {
        width: 100%;
    }
    .inner {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .header {
            background: $bg;
            height: 32px;
            padding: 0 16px;
            display: flex;
            align-items: center;
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