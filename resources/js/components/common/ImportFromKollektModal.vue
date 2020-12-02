<template>
    <BaseModal ref="importModal" :header="'Import products to File'" @close="onClose" :show="show">
        <form @submit.prevent>
            <div class="form-section">
                <FileNavigator
                    :initialFolderId="currentFile.parent_id"
                    :disabledId="currentFile.id"
                    selectFile="multiple"
                    v-model="selectedFiles"
                />
            </div>
            <div class="form-section">
                <h4>Selected Files</h4>
                <div class="selected-file-list">
                    <div class="file" v-for="(file, index) in selectedFiles" :key="file.id">
                        <i class="fas fa-file"></i>
                        <span>{{ file.name }}</span>
                        <button class="invisible ghost-hover" @click="onRemoveSelectedFile(index)">
                            <i class="far fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="action-list">
                <button class="primary" :disabled="selectedFiles.length < 1" @click="onImport">
                    <span>Import from files</span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import FileNavigator from './FileNavigator'

export default {
    name: 'importFromKollektModal',
    components: {
        FileNavigator,
    },
    props: ['show'],
    data: function() {
        return {
            selectedFiles: [],
        }
    },
    computed: {
        ...mapGetters('files', {
            currentFile: 'currentFile',
        }),
        ...mapGetters('products', {
            products: 'productsFiltered',
            selectedProducts: 'getSelectedProducts',
        }),
    },
    methods: {
        ...mapActions('products', ['insertProducts', 'fetchProducts']),
        ...mapMutations('display', ['HIDE_COMPONENT']),
        onRemoveSelectedFile(index) {
            this.selectedFiles.splice(index, 1)
        },
        async onImport() {
            const productsToImport = []
            // Loop through each file
            await Promise.all(
                this.selectedFiles.map(async file => {
                    // Fetch their products
                    const fileProducts = await this.fetchProducts({ fileId: file.id, addToState: false })
                    const products = fileProducts.map(product => {
                        const newProduct = Object.assign({}, product)
                        delete newProduct.id
                        delete newProduct.selectionInputList
                        return newProduct
                    })
                    // Filter out duplicates
                    const productsFiltered = products.filter(
                        product => !productsToImport.find(x => x.datasource_id == product.datasource_id)
                    )
                    productsToImport.push(...productsFiltered)
                })
            )
            // Add them to this file
            await this.insertProducts({ file: this.currentFile, products: productsToImport, addToState: true })
            this.onClose()
        },
        onClose() {
            this.HIDE_COMPONENT('importFromKollektModal')
        },
    },
    destroyed() {
        this.onClose()
    },
}
</script>

<style lang="scss" scoped>
.action-list {
    margin-top: 8px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    > * {
        margin-left: 8px;
    }
}
.file {
    i.fa-file {
        margin-right: 8px;
    }
}
</style>
