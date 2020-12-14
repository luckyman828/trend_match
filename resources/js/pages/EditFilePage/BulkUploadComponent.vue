<template>
    <div class="bulk-upload-component form-wrapper">
        <h3 class="form-element">Bulk upload images</h3>

        <div class="guide-lines form-element" style="max-width: 600px;">
            <p>
                <strong class="primary">ATTENTION</strong><br />
                <span
                    >Images names must start with this pattern:
                    <i>"<strong>{PRODUCT ID}</strong>_<strong>{COLOR NAME} - {VARIANT NAME}</strong>"</i></span
                >
            </p>
            <!-- <p>
                <i>"<strong>{PRODUCT ID}</strong>_<strong>{VARIANT NAME}</strong>"</i>
            </p> -->
            <p style="margin: 16px auto;">
                <i><strong>Example:</strong> "12345678_Green - detailMelange - Pack Shot-Back-002"</i>
            </p>
            <p>
                <strong>Explanation:</strong> {Product ID} followed by an underscore(_), followed by the {color name},
                followed by nothing or a dash followed by the {variant name}, followed by nothing or underscore(_)
            </p>

            <p>
                If the image name contains the word "<i>front</i>" the image will be placed first on the variant.
            </p>
        </div>

        <BaseDroparea :multiple="true" accept="image/*" @input="onFilesChange" class="form-element">
            <p>
                <span>Drag images here or click to browse</span>
            </p>
        </BaseDroparea>
        <div class="image-list form-element">
            <p v-for="(image, index) in imagesToUpload.slice(0, displayLimit)" :key="index">
                {{ image.name }}
            </p>
            <p v-if="displayLimit < imagesToUpload.length">
                <strong>+ {{ imagesToUpload.length - displayLimit }} more</strong>
            </p>
        </div>
        <BaseCheckboxInputField v-model="createVariants" class="form-element">
            <span>Create missing variants</span>
        </BaseCheckboxInputField>
        <button
            class="full-width xl primary form-element"
            style="margin-top: 12px"
            :disabled="imagesToUpload.length <= 0 || uploadingCount > 0"
            @click="onSubmit"
        >
            <span v-if="uploadingCount <= 0"
                >Upload {{ imagesToUpload.length > 0 ? imagesToUpload.length : '' }} image{{
                    imagesToUpload.length != 1 ? 's' : ''
                }}</span
            >
            <BaseLoader v-else />
        </button>
        <p v-if="uploadingCount > 0" style="text-align: center;">
            <span
                >Uploading images: <strong>{{ uploadingCount }}</strong> of
                <strong>{{ imageMatches.length }}</strong> left.</span
            >
        </p>
        <p v-if="updatingCount > 0" style="text-align: center;">
            <span
                >Updating Products: <strong>{{ updatingCount }}</strong> of
                <strong>{{ toalUpdateCount }}</strong> left.</span
            >
        </p>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    name: 'bulkUploadComponent',
    data() {
        return {
            imagesToUpload: [],
            displayLimit: 5,
            uploadingCount: 0,
            updatingCount: 0,
            toalUpdateCount: 0,
            imageMatches: [],
            createVariants: false,
        }
    },
    computed: {
        ...mapGetters('products', ['products']),
        ...mapGetters('files', {
            file: 'getCurrentFile',
        }),
    },
    methods: {
        ...mapActions('products', ['updateManyProducts', 'uploadImage']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
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

            // First, find images that match a variant --> Our, imageMatches
            this.imagesToUpload.map(image => {
                // Check that the image actually belongs to a variant of one of our products
                const productId = image.name.slice(0, 8)
                if (!productId) return

                // Find the variant name
                const underscoreIndex = image.name.indexOf('_')
                // const variantNameMatches = image.name.slice(underscoreIndex).match(/^_([^\.\-\_]*)/)
                // const variantNameMatches = image.name.slice(underscoreIndex).match(/^_([^_]*)/)
                const variantNameMatches = image.name.slice(underscoreIndex).match(/^_([^\.\-\_]*)-?([^\.\-\_]*)/)

                const colorName = variantNameMatches[1].trim()
                const variantName = variantNameMatches[2].trim()

                // Check if we should place the image first
                const shouldBeFirst = image.name.toLowerCase().search('front') >= 0

                // console.log('product id', productId, ', variantName:', variantName, ', should be first', shouldBeFirst)

                // Find the product the image belongs to
                const product = this.products.find(x => x.datasource_id == productId)
                if (!product) return

                const basePicture = {
                    name: image.name,
                    url: null,
                }

                let pictureToUpload = basePicture

                // Asume we are adding a new variant
                let variantToUpdate = {
                    id: this.$uuid.v4(),
                    name: this.generateVariantName({ colorName, variantName }),
                    color: colorName,
                    variant: variantName,
                    image: null,
                    images: [],
                    pictures: [basePicture],
                    sizes: [],
                    thumbnail: null,
                    ean_sizes: [],
                }
                // Find the variant on our product
                // Check if there is a variant that contains the image variant name
                const existingVariant = product.variants.find(x => {
                    return (
                        !!x.name &&
                        (x.name
                            .trim()
                            .toLowerCase()
                            .search(colorName.trim().toLowerCase()) >= 0 ||
                            colorName
                                .trim()
                                .toLowerCase()
                                .search(x.name.trim().toLowerCase()) >= 0)
                    )
                })
                const emptyVariant = product.variants.find(x => !x.color && !x.variant)
                if (emptyVariant && this.createVariants && !existingVariant) {
                    Object.assign(emptyVariant, variantToUpdate)
                }

                if (existingVariant || (emptyVariant && this.createVariants)) {
                    variantToUpdate = existingVariant ? existingVariant : emptyVariant

                    // Check for existing picture
                    const existingPicture = variantToUpdate.pictures.find(x => !!x.name && x.name == image.name)
                    const emptyPicture = variantToUpdate.pictures.find(x => !x.name && !x.url)
                    if (emptyPicture && !existingPicture) {
                        Object.assign(emptyPicture, basePicture)
                    }

                    if (existingPicture || emptyPicture) {
                        if (existingPicture) {
                            if (existingPicture.name == image.name && !!existingPicture.url) return // don't reupload an existing image
                            pictureToUpload = existingPicture
                        } else {
                            pictureToUpload = emptyPicture
                        }
                    } else {
                        if (shouldBeFirst) {
                            variantToUpdate.pictures.unshift(basePicture)
                        } else {
                            variantToUpdate.pictures.push(basePicture)
                        }
                    }
                } else if (this.createVariants) {
                    product.variants.push(variantToUpdate)
                }

                // Increment the match count
                this.imageMatches.push({ product, image, picture: pictureToUpload })
                this.uploadingCount++
                productsToUpdate.push(product)
            })

            // Chunk the images to upload to avoid overloading the API -- which can happen...
            const imageMatchChunks = this.chunkArray(this.imageMatches, 64)
            // imageMatchChunks.map(async imageMatches => {
            for (const imageMatches of imageMatchChunks) {
                await Promise.all(
                    imageMatches.map(async ({ product, image, picture }) => {
                        // Upload the image
                        await this.uploadImage({
                            file: this.file,
                            product,
                            picture,
                            image,
                        })
                        this.uploadingCount--
                    })
                ).catch(err => {
                    console.log('error in bulk image upload', err)
                    this.imageUploadError = true
                })
            }

            // Return early if uploading images failed
            if (imageUploadError) return
            // console.log('start updating products')
            this.toalUpdateCount = productsToUpdate.length

            // Update all products --> This cannot be done earlier since we cannot be sure if we are in the process of uploading some of the images on the product
            this.updatingCount = productsToUpdate.length
            if (productsToUpdate.length > 0) {
                await this.updateManyProducts({ file: this.file, products: productsToUpdate })
            } else {
                this.SHOW_SNACKBAR({
                    msg: 'No matches found',
                    iconClass: 'far fa-info-circle',
                    type: 'info',
                })
            }

            this.imagesToUpload = []
            this.updatingCount = 0
            this.uploadingCount = 0
            this.imagesMatches = []
        },
    },
}
</script>

<style lang="scss" scoped>
.bulk-upload-component {
    margin-bottom: 32px;
}
</style>
