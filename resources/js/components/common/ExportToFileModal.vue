<template>
    <BaseModal ref="exportModal" :header="'Export products to File'" @close="$emit('close')" :show="show">
        <form @submit.prevent>
            <div class="form-section">
                <FileNavigator
                    :initialFolderId="currentFile.parent_id"
                    :disabledId="currentFile.id"
                    v-model="fileToExportTo"
                    @update:folder="onUpdateFolder"
                />
            </div>
            <div class="form-section">
                <div class="form-element">
                    <BaseCheckboxInputField v-model="exportSelectedProducts">
                        Export selected products only
                    </BaseCheckboxInputField>
                </div>
            </div>
            <div class="action-list">
                <button class="primary ghost" @click="onCreateNewFile">
                    <span>Add to new file here</span>
                </button>
                <button class="primary" :disabled="!fileToExportTo" @click="onAddToFile">
                    <span>Add to selected file</span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FileNavigator from './FileNavigator'

export default {
    name: 'exportToFileModal',
    components: {
        FileNavigator,
    },
    props: ['show'],
    data: function() {
        return {
            fileToExportTo: null,
            folderToCreateFileIn: null,
            exportSelectedProducts: false,
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
        productsToExport() {
            const products = this.exportSelectedProducts ? this.selectedProducts : this.products
            return products.map(product => {
                const newProduct = Object.assign({}, product)
                delete newProduct.id
                delete newProduct.selectionInputList
                return newProduct
            })
        },
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateFile']),
        ...mapActions('products', ['insertProducts']),
        onUpdateFolder(folder) {
            this.folderToCreateFileIn = folder
            this.fileToExportTo = null
        },
        async onCreateNewFile() {
            const file = {
                name: `${this.currentFile.name} - Export`,
                id: null,
                type: 'File',
                parent_id: this.folderToCreateFileIn.id,
            }
            await this.insertOrUpdateFile({ file })
            // console.log('insert products', this.productsToExport)
            await this.insertProducts({ file, products: this.productsToExport, addToState: false })
            this.$emit('close')
        },
        async onAddToFile() {
            await this.insertProducts({ file: this.fileToExportTo, products: this.productsToExport, addToState: false })
            this.$emit('close')
        },
    },
    mounted() {
        this.exportSelectedProducts = this.selectedProducts.length > 0
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
</style>
