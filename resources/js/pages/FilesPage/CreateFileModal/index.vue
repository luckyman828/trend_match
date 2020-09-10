<template>
    <BaseModal :classes="['create-file-modal', currentScreen.name == 'mapFields' ? 'map-fields' : '']" :show="show" @close="$emit('close')"
    ref="modal" :header="currentScreen.header" :goBack="currentScreen.name == 'mapFields'" @goBack="onGoBack">

            <BaseLoader v-if="uploadInProgress"
            :msg="submitStatus"/>

            <UploadWorkbooksScreen v-else-if="currentScreen.name == 'chooseFiles'"
                :fileList.sync="uploadedFiles"
                :availableFiles.sync="availableFiles"
                @go-to-next-screen="onGoToMapFields"
            >
                <template v-slot:header>
                    <div class="form-element" style="text-align: center;">
                        <p>A file is a collection of products that users will be able to view in the dashboard and/or app</p>
                        <p><strong>Select CSV files to upload to get started, or create empty file</strong></p>
                    </div>

                    <div class="form-element">
                        <label for="file-name-input">File name* (required)</label>
                        <BaseInputField ref="fileNameInput" id="file-name-input" placeholder="unnamed file" v-model="newFile.name"
                        :focusOnMount="true" :selectOnFocus="true"/>
                    </div>
                </template>

                <template v-slot:actions="slotProps">
                    <button type="button" class="lg primary ghost" :disabled="newFile.name.length <= 0"
                    @click="createEmpty">
                        <span>Create Empty</span>
                    </button>
                    <button type="button" class="lg primary" :disabled="slotProps.fileList.length <= 0"
                    @click="slotProps.submit()">
                        <span>Next: Map fields</span>
                    </button>
                </template>
            </UploadWorkbooksScreen>


            <MapFieldsScreen v-else-if="currentScreen.name == 'mapFields' && availableFiles.length > 0"
                :availableFiles="availableFiles"
                :newFile="newFile"
                @close="onClose"
                @reset="onReset"
                @submit="onSubmit"
            >
                <template v-slot:actions="slotProps">
                    <BaseButton :type="'submit'" 
                    buttonClass="lg primary full-width"
                    :disabled="!!slotProps.submitDisabled"
                    :disabledTooltip="slotProps.submitDisabled"
                    style="width: 100%"
                    @click="slotProps.submit()">
                        <span>Create file</span>
                    </BaseButton>
                </template>
            </MapFieldsScreen>


    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import workbookUtils from '../../../mixins/workbookUtils'
// import UploadFilesScreen from './UploadFilesScreen'
import UploadWorkbooksScreen from '../../../components/common/MapProductData/UploadWorkbooksScreen'
import MapFieldsScreen from '../../../components/common/MapProductData/MapFieldsScreen'

export default {
    name: 'createFileModal',
    components: {
        // UploadFilesScreen,
        UploadWorkbooksScreen,
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
        availableFiles: [],
        uploadInProgress: false,
        submitStatus: '',
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
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateFile', 'syncExternalImages']),
        ...mapActions('products', ['insertProducts']),
        createEmpty() {
            // Create a copy of the new file object
            const newFile = JSON.parse(JSON.stringify(this.newFile))
            newFile.id = 0
            newFile.parent_id = this.currentFolder ? this.currentFolder.id : 0
            newFile.workspace_id = this.currentWorkspace.id
            this.insertOrUpdateFile({file: newFile})
            // Reset modal
            this.onClose()
            this.onReset()
        },
        async onGoToMapFields() {
            this.currentScreen={name: 'mapFields', header: 'Map fields'}
        },
        onGoBack() {
            //Change the current screen
            this.currentScreen={name: 'chooseFiles', header: 'Create new file'}
        },
        onReset() {
            this.$emit('reset')
        },
        onClose() {
            this.$emit('close')
        },
        async onSubmit(newProducts) {
            // console.log('on submit create file')
            this.uploadInProgress= true

            this.submitStatus = 'Creating products'

            this.submitStatus = 'Creating file'
            // Set new file data
            const newFile = this.newFile
            newFile.id = 0
            newFile.parent_id = this.currentFolder ? this.currentFolder.id : 0
            newFile.workspace_id = this.currentWorkspace.id


            // Assume upload success (we use this variabel to tell whether the upload was succesful or not)
            let uploadSuccess = true

            // First we need to create a file for the products, since the API requires that products be uploaded to an existing file
            await this.insertOrUpdateFile({file: newFile})

            // Then we will instantiate the products and attempt to upload them

            this.submitStatus = 'Uploading new products'
            await this.insertProducts({file: newFile, products: newProducts, addToState: false}).catch(err => {
                window.alert('Something went wrong. Please try again')
                this.submitStatus = 'Error'
                uploadSuccess = false
            })

            if (uploadSuccess) {
                this.submitStatus = 'Uploading images. This may take a while'
                await this.syncExternalImages({file: newFile, products: newProducts, progressCallback: this.uploadImagesProgressCalback}).catch(err => {
                    this.SHOW_SNACKBAR({ 
                        msg: `<p><strong>Hey you!</strong><br></p>
                        <p>We will display your images from your provided URLs.</p>
                        <p>This will most likely not be a problem, but it means that we are not hosting the images, and can't guarantee that they will always be available.</p>
                        <p>if you see this icon <i class="far fa-heart-broken primary"></i> it means that we cant fetch the image.</p>`,
                        type: 'info', 
                        iconClass: 'fa-exclamation-circle', 
                    })
                })
            }

            if (uploadSuccess) {
                this.onClose()
                this.onReset()
            }
            this.uploadInProgress = false
        },
        uploadImagesProgressCalback(progress) {
            this.submitStatus = `Uploading images. This may take a while.<br>
            <strong>${progress}%</strong> done.`
        },
    },
    created() {
        this.newFile = JSON.parse(JSON.stringify(this.defalultNewFile))
    },
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