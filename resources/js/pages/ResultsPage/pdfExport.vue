<template>
    <div class="example-pdf" :style="testFeaturesEnabled && { visibility: 'visible' }">
        <div class="overlay" @click="$emit('close')"></div>
        <div class="wrapper" ref="pdfWrapper">
            <div class="inner" style="font-family: 'Roboto', sans-serif, helvetica, arial; position: relative;">
                <div
                    class="page"
                    v-for="(productChunk, index) in chunksToShow"
                    :key="index"
                    style="width: 744pt; height: 1052.5pt; overflow: hidden;
                box-sizing: border-box; padding: 60px 38px 38px; position: relative;"
                >
                    <div
                        class="header"
                        style="display: -webkit-box; -webkit-box-pack: justify; justify-content: space-between;
                    position: absolute; top: 16px; left 0; width: 684pt;"
                    >
                        <div class="left">
                            <p style="margin: 0; font-weight: 700">{{ currentFile.name }}</p>
                            <p style="margin: 0; margin-top: 8px; font-weight: 400">{{ formatDate(new Date()) }}</p>
                        </div>
                        <div class="right" style="text-align: right;">
                            <p style="margin: 0; font-weight: 400">Page {{ index + 1 }} of {{ totalPages }}</p>
                        </div>
                    </div>

                    <ProductListItem
                        v-for="product in productChunk"
                        :key="product.id"
                        :index="index"
                        :product="product"
                        :includeVariants="includeVariants"
                        :exportComments="exportComments"
                        :includeDistribution="includeDistribution"
                        :includeNotDecided="includeNotDecided"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProductListItem from './ProductListItem'

export default {
    name: 'pdfExport',
    components: {
        ProductListItem,
    },
    props: [
        'products',
        'exportComments',
        'includeDistribution',
        'includeNotDecided',
        'chunkIndex',
        'includeVariants',
        'testFeaturesEnabled',
        'chunkSize',
    ],
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', ['currentSelection']),
        // productChunks() {
        //     const array = this.products
        //     const chunkedArr = []
        //     const size = this.includeVariants ? 1 : this.exportComments ? 3 : 6
        //     for (let i = 0; i < array.length; i++) {
        //         const last = chunkedArr[chunkedArr.length - 1]
        //         if (!last || last.length === size) {
        //             chunkedArr.push([array[i]])
        //         } else {
        //             last.push(array[i])
        //         }
        //     }
        //     return chunkedArr
        // },
        // chunksToShow() {
        //     if (!this.testFeaturesEnabled || this.chunkSize <= 0) return this.productChunks
        //     const size = this.includeVariants ? 1 : this.exportComments ? 3 : 6
        //     const target = this.chunkSize // MUST be divisible by 6
        //     const chunkAmount = target / size
        //     const start = this.chunkIndex * chunkAmount
        //     return this.productChunks.slice(start, start + chunkAmount)
        // },
        // totalPages() {
        //     return this.chunksToShow.length
        // },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.example-pdf {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    visibility: hidden;
    .overlay {
        display: block;
        z-index: 0;
    }
    .wrapper {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
        max-width: 1000px;
        height: 90vh;
        top: 5vh;
        background: white;
        box-shadow: 0 0 20px rgba(black, 50%);
        overflow-x: hidden;
        overflow-y: auto;
        z-index: 1;
    }
}
</style>
