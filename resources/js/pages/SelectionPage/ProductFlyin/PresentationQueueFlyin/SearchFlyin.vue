<template>
    <BaseFlyin class="presenter-queue-search-flyin" :show="show" @close="show = false" placement="left">
        <template v-slot:header v-if="show">
            <BaseFlyinHeader v-if="show" :disableNavigation="true" @close="show = false" placement="left">
                <template v-slot:left>
                    <div class="search-field">
                        <BaseSearchField
                            ref="searchField"
                            :searchKey="['datasource_id', 'title']"
                            placeholderText="Search Product name, ID"
                            :inputClasses="''"
                            :arrayToSearch="products"
                            v-model="productsFilteredBySearch"
                        />
                    </div>
                </template>
            </BaseFlyinHeader>
        </template>

        <template v-slot:default>
            <div class="inner">
                <div class="header">
                    <strong>Results {{ productsFilteredBySearch.length }}</strong>
                    <button class="primary sm" @click="onAddAllResultsToQueue">
                        <i class="far fa-plus" style="margin-right: 2px"></i>
                        <span>Add all results to queue</span>
                    </button>
                </div>

                <RecycleScroller
                    class="result-list"
                    :items="productsFilteredBySearch"
                    :item-size="176"
                    key-field="id"
                    v-slot="{ item }"
                >
                    <SearchResult class="product-result" :product="item" />
                </RecycleScroller>

                <div class="footer">
                    <button class="primary full-width md" @click="show = false">
                        <span>Done</span>
                    </button>
                </div>
            </div>
        </template>

        <template v-slot:alwaysVisible>
            <!-- Will always be visible to the right of the flyin -->
            <PresentationQueue @showSearchFlyin="onShow" :flyinVisible="show" />
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SearchResult from './SearchResult'
import PresentationQueue from './PresentationQueue'

export default {
    name: 'searchFlyin',
    components: {
        SearchResult,
        PresentationQueue,
    },
    data: function() {
        return {
            productsFilteredBySearch: [],
            show: false,
        }
    },
    watch: {
        show(newVal) {
            // const chatIcon = document.getElementById('crisp-chat-icon')
            // const chatBox = document.getElementById('crisp-chat')
            // if (newVal) {
            //     // Adjust the placement of the chatbox
            //     if (chatIcon) chatIcon.style.setProperty('right', `calc(100vw - ${400 + 60 + 16}px)`, 'important');
            // } else {
            //     // Adjust the placement of the chatbox
            //     if (chatIcon) chatIcon.style.setProperty('right', `${Math.min(1500 + 24, window.innerWidth - 242 + 24)}px`, 'important');
            // }
        },
    },
    computed: {
        ...mapGetters('products', ['products']),
    },
    methods: {
        ...mapActions('presentationQueue', ['addMultipleProductsTopresentationQueue']),
        onShow() {
            this.show = true
            // Wait for the flyin to become visible
            this.$nextTick(() => {
                this.$nextTick(() => {
                    this.$refs.searchField.setFocus()
                })
            })
        },
        onAddAllResultsToQueue() {
            this.addMultipleProductsTopresentationQueue(this.productsFilteredBySearch)
        },
    },
}
</script>

<style lang="scss" scoped>
// ::v-deep {
//     &.presenter-queue-search-flyin {
//         &.visible {
//             .flyin.placement-left {
//                 left: 0;
//             }
//         }
//     }
// }

.presenter-queue-search-flyin {
    &::v-deep {
        &.visible .flyin {
            transform: translateX(0);
        }
        .flyin {
            width: 400px;
            min-width: 0;
            transform: translateX(-400px);
            // left: -400px;
            .body {
                background: white;
            }
        }
        .flyin-header {
            .left {
                width: 100%;
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
