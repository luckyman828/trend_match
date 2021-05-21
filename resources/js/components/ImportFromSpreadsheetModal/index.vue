<template>
    <BaseModal
        :classes="['upload-to-file-modal', currentScreen.class]"
        :show="show"
        @close="onClose"
        ref="modal"
        :header="currentScreen.header"
        :goBack="currentScreenIndex > 0"
        @goBack="products.length > 0 ? currentScreenIndex-- : (currentScreenIndex = 0)"
    >
        <BaseLoader v-if="uploadInProgress" :msg="submitStatus" />

        <template v-else>
            <UploadWorkbooksScreen
                v-if="currentScreenIndex == 0"
                :fileList.sync="uploadedFiles"
                :availableFiles.sync="availableFiles"
                @go-to-next-screen="onGoToNextScreen"
            >
                <template v-slot:header>
                    <div class="form-element" style="text-align: center;">
                        <p><strong>Select workbooks (CSV, Excel, etc.) to upload</strong></p>
                    </div>
                </template>

                <template v-slot:actions="slotProps">
                    <button
                        type="button"
                        class="lg primary full-width"
                        :disabled="slotProps.fileList.length <= 0"
                        @click="slotProps.submit()"
                    >
                        <span v-if="products.length > 0">Next: Upload strategy</span>
                        <span v-else>Next: Map data</span>
                    </button>
                </template>
            </UploadWorkbooksScreen>

            <UploadStrategyScreen
                v-if="currentScreenIndex == 1"
                :uploadStrategy.sync="uploadStrategy"
                @go-to-next-screen="onGoToNextScreen"
            />

            <SelectFieldsScreen
                v-if="currentScreenIndex == 2"
                :uploadOptions.sync="uploadOptions"
                @go-to-next-screen="currentScreenIndex++"
            />

            <MapFieldsScreen
                v-if="currentScreenIndex == 3"
                :availableFiles="availableFiles"
                :uploadOptions="uploadOptions"
                @close="onClose"
                @reset="onReset"
                @submit="onSubmit"
            >
                <template v-slot:actions="slotProps">
                    <BaseButton
                        :type="'submit'"
                        buttonClass="lg primary full-width"
                        :disabled="!!slotProps.disabled"
                        :disabledTooltip="slotProps.disabledTooltip"
                        style="width: 100%"
                        @click="slotProps.submit()"
                    >
                        <span>Update data</span>
                    </BaseButton>
                </template>
            </MapFieldsScreen>
        </template>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UploadWorkbooksScreen from '../common/MapProductData/UploadWorkbooksScreen'
import SelectFieldsScreen from './SelectFieldsScreen'
import UploadStrategyScreen from './UploadStrategyScreen'
import MapFieldsScreen from '../common/MapProductData/MapFieldsScreen'
import workbookUtils from '../../mixins/workbookUtils'

export default {
    name: 'importFromSpreadsheetModal',
    mixins: [workbookUtils],
    components: {
        UploadWorkbooksScreen,
        SelectFieldsScreen,
        UploadStrategyScreen,
        MapFieldsScreen,
    },
    props: ['show'],
    data: function() {
        return {
            currentScreenIndex: 0,
            screens: [
                {
                    header: 'Choose files to upload',
                    class: 'index',
                },
                {
                    header: 'Upload strategy',
                    class: 'upload-strategy',
                },
                {
                    header: 'Upload options',
                    class: 'upload-options',
                },
                {
                    header: 'Map fields',
                    class: 'map-fields',
                },
            ],
            uploadedFiles: [],
            availableFiles: [],
            uploadInProgress: false,
            submitStatus: null,
            uploadOptions: null,
            uploadStrategy: null,
        }
    },
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('products', ['products']),

        currentScreen() {
            return this.screens[this.currentScreenIndex]
        },
    },
    methods: {
        ...mapActions('products', ['updateManyProducts', 'insertProducts', 'deleteProducts', 'initProducts']),
        ...mapActions('files', ['syncExternalImages']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        ...mapMutations('display', ['SHOW_COMPONENT', 'HIDE_COMPONENT']),
        onReset() {
            this.$emit('reset')
        },
        onClose() {
            this.HIDE_COMPONENT('importFromSpreadsheetModal')
        },
        onGoToNextScreen() {
            if (this.products.length > 0 && (!this.uploadStrategy || !this.uploadStrategy.createNewProductSet)) {
                this.currentScreenIndex++
                return
            }

            // Instantiate stratey and options and go straight to mapping
            this.uploadStrategy = {
                dataReplacementStrategy: 'smart',
                removeExtraProducts: false,
                addMissingProducts: true,
                createNewVariants: true,
                updateExistingVariants: false,
            }
            this.currentScreenIndex = 3
        },
        async onSubmit(newProducts, mappedfields) {
            this.uploadInProgress = true
            this.submitStatus = 'Applying update strategy'

            const productsToCreate = []
            const productsToDelete = this.uploadStrategy.removeExtraProducts
                ? JSON.parse(JSON.stringify(this.products))
                : []

            // Loop through the new products
            newProducts.map(newProduct => {
                // Find the matching existing product
                const product = this.products.find(x => x.datasource_id == newProduct.datasource_id)
                if (!product) {
                    // If we have the setting to create missing products, and there is no match, add the product to a list of products to create
                    if (this.uploadStrategy.addMissingProducts) productsToCreate.push(newProduct)
                    return
                }

                // If we have the setting the delete extra products, remove this product form the list of products to delete
                if (this.uploadStrategy.removeExtraProducts) {
                    const productToDeleteIndex = productsToDelete.findIndex(
                        x => x.datasource_id == newProduct.datasource_id
                    )
                    if (productToDeleteIndex >= 0) {
                        productsToDelete.splice(productToDeleteIndex, 1)
                    }
                }
                // Update the existing product as per the data update strategy
                const strategy = this.uploadStrategy.dataReplacementStrategy
                // Loop through the new products keys - The product will only contain the keys that we want to update

                Object.keys(newProduct).map(key => {
                    if (key == 'datasource_id' || key == 'id') return // Don't fiddle with the datasource_id or id

                    // STRATEGY: REPLACE
                    if (strategy == 'replace') {
                        // If the strategy is replace, simply overwrite all the existing key values with our new values
                        Vue.set(product, key, newProduct[key])
                        return
                    }

                    this.setKeyValue(newProduct, product, key, strategy, mappedfields)
                })
            })

            // Delete products to delete
            if (productsToDelete.length > 0) {
                this.submitStatus = 'Deleting extra products'
                await this.deleteProducts({ file: this.currentFile, products: productsToDelete })
            }
            // Update all existing products
            if (this.products.length > 0) {
                this.submitStatus = 'Updating products'
                await this.updateManyProducts({ file: this.currentFile, products: this.products })
            }

            // Create products to create
            if (productsToCreate.length > 0) {
                this.submitStatus = 'Creating missing products'
                // REMEMBER TO UPLOAD IMAGES
                await this.insertProducts({ file: this.currentFile, products: productsToCreate, addToState: true })
            }

            // Upload images we need to upload
            // Test that we actually have new images to upload
            this.submitStatus = 'Uploading images. This may take a while'
            await this.syncExternalImages({
                file: this.currentFile,
                products: this.products,
                progressCallback: this.uploadImagesProgressCalback,
            }).catch(err => {
                this.SHOW_SNACKBAR({
                    msg: `<p><strong>Hey you!</strong><br></p>
                    <p>We will display your images from your provided URLs.</p>
                    <p>This will most likely not be a problem, but it means that we are not hosting the images, and can't guarantee that they will always be available.</p>
                    <p>if you see this icon <i class="far fa-heart-broken primary"></i> it means that we cant fetch the image.</p>`,
                    type: 'info',
                    iconClass: 'fa-exclamation-circle',
                })
                this.uploadInProgress = false
            })

            this.uploadInProgress = false

            this.onClose()
            this.onReset()
        },
        setKeyValue(srcProduct, targetProduct, key, strategy, mappedfields) {
            // console.log(
            //     'set key value',
            //     JSON.parse(JSON.stringify(srcProduct)),
            //     JSON.parse(JSON.stringify(targetProduct)),
            //     key,
            //     strategy
            // )
            if (srcProduct[key] == null || key == 'id') return // Don't do anything if we don't have a value

            // If the product key value is an array (variants, prices, assortments, eans)
            if (Array.isArray(targetProduct[key])) {
                const productArray = targetProduct[key]
                const newProductArray = srcProduct[key]
                // Loop through the new products array items to see if we should add anything
                newProductArray.map(newArrayItem => {
                    // Test if our arrayItem is an object or value
                    // If the arrayitem is an object
                    if (typeof newArrayItem == 'object') {
                        // Test if our array item matches an existing array item
                        const existingArrayItem = productArray.find(existingArrayItem => {
                            let keysToMatch = Object.keys(existingArrayItem)
                            if (key == 'variants') {
                                keysToMatch = ['name']
                                // if the src product's variants have no variant, only look at color, and vice versa
                                if (!srcProduct.variants.find(x => x.variant)) keysToMatch.push('color')
                                if (!srcProduct.variants.find(x => x.color)) keysToMatch.push('variant')
                            }
                            return keysToMatch.find(itemKey => {
                                const singleKeyAvailable = !(
                                    keysToMatch.includes('color') && keysToMatch.includes('variant')
                                )
                                if (
                                    existingArrayItem[itemKey] == null ||
                                    typeof existingArrayItem[itemKey] != 'string' ||
                                    typeof newArrayItem[itemKey] != 'string'
                                ) {
                                    return
                                }

                                const existingVal = existingArrayItem[itemKey].toLowerCase()
                                const newVal = newArrayItem[itemKey].toLowerCase()

                                const isMatching =
                                    existingVal == newVal ||
                                    (singleKeyAvailable &&
                                        (existingVal.search(newVal) >= 0 || newVal.search(existingVal) >= 0))

                                return isMatching
                            })
                        })

                        // If we found an existing match, we want to update that match
                        if (existingArrayItem) {
                            // Only update existing variants if the setting is set
                            if (key == 'variants' && !this.uploadStrategy.updateExistingVariants) {
                                return
                            }
                            if (key == 'variants') {
                                // Remove color/variant from variants if the field is disabled
                                const colorDisabled = mappedfields.find(
                                    field => field.scope == 'variants' && field.name == 'color' && !field.enabled
                                )
                                if (colorDisabled) {
                                    console.log('remove color')
                                    newArrayItem.color = null
                                }
                                const variantDisabled = mappedfields.find(
                                    field => field.scope == 'variants' && field.name == 'variant' && !field.enabled
                                )
                                if (variantDisabled) {
                                    console.log('remove variant')
                                    newArrayItem.variant = null
                                }
                                if (colorDisabled || variantDisabled) {
                                    newArrayItem.name = null
                                }
                            }

                            Object.keys(existingArrayItem).map(itemKey => {
                                // Call this function recursively (it doens't matter that it isnt actually a product)
                                this.setKeyValue(newArrayItem, existingArrayItem, itemKey, strategy, mappedfields)
                            })
                            return
                        }
                        // Check if we are adding variants, and want to add extra variants
                        if (key == 'variants' && !this.uploadStrategy.createNewVariants) return

                        // If we have no existing array item, but we have a new one - push it!
                        productArray.push(newArrayItem)
                    }

                    // ArrayItem is NOT an OBJECT --> check if it is included in the current array
                    const existsInArray = productArray.includes(newArrayItem)
                    if (!existsInArray) productArray.push(newArrayItem)
                })
                return
            }

            // Our key value is not an array

            // If our key value is another object, loop through that objects keys in this way
            if (typeof srcProduct[key] == 'object') {
                const srcObject = srcProduct[key]
                const targetObject = targetProduct[key]
                Object.keys(srcObject).map(itemKey => {
                    this.setKeyValue(srcObject, targetObject, itemKey, strategy, mappedfields)
                })
                return
            }

            // Ready to just set the object value
            if (
                (strategy == 'add' && !targetProduct[key]) || // If strategy is add, only add if the current value is null
                (strategy == 'smart' && srcProduct[key] != null && srcProduct[key] != '') // If the strategy is smart, replace/add unless we don't have a new value
            ) {
                targetProduct[key] = srcProduct[key]
            }
        },
        uploadImagesProgressCalback(progress) {
            this.submitStatus = `Uploading images. This may take a while.<br>
            <strong>${progress}%</strong> done.`
        },
    },
    destroyed() {
        this.onClose()
    },
}
</script>

<style lang="scss">
@import '~@/_variables.scss';
.upload-to-file-modal {
    &.map-fields {
        .modal {
            width: 1068px;
            max-width: 90vw;
            .body {
                max-width: none;
                .input-field {
                    &.auto-match {
                        .input-wrapper {
                            border-color: $primary;
                        }
                    }
                    &.custom-entry {
                        .input-wrapper {
                            border-color: $orange;
                        }
                    }
                }
            }
        }
    }
}
</style>
