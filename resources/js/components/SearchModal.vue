<template>
    <Modal ref="modal" class="search-modal minimal">
        <div class="search">
            <input
                ref="searchField"
                type="search"
                class="input-wrapper"
                placeholder="Search by product title or id.."
                v-model="searchStr"
                @input="search()"
            />
            <span v-if="searchStr.length > 0" class="clear" @click="searchStr = ''">
                <i class="fas fa-times"></i>
            </span>
        </div>

        <div class="results" v-if="results.length > 0">
            <h3>Results:</h3>
            <table>
                <tr>
                    <th>Image</th>
                    <th>ID</th>
                    <th>Title</th>
                </tr>
                <tr
                    class="result clickable"
                    v-for="(result, index) in resultsToShow"
                    :key="index"
                    ref="result"
                    @click="showResult(result.item.id)"
                >
                    <td class="img">
                        <img :src="productImg(result.item.color_variants[0])">
                    </td>
                    <td class="id">
                        <template v-if="result.datasource_id">
                            <span v-html="result.datasource_id"></span>
                            <!-- <span>{{ result.datasource_id.start }}</span
                            ><span class="match">{{ result.datasource_id.match }}</span
                            ><span>{{ result.datasource_id.end }}</span> -->
                        </template>
                        <template v-else>
                            {{ result.item.datasource_id }}
                        </template>
                    </td>
                    <td class="title">
                        <span v-if="result.title" v-html="result.title">
                            <!-- <span>we have a highlight result: </span>
                            <span ></span> -->
                            <!-- <span>{{ result.title.start }}</span
                            ><span class="match">{{ result.title.match }}</span
                            ><span>{{ result.title.end }}</span> -->
                        </span>
                        <template v-else>
                            {{ result.item.title }}
                        </template>
                    </td>
                </tr>
            </table>
        </div>
        <p v-else-if="searchStr.length > 0" style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
            No results
        </p>
    </Modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Fuse from 'fuse.js'
import Modal from './Modal'

export default {
    name: 'searchModal',
    components: {
        Modal,
    },
    data: function() {
        return {
            searchStr: '',
            results: [],
        }
    },
    computed: {
        ...mapGetters('entities/products', ['productsScoped', 'productsRaw']),
        products() {
            if (this.$route.name == 'file')
                return this.productsScoped
            else if (this.$route.name == 'editFile')
                return this.productsRaw
        },
        resultsToShow() {
            const limit = 5
            let resultsToReturn = []
            let index = 0
            this.results.forEach(result => {
                let matchIndex = 0
                result.matches.forEach(match => {
                    result[match.key] = {}
                    result[match.key] = this.generateHighlightedText(match.value, match.indices)
                })
                if (index <= limit) resultsToReturn.push(result)
                index++
            })
            return resultsToReturn
        },
    },
    methods: {
        ...mapActions('entities/products', ['showSingle', 'setAvailableProductIds']),
        generateHighlightedText(text, regions) {
            if (!regions) return text

            var content = '',
                nextUnhighlightedRegionStartingIndex = 0

            regions.forEach(function(region) {
                content +=
                    '' +
                    text.substring(nextUnhighlightedRegionStartingIndex, region[0]) +
                    '<span class="highlight">' +
                    text.substring(region[0], region[1] + 1) +
                    '</span>' +
                    ''
                nextUnhighlightedRegionStartingIndex = region[1] + 1
            })

            content += text.substring(nextUnhighlightedRegionStartingIndex)

            return content
        },
        showResult(id) {
            this.showSingle(id)
            this.setAvailableProductIds([id])
        },
        toggle() {
            this.$refs.modal.toggle()
            this.$refs.searchField.focus()
        },
        close() {
            this.$refs.modal.close()
        },
        search() {
            const options = {
                shouldSort: true,
                includeScore: true,
                includeMatches: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 2,
                keys: ['title', 'datasource_id'],
            }
            const fuse = new Fuse(this.products, options)
            this.results = fuse.search(this.searchStr)
        },
        productImg(variant) {
            if (variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.search-modal {
    &.active {
        z-index: 10;
    }
    .close {
        display: none;
    }
}
.results {
    margin-top: 20px;
    table {
        width: 100%;
        border-collapse: collapse;
    }
    .result {
        &:hover {
            background: $light1;
        }
        > * {
            padding-top: 8px;
            padding-bottom: 8px;
            border-top: 1px solid $light2;
        }
        .img {
            padding-right: 20px;
        }
        .id {
            padding-right: 40px;
        }
        img {
            height: 70px;
            width: 60px;
            object-fit: cover;
            object-position: center;
            display: block;
        }
    }
}
.search {
    position: relative;
    input.input-wrapper {
        padding-right: 32px;
        box-sizing: border-box;
    }
    .clear {
        position: absolute;
        right: 10px;
        top: 12px;
        font-size: 16px;
        color: $dark05;
        cursor: pointer;
        padding: 4px 12px;
        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
