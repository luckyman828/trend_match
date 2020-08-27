<template>
    <BaseModal :classes="['create-file-modal', currentScreen.name == 'mapFields' ? 'map-fields' : '']" :show="show" @close="$emit('close')"
    ref="modal" :header="currentScreen.header" :goBack="currentScreen.name == 'mapFields'" @goBack="onGoBack">

            <BaseLoader v-if="processingFiles"
            :msg="processingFiles ? 'Reading files. This may take a few minutes' : ''"/>

            <UploadFilesScreen v-else-if="currentScreen.name == 'chooseFiles'"
                :fileList.sync="uploadedFiles"
                :newFile="newFile"
                @create-empty="createEmpty"
                @go-to-next-screen="onGoToMapFields"
            />


            <MapFieldsScreen v-else-if="currentScreen.name == 'mapFields' && availableFields.length > 0"
                :availableFields="availableFields"
                :newFile="newFile"
                @close="onClose"
                @reset="onReset"
            />


    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import workbookUtils from '../../../mixins/workbookUtils'
import UploadFilesScreen from './UploadFilesScreen'
import MapFieldsScreen from './MapFieldsScreen'

export default {
    name: 'createFileModal',
    components: {
        UploadFilesScreen,
        MapFieldsScreen,
    },
    mixins: [
        workbookUtils,
    ],
    props: [
        'show'
    ],
    data: function () { return {
        currentScreen: {name: 'chooseFiles', header: 'Create new file'},
        uploadedFiles: [],
        availableFields: [],
        processingFiles: false,
        defalultNewFile: {
            id: null,
            name: 'New file',
            type: 'File',
        },
        newFile: null,
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFolder']),
        submitValid() {
            //assume true
            let valid = true
            // Check that all files have a valid key
            this.availableFiles.forEach(file => {
                if (file.key.fileIndex == null) {
                    valid = false
                }
            })
            // Loop through the fields and look for errors
            this.fieldsToMatch.forEach(field => {
                // Check if the field has been mapped
                if (field.enabled && field.newValue.fieldIndex != null) {
                    if (!this.validateField(field)) {
                        valid = false
                    }
                }
            })
            // Loop through the currencies and look check their names
            if (!this.singleCurrencyFile) {
                this.currenciesToMatch.forEach(currency => {
                    if(currency.fileIndex != null && !this.validateCurrency(currency)) {
                        valid = false
                    }
                })
            }
            return valid
        }
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateFile', 'syncExternalImages']),
        ...mapActions('products', ['insertProducts', 'uploadImage' ,'updateManyProducts']),
        ...mapActions('mapProductData', ['getProductFields']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        createEmpty() {
            // Create a copy of the new file object
            const newFile = JSON.parse(JSON.stringify(this.newFile))
            newFile.id = null
            newFile.parent_id = this.currentFolder ? this.currentFolder.id : 0
            newFile.workspace_id = this.currentWorkspace.id
            this.insertOrUpdateFile(newFile)
            // Reset modal
            this.onClose()
            this.onReset()
        },
        async onGoToMapFields() {
            // Use promises to make sure we have processed all the uploaded files before we continue
            this.processingFiles = true
            await Promise.all(this.uploadedFiles.map(async file => {
                await new Promise((resolve, reject) => {
                    const fileReader = new FileReader()
                    fileReader.readAsArrayBuffer(file, 'ISO-8859-4')
                    fileReader.onload = async e => {
                        await this.processFile(e.target.result, file.name)
                        resolve()
                    }
                })
            }))
            // Remove files from available files that are no longer mapped
            for (let i = this.availableFields.length-1; i >= 0; i--) {
                const file = this.availableFields[i]
                // Check if the file exists in uploaded files
                const shouldBeRemoved = !this.uploadedFiles.find(x => x.name == file.fileName)
                if (shouldBeRemoved) {
                    this.availableFields.splice(i, 1)
                }
            }
            //Change the current screen
            this.processingFiles = false
            this.currentScreen={name: 'mapFields', header: 'Map fields'}
        },
        onGoBack() {
            //Change the current screen
            this.currentScreen={name: 'chooseFiles', header: 'Create new file'}
        },
        async processFile(workbook, fileName) {
            const rows = this.parseWorkbookToRowsAndCells(workbook)

            // // Check if the file already exists. If so, replace it instead of adding
            const existingFile = this.availableFields.find(x => x.fileName == fileName)
            if (existingFile) {
                Object.assign(existingFile, rows)
            } else {
                const mappedKey = await this.getProductFields({scope: 'key'})
                const variantKey = await this.getProductFields({scope: 'variantKey'})
                // const assortmentKey = await this.getProductFields({scope: 'assortmentKey'})
                // const priceKey = await this.getProductFields({scope: 'priceKey'})
                this.availableFields.push({
                    mappedKey: mappedKey[0],
                    variantKey : variantKey[0],
                    // assortmentKey : assortmentKey[0],
                    // priceKey : priceKey[0],
                    headers: Object.keys(rows[0]),
                    fileName,
                    rows
                })
            }
        },
        onReset() {
            this.$emit('reset')
        },
        onClose() {
            this.$emit('close')
        },
    },
    created() {
        this.newFile = JSON.parse(JSON.stringify(this.defalultNewFile))
    }
}
</script>

<style lang="scss">
@import '~@/_variables.scss';

    .create-file-modal {
        &.map-fields {
            .modal {
                width: 1068px;
                max-width: 90vw;
                .body {
                    max-width: none;
                    .input-field {
                        &.auto-match {
                            .input-wrapper {
                                border-color: $primary
                            }
                        }
                        &.custom-entry {
                            .input-wrapper {
                                border-color: $orange
                            }
                        }
                    }
                }
            }
        }
    }

</style>

<style scoped lang="scss">
@import '~@/_variables.scss';

    
</style>