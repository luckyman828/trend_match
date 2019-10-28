<template>
    <Modal ref="modal" class="search-modal minimal">
        <div class="search">
            <input ref="searchField" type="search" class="input-wrapper" placeholder="Search by product title or id.." v-model="searchStr" @input="search()">
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
                <tr class="result clickable" v-for="(result, index) in resultsToShow" :key="index" ref="result" @click="showResult(result.item.id)">
                    <td class="img">
                        <img :src="productImg(result.item.color_variants[0])" @error="imgError(product.color_variants[0])">
                    </td>
                    <td class="id">
                        <template v-if="result.datasource_id">
                            <span>{{result.datasource_id.start}}</span><span class="match">{{result.datasource_id.match}}</span><span>{{result.datasource_id.end}}</span>
                        </template>
                        <template v-else>
                            {{result.item.datasource_id}}
                        </template>
                    </td>
                    <td class="title">
                        <template v-if="result.title">
                            <span>{{result.title.start}}</span><span class="match">{{result.title.match}}</span><span>{{result.title.end}}</span>
                        </template>
                        <template v-else>
                            {{result.item.title}}
                        </template>
                    </td>
                </tr>
            </table>
        </div>
        <p v-else-if="searchStr.length > 0" style="text-align: center; margin-top: 20px; margin-bottom: 20px;">No results</p>
    </Modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Fuse from 'fuse.js'
import Modal from './Modal'

export default {
    name: 'searchModal',
    components: {
        Modal
    },
    data: function () { return {
        searchStr: '',
        results: []
    }},
    computed: {
        ...mapGetters('entities/products', ['productsScoped']),
        resultsToShow() {
            const limit = 5
            let resultsToReturn = []
            let index = 0
            this.results.forEach(result => {
                let matchIndex = 0
                result.matches.forEach(match => {
                    const indexStart = match.indices[matchIndex][0]
                    const indexEnd = match.indices[matchIndex][1]
                    result[match.key] = {}
                    result[match.key].start = match.value.substr(0, indexStart)
                    result[match.key].match = match.value.substr(indexStart, indexEnd+1)
                    result[match.key].end = match.value.substr(indexEnd+1, match.value.length)
                    matchIndex++
                })
                if (index <= limit)
                    resultsToReturn.push(result)
                index++
            })
            return resultsToReturn
            // return this.results.slice(0, limit)
        }
    },
    methods: {
        ...mapActions('entities/products', ['showSingle', 'setAvailableProductIds']),
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
                keys: ["title", "datasource_id"]
            }
            const fuse = new Fuse(this.productsScoped, options)
            this.results = fuse.search(this.searchStr)
        },
        productImg(variant) {
            if (!variant.error && variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        imgError (variant) {
             variant.error = true
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    
    .search-modal {
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
    span.match {
        border-bottom: solid 1px $primary;
    }
    .search {
        position: relative;
        input.input-wrapper{
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
                opacity: .8;
            }
        }
    }

</style>