<template>
    <div class="bulk-upload-component">
        <h3>Bulk upload images</h3>

        <div class="guide-lines" style="max-width: 600px; margin-bottom: 20px">
            <p>
                <strong class="primary">ATTENTION</strong><br>
                <span>Images names must start with this pattern: <i>"<strong>{PRODUCT ID}</strong>_<strong>{VARIANT NAME}</strong>"</i></span>
            </p>
            <!-- <p>
                <i>"<strong>{PRODUCT ID}</strong>_<strong>{VARIANT NAME}</strong>"</i>
            </p> -->
            <p style="margin: 16px auto;"><i><strong>Example:</strong> "12345678_Green - Pack Shot-Back-002"</i></p>
            <p><strong>Explanation:</strong> {Product ID} followed by an underscore(_), followed by the {variant name}, followed by nothing, a dash(-), or underscore(_)</p>

            <p>
                If the image name contains the word "<i>front</i>" the image will be placed first on the variant.
            </p>
        </div>

        <BaseDroparea :multiple="true" accept="image/*"
        @input="onFilesChange">
            <p>
                <span>Drag images here or click to browse</span>
            </p>
            
        </BaseDroparea>
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
                // Check that the image actually belongs to a variant of one of our products
                const productId = image.name.slice(0,8)
                if (!productId) return

                // Find the variant name
                const underscoreIndex = image.name.indexOf('_')
                const variantNameMatches = image.name.slice(underscoreIndex).match(/^_([^\.\-\_]*)/)
                const variantName = variantNameMatches.length > 1 ? variantNameMatches[1] : null

                // Check if we should place the image first
                const shouldBeFirst = image.name.toLowerCase().search('front') >= 0

                // console.log('product id', productId, ', variantName:', variantName, ', should be first', shouldBeFirst)

                // Find the product the image belongs to
                const product = this.products.find(x => x.datasource_id == productId)
                if (!product) return

                this.uploadingCount++
                productsToUpdate.push(product)

                const basePicture = {
                    name: image.name,
                    url: null,
                }

                let pictureToUpload = basePicture

                // Asume we are adding a new variant
                let variantToUpdate = {
                    id: this.$uuid.v4(),
                    name: variantName,
                    image: null,
                    images: [],
                    pictures: [basePicture],
                    sizes: [],
                    thumbnail: null
                }

                // Find the variant on our product
                // Check if there is a variant that contains the image variant name
                const existingVariant = product.variants.find(x => x.name == variantName)

                if (existingVariant) {
                    variantToUpdate = existingVariant

                    // Check for existing picture
                    const existingPicture = existingVariant.pictures.find(x => x.name == image.name)

                    if (existingPicture) {
                        if (existingPicture.name == image.name && !!existingPicture.url) return // don't reupload an existing image
                        pictureToUpload = existingPicture
                    } else {
                        if (shouldBeFirst) {
                            variantToUpdate.pictures.unshift(basePicture)
                        } else {
                            variantToUpdate.pictures.push(basePicture)
                        }
                    }

                } else {
                    product.variants.push(variantToUpdate)
                }

                // Upload the image
                await this.uploadImage({
                    file: this.file, 
                    product,
                    picture: pictureToUpload,
                    image, 
                })
                this.uploadingCount--

            })).catch(err => {
                // console.log('error in bulk image upload', err)
                this.imageUploadError = true
            })

            // Return early if uploading images failed
            if (imageUploadError) return
            // console.log('start updating products')
            this.toalUpdateCount = productsToUpdate.length

            // Update all products --> This cannot be done earlier since we cannot be sure if we are in the process of uploading some of the images on the product
            await Promise.all(productsToUpdate.map(async product => {
                this.updatingCount++

                await this.updateProduct(product)
                this.updatingCount--
            })).catch(err => {
                // console.log('error when updating products', err)
            }).then(response => {
                // Reset the component
                // console.log('Success!')
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