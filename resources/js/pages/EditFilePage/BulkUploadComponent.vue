<template>
    <div class="bulk-upload-component">
        <h3>Bulk upload images</h3>
        <BaseDroparea :multiple="true" accept="image/*"
        @input="onFilesChange"/>
        <div class="image-list">
            <p v-for="(image, index) in imagesToUpload.slice(0,displayLimit)" :key="index">
                {{image.name}}
            </p>
            <p v-if="displayLimit < imagesToUpload.length">
                <strong>+ {{imagesToUpload.length - displayLimit}} more</strong>
            </p>
        </div>
        <button class="full-width xl primary" style="margin-top: 12px" :disabled="imagesToUpload.length <= 0 || uploadingCount > 0"
        @click="onSubmit">
            <span v-if="uploadingCount <= 0">Upload {{imagesToUpload.length > 0 ? imagesToUpload.length : ''}} image{{imagesToUpload.length != 1 ? 's' : ''}}</span>
            <BaseLoader v-else/>
        </button>
        <p v-if="uploadingCount > 0" style="text-align: center;">
            <span>Uploading images: <strong>{{uploadingCount}}</strong> of <strong>{{imagesToUpload.length}}</strong> left.</span>
        </p>
        <p v-if="updatingCount > 0" style="text-align: center;">
            <span>Updating Products: <strong>{{updatingCount}}</strong> of <strong>{{toalUpdateCount}}</strong> left.</span>
        </p>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'bulkUploadComponent',
    data() { return {
        imagesToUpload: [],
        displayLimit: 5,
        uploadingCount: 0,
        updatingCount: 0,
        toalUpdateCount: 0,
    }},
    computed: {
        ...mapGetters('products', ['products']),
        ...mapGetters('files', {
            file: 'getCurrentFile'
        }),
    },
    methods: {
        ...mapActions('products', ['updateProduct', 'uploadImage']),
        onFilesChange(fileList) {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i]
                if (!this.imagesToUpload.find(x => x.name == file.name)) {
                    this.imagesToUpload.push(file)
                }
            }
        },
        async onSubmit() {
            // Use FileReader to get the blob data of the images to upload
            const productsToUpdate = []
            let imageUploadError = false
            await Promise.all(this.imagesToUpload.map(async image => {
                this.uploadingCount++
                // Check that the image actually belongs to a variant of one of our products
                const productId = image.name.slice(0,8)

                // Find the variant name
                const dashIndex = image.name.indexOf(' - ')
                const variantName = image.name.slice(9, dashIndex >= 0 ? dashIndex : image.name.indexOf('_', 9))

                // Find the product the image belongs to
                const product = this.products.find(x => x.datasource_id == productId)
                if (!product) {
                    this.uploadingCount--
                    return
                }
                productsToUpdate.push(product)

                // Asume we are adding a new variant
                let variantToUpdate = {
                    id: this.$uuid.v4(),
                    name: variantName,
                    image: null,
                    sizes: [],
                    thumbnail: null
                }
                // Find the variant on our product
                // Check if there is a variant that contains the image variant name
                const existingVariant = product.variants.find(x => x.name.indexOf(variantName) >= 0)
                const existingFront = product.variants.find(x => x.name.indexOf(variantName) >= 0 && x.name.indexOf('Front') >= 0)
                const existingBack = product.variants.find(x => x.name.indexOf(variantName) >= 0 && x.name.indexOf('Back') >= 0)
                const existingModel = product.variants.find(x => x.name.indexOf(variantName) >= 0 && x.name.indexOf('Model') >= 0)
                const isFront = image.name.indexOf('Front') >= 0
                const isBack = image.name.indexOf('Back') >= 0
                const isModel = image.name.indexOf('Model') >= 0
                let addImageTypeToName = false

                if (existingVariant && !(existingFront || existingBack || existingModel)) {
                    variantToUpdate = existingVariant
                    addImageTypeToName = true
                }

                else {

                    if (isFront) {
                        if (existingFront) variantToUpdate = existingFront
                        else {
                            product.variants.push(variantToUpdate)
                            addImageTypeToName = true
                        }
                    }
                    if (isBack) {
                        if (existingBack) variantToUpdate = existingBack
                        else {
                            product.variants.push(variantToUpdate)
                            addImageTypeToName = true
                        }
                    }
                    if (isModel) {
                        if (existingModel) variantToUpdate = existingModel
                        else {
                            product.variants.push(variantToUpdate)
                            addImageTypeToName = true
                        }
                    }
                    
                }

                // Set the variant name to indicate if it's the front or the back, if the name doesn't already indicate it
                if (addImageTypeToName) {
                    if (isFront) variantToUpdate.name = variantName + ' - Front'
                    if (isBack) variantToUpdate.name = variantName + ' - Back'
                    if (isModel) variantToUpdate.name = variantName + ' - Model'
                }

                // Upload the image
                await this.uploadImage({ file: this.file, product, variant: variantToUpdate, image })
                this.uploadingCount--

            })).catch(err => {
                console.log('error in bulk image upload', err)
                this.imageUploadError = true
            })

            // Return early if uploading images failed
            if (imageUploadError) return
            console.log('start updating products')
            this.toalUpdateCount = productsToUpdate.length

            // Update all products --> This cannot be done earlier since we cannot be sure if we are in the process of uploading some of the images on the product
            await Promise.all(productsToUpdate.map(async product => {
                this.updatingCount++

                // Sort the products variants
                product.variants.sort((a,b) => {
                    const aIsFront = a.name.indexOf('Front') >= 0
                    const aIsBack = a.name.indexOf('Back') >= 0
                    const aIsModel = a.name.indexOf('Model') >= 0
                    const bIsFront = b.name.indexOf('Front') >= 0
                    const bIsBack = b.name.indexOf('Back') >= 0
                    const bIsModel = b.name.indexOf('Model') >= 0
                    
                    let aName
                    if (aIsFront) aName = a.name.substr(0, a.name.indexOf('Front'))
                    if (aIsBack) aName = a.name.substr(0, a.name.indexOf('Back'))
                    if (aIsModel) aName = a.name.substr(0, a.name.indexOf('Model'))

                    let bName
                    if (bIsFront) bName = b.name.substr(0, b.name.indexOf('Front'))
                    if (bIsBack) bName = b.name.substr(0, b.name.indexOf('Back'))
                    if (bIsModel) bName = b.name.substr(0, b.name.indexOf('Model'))

                    if (aName != bName) {
                        if (aName > bName) return 1
                        else return -1
                    }
                    
                    // Same variant name
                    if (aIsFront) return -1
                    if (aIsModel) return 1
                    if (aIsBack && bIsModel) return -1
                    if (aIsBack && bIsFront) return 1
                    
                })

                await this.updateProduct(product)
                this.updatingCount--
            })).catch(err => {
                console.log('error when updating products', err)
            }).then(response => {
                // Reset the component
                console.log('Success!')
                this.imagesToUpload = []
            })

            this.updatingCount = 0
            this.uploadingCount = 0
        }
    }
}
</script>

<style lang="scss" scoped>
.bulk-upload-component {
    margin-bottom: 32px;
}
</style>