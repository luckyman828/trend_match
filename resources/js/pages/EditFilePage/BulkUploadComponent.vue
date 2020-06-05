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
                const existingBack = product.variants.find(x => x.name.indexOf(variantName) >= 0 && x.name.indexOf('Front') >= 0)
                const existingFrontIndex = product.variants.findIndex(x => x.name.indexOf(variantName) >= 0 && x.name.indexOf('Front') >= 0)
                const existingBackIndex = product.variants.findIndex(x => x.name.indexOf(variantName) >= 0 && x.name.indexOf('Front') >= 0)
                const existingVariantIndex = product.variants.findIndex(x => x.name.indexOf(variantName) >= 0)
                const isFront = image.name.indexOf('Front') >= 0
                const isBack = image.name.indexOf('Back') >= 0
                let existingIsFront = false
                let existingIsBack = false
                let addImageTypeToName = false

                // If the variant exists add the new image before or after or replace it
                // if (existingVariant) {
                //     // Check if the existing variant is named front or back
                //     existingIsFront = existingVariant.name.indexOf('Front') >= 0
                //     existingIsBack = existingVariant.name.indexOf('Back') >= 0
                //     if (existingIsFront && isBack) {
                //         // Insert the new variant immediately after the existing
                //         product.variants.splice(existingVariantIndex + 1, 0, variantToUpdate)
                //         addNewVariant = true
                //     }
                //     else if (existingIsBack && isFront) {
                //         // Insert the new variant immediately before the existing
                //         product.variants.splice(existingVariantIndex, 0, variantToUpdate)
                //         addNewVariant = true
                //     }
                //     else {
                //         // Don't add a new variant - simply update the existing
                //         variantToUpdate = existingVariant
                //     }
                    
                // }



                if (existingFront) {
                    if (isFront) variantToUpdate = existingFront
                    if (isBack && !existingBack) {
                        // Insert the new variant immediately after the existing
                        product.variants.splice(existingFrontIndex + 1, 0, variantToUpdate)
                        addImageTypeToName = true
                    }
                }

                else if (existingBack) {
                    if (isBack) variantToUpdate = existingFront
                    if (isFront && !existingFront) {
                        // Insert the new variant immediately before the existing
                        product.variants.splice(existingBackIndex, 0, variantToUpdate)
                        addImageTypeToName = true
                    }
                }

                else if (existingVariant) {
                    variantToUpdate = existingVariant
                    addImageTypeToName = true
                }

                // If no variant excists, create it on the product
                if (!existingVariant) {
                    product.variants.push(variantToUpdate)
                    addImageTypeToName = true
                }

                // Set the variant name to indicate if it's the front or the back, if the name doesn't already indicate it
                // if (addNewVariant || !(existingIsBack || existingIsFront)) {
                if (addImageTypeToName) {
                    if (isFront) variantToUpdate.name = variantName + ' - Front'
                    if (isBack) variantToUpdate.name = variantName + ' - Back'
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
                await this.updateProduct(product)
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