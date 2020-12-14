<template>
    <BaseModal ref="exportModal" :header="'Export products to File'" @close="$emit('close')" :show="show">
        <form @submit.prevent>
            <div class="form-section">
                <label>File name</label>
                <BaseInputField v-model="newFileName" :placeholder="`Ex. ${this.currentFile.name} - Export`" />
            </div>
            <div class="form-section">
                <h4>Where should the file be created?</h4>
                <FileNavigator
                    :initialFolderId="currentFile.parent_id"
                    :disabledId="currentFile.id"
                    selectFile="single"
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
            newFileName: '',
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
        ...mapGetters('workspaces', {
            workspace: 'currentWorkspace',
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
            this.workspace.id
            const file = {
                name: this.newFileName ? this.newFileName : `${this.currentFile.name} - Export`,
                id: null,
                type: 'File',
                parent_id: this.folderToCreateFileIn.id != this.workspace.id ? this.folderToCreateFileIn.id : 0,
                workspace_id: this.workspace.id,
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
