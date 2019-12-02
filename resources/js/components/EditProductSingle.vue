<template>
    <div class="edit-product-single" ref="editPDP">
        <div class="inner">
            <template v-if="product != null">
                <div class="header">
                    <div class="left">
                        <span class="square true-square light close clickable" @click="onCloseSingle()"><i class="fal fa-times"></i></span>
                        <h3><Editable :value="product.title" :type="'text'" v-model="product.title"/></h3>
                    </div>
                    <div class="right controls">
                        <div class="last-update" v-if="product.created_at != product.updated_at">
                            <span>Changes saved</span>
                            <span>{{product.updated_at}}</span>
                        </div>
                        <div class="hotkey-wrapper">
                            <span v-if="!updatingProduct && gettingImagesFromURL <= 0" class="button ghost icon-left" :class="{disabled: !hasChanges}" @click="onUpdateProduct"><i class="far fa-save"></i>Save</span>
                            <span v-else class="button ghost icon-left disabled"><Loader/></span>
                            <span class="hotkey"><span class="key">S</span> Save</span>
                        </div>
                        <!-- <div class="hotkey-wrapper">
                            <span class="button ghost icon-left"><i class="far fa-file-edit"></i>Edit</span>
                            <span class="hotkey"><span class="key">E</span> Edit</span>
                        </div> -->
                        <span class="circle primary clickable" @click="onPrevSingle()" :class="[{ disabled: prevProductId == null}]"><i class="fas fa-chevron-left"></i></span>
                        <span class="circle primary clickable" @click="onNextSingle()" :class="[{ disabled: nextProductId == null}]"><i class="fas fa-chevron-right"></i></span>
                    </div>
                </div>
                <div class="grid-2 grid-border-between body">
                    <div class="details">
                        <span>Variants ({{product.color_variants.length}})</span>
                        <span class="button light-2 icon-left" @click="onAddVariant"><i class="far fa-plus"></i> Add Variant</span>
                        <Draggable v-model="product.color_variants" class="product-variants">
                            
                            <div class="product-variant" v-for="(variant, index) in product.color_variants" :key="index">
                                <div class="img-wrapper" @dragenter="dragActive($event, index)" @dragleave="dragLeave" @drop="dragDrop">
                                    <div class="drop-area" :class="{drag: dragActiveIndex == index}">
                                        <!-- <input v-if="variant.image || variant.blob_id" type="file" accept="image/*" @change="filesChange($event, index, variant)" @click.prevent> -->
                                        <input type="file" :ref="'fileInput-'+index" accept="image/*" @change="filesChange($event, index, variant)">
                                        <p v-if="variant.imageToUpload != null">TESTSS</p>
                                        <p v-if="variant.imageToUpload != null && variant.imageToUpload.progress">TESsasadasdasdTSS</p>
                                        <div v-if="variant.imageToUpload != null && variant.imageToUpload.progress != null" class="progress-wrapper">
                                            <span>{{variant.imageToUpload.progress}}%</span>
                                            <svg height="4">
                                                <rect class="background" width="100%" height="4"/>
                                                <rect class="value" v-if="variant.imageToUpload.progress > 0" :width="variant.imageToUpload.progress + '%'" height="4"/>
                                            </svg>
                                        </div>
                                        <img v-if="variant.image || variant.blob_id" :src="variantImg(variant)" :class="[(variant.imageToUpload) ? 'rotation-'+variant.imageToUpload.rotation : '']">
                                        <template v-else>
                                            <div class="controls">
                                                <span class="button light-2" @click="$refs['fileInput-'+index][0].click()">Choose from file</span>
                                                <span @click="editURL(index)" class="button light-2">URL</span>
                                            </div>
                                        </template>
                                        <div v-if="URLActiveIndex == index" class="enter-url">
                                            <label :for="'url-input-'+index">Enter URL</label>
                                            <input :id="'url-input-'+index" :ref="'url-input-'+index" type="url" class="input-wrapper" 
                                            @keyup.enter="setVariantImageURL(variant, $refs['url-input-'+index][0].value); URLActiveIndex = null" @keyup.esc="URLActiveIndex = null">
                                            <div class="buttons-wrapper">
                                                <span class="button green" @click="setVariantImageURL(variant, $refs['url-input-'+index][0].value); URLActiveIndex = null">Save</span>
                                                <span class="button ghost" @click="URLActiveIndex = null">Cancel</span>
                                            </div>
                                        </div>
                                        <div class="drop-msg">
                                            <span>Drop image here</span>
                                        </div>
                                    </div>
                                    <div class="controls">
                                        <Dropdown class="dropdown-parent dark">
                                            <template v-slot:button="slotProps">
                                                <span tabindex="0" class="square true-square light-2 clickable" @click="slotProps.toggle()"
                                                @keyup.d="removeVariant(index); slotProps.toggle()" 
                                                @keyup.c="$refs['fileInput-'+index][0].click(); slotProps.toggle()"
                                                @keyup.u="editURL(index); slotProps.toggle()"
                                                @keyup.r="$refs['nameInput-'+index][0].$el.click(); slotProps.toggle()">
                                                    <i class="fas fa-ellipsis-h"></i>
                                                </span>
                                            </template>
                                            <template v-slot:header="slotProps">
                                                <div class="header">
                                                    <span>Edit Variant</span>
                                                    <span class="circle small dark clickable" @click="slotProps.toggle()"><i class="far fa-times"></i></span>
                                                </div>
                                            </template>
                                            <template v-slot:body="slotProps">
                                                <div class="hotkeys">
                                                    <div class="hotkey">
                                                        <span class="button white" @click="$refs['fileInput-'+index][0].click(); slotProps.toggle()">Choose file</span><span class="square true-square white">C</span>
                                                    </div>
                                                    <div class="hotkey">
                                                        <span class="button white" @click="editURL(index); slotProps.toggle()">URL</span><span class="square true-square white">U</span>
                                                    </div>
                                                    <div class="hotkey">
                                                        <span class="button white" @click="$refs['nameInput-'+index][0].$el.click(); slotProps.toggle()">Rename</span><span class="square true-square white">R</span>
                                                    </div>
                                                    <div class="hotkey">
                                                        <span class="button red" @click="removeVariant(index); slotProps.toggle()">Delete</span><span class="square true-square red">D</span>
                                                    </div>
                                                </div>
                                            </template>
                                        </Dropdown>
                                    </div>
                                </div>
                                <Editable :ref="'nameInput-'+index" :placeholder="'Untitled variant'" :value="variant.color" :type="'text'" v-model="variant.color"/>
                            </div>
                        </Draggable>
                        <label for="datasource-id">Product ID</label>
                        <EditInputWrapper id="datasource-id" :type="'text'" :maxlength="9" :pattern="'[0-9]'"
                        :value="product.datasource_id" :oldValue="originalProduct.datasource_id" v-model="product.datasource_id"/>
                        <!-- <template v-if="product.datasource_id">
                            <label>Product ID</label>
                            <span v-tooltip.top="'Not editable'" class="input-wrapper read-only">{{product.datasource_id}}</span>
                        </template>
                        <template v-else>
                            <label for="datasource-id">Product ID</label>
                            <EditInputWrapper id="datasource-id" :type="'number'" 
                            :value="product.datasource_id" :oldValue="originalProduct.datasource_id" v-model="product.datasource_id"/>
                        </template> -->
                        <!-- <label>Product ID</label>
                        <span v-tooltip.top="'Not editable'" class="input-wrapper read-only">{{product.datasource_id}}</span> -->
                        <label for="category">Category</label>
                        <!-- <span v-tooltip.top="'Not editable'" class="input-wrapper read-only">{{product.category}}</span> -->
                        <EditInputWrapper id="category" :type="'text'" 
                        :value="product.category" :oldValue="originalProduct.category" v-model="product.category"/>
                        <label for="composition">Composition</label>
                        <!-- <span v-tooltip.top="'Not editable'" class="input-wrapper read-only composition multiline">{{product.composition.split(',').join(',\n')}}</span> -->
                        <EditInputWrapper id="composition" :type="'text'" 
                        :value="product.composition" :oldValue="originalProduct.composition" v-model="product.composition"/>
                    </div>
                    <div class="border"></div>
                    <div class="details">
                        <div class="currencies">
                            <label for="currencySelector">Currencies</label>
                            <select name="currencySelector" class="input-wrapper" v-model="currencyIndex">
                                <option v-for="(currency, index) in product.prices" :key="index" :value="index">{{currency.currency}}</option>
                            </select>
                            <label for="wholesale">WHS ({{currentCurrency.currency}})</label>
                            <EditInputWrapper :id="'recommended-retail'" :type="'number'" 
                            :value="currentCurrency.wholesale_price" 
                            :oldValue="originalProduct.prices[currencyIndex].wholesale_price" 
                            v-model.number="currentCurrency.wholesale_price" @submit="savedMarkup = currentCurrency.markup"
                            @change="calculateMarkup($event, 'wholesale_price')" @cancel="resetMarkup" @revert="revertMarkup"/>
                            <label for="recommended-retail">RPP ({{currentCurrency.currency}})</label>
                            <EditInputWrapper :id="'recommended-retail'" :type="'number'" 
                            :value="currentCurrency.recommended_retail_price" 
                            :oldValue="originalProduct.prices[currencyIndex].recommended_retail_price" 
                            v-model.number="currentCurrency.recommended_retail_price" @submit="savedMarkup = currentCurrency.markup"
                            @change="calculateMarkup($event, 'recommended_retail_price')" @cancel="resetMarkup" @revert="revertMarkup"/>
                            <label>Mark Up</label>
                            <span v-tooltip.top="'Not editable'" class="input-wrapper read-only">{{currentCurrency.markup}}</span>
                        </div>
                        <div>
                            <label for="min-order">Min. Order</label>
                            <EditInputWrapper :id="'min-order'" :type="'number'" 
                            :value="product.quantity" :oldValue="originalProduct.quantity" v-model.number="product.quantity"/>
                            <label for="delivery">Delivery</label>
                            <EditInputWrapper ref="deliveryInput" :id="'delivery'" :type="'text'" 
                            :value="product.delivery_date" :oldValue="originalProduct.delivery_date" v-model="product.delivery_date"
                            @submit="formatDelivery"/>
                            <label for="description">Description</label>
                            <EditInputWrapper id="description" :type="'text'" 
                            :value="product.sale_description" :oldValue="originalProduct.sale_description" v-model="product.sale_description"/>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Dropdown from './Dropdown'
import TooltipAlt2 from './TooltipAlt2'
import EditInputWrapper from './EditInputWrapper'
import Editable from './Editable'
import Product from './../store/models/Product'
import Draggable from 'vuedraggable'

export default {
    name: 'editProductSingle',
    props: [
        'authUser',
        'sticky',
        'visible',
        'loading',
    ],
    components: {
        Dropdown,
        TooltipAlt2,
        EditInputWrapper,
        Editable,
        Draggable
    },
    data: function () { return {
        currencyIndex: 0,
        productToEdit: null,
        savedMarkup: null,
        editingTitle: false,
        updatingProduct: false,
        dragActiveIndex: null,
        dragCounter: 0,
        URLActiveIndex: null,
        gettingImagesFromURL: 0,
    }},
    watch: {
        currentProductv1(newVal, oldVal) {
            // This function fires when a change happens to the current product in the store. It also fires initially
            // This can mean: A new product is shown. The product in the store has been updated
            this.productToEdit = JSON.parse(JSON.stringify(newVal))
            this.productToEdit.delivery_date = new Date(this.productToEdit.delivery_date).toLocaleDateString("en-GB", {month: "long",year: "numeric"})
            // Reset the value of all file input fields
            this.$nextTick(() => {
                this.$refs.editPDP.querySelectorAll('input[type=file]').forEach(input => {
                    input.value = null
                })
            })

            // Create an empty variant if no variants are present
            const variants = this.productToEdit.color_variants
            if (variants.length <= 0) {
                this.onAddVariant()
            }

        }
    },
    computed: {
        ...mapGetters('persist', ['userPermissionLevel']),
        ...mapGetters('entities/products', ['currentProductv1', 'nextProductId', 'prevProductId']),
        product () {
            return this.productToEdit
        },
        originalProduct () {
            const product = this.currentProductv1
            product.delivery_date = new Date(product.delivery_date).toLocaleDateString("en-GB", {month: "long",year: "numeric"})
            return product
        },
        saveActive() {
            return !this.updatingProduct && this.gettingImagesFromURL <= 0 && this.hasChanges
        },
        currentCurrency () {
            return this.productToEdit 
            ? this.product.prices[this.currencyIndex] 
            : {
                currency: null,
                markup: null,
                recommended_retail_price: null,
                wholesale_price: null
            }
        },
        hasChanges() {
            const newProduct = this.productToEdit
            const oldProduct = this.currentProductv1
            return JSON.stringify(newProduct) != JSON.stringify(oldProduct)
        },
        filesToDelete() {
            const newProduct = this.productToEdit
            const oldProduct = this.currentProductv1
            let filesToDelete = []
            // Loop through the variants on the old product
            oldProduct.color_variants.forEach(variant => {
                // First check if the current variant has a blob id
                if (variant.blob_id != null) {
                    // See if we can find the blob_id on the new product.
                    const exists = newProduct.color_variants.find(x => x.blob_id == variant.blob_id)
                    // If we cannot find the blob_ib on the new product, it must mean that the blob is no longer used.
                    // We can therefore delete it
                    if (!exists) {
                        filesToDelete.push(variant.blob_id)
                    }
                }
            })
            return filesToDelete
        },
        imagesToUpload() {
            // Check if we have any files (images) we need to upload
            const variants = this.productToEdit.color_variants
            let imagesToUpload = []
            variants.forEach(variant => {
                if (variant.imageToUpload) {
                    imagesToUpload.push(variant.imageToUpload)
                }
            })
            return imagesToUpload
        },
    },
    methods: {
        ...mapActions('entities/products', ['showNextProduct', 'showPrevProduct', 'updateProduct', 'uploadImages', 'deleteImages', 'rotateImage']),
        variantImg (variant) {
            if (variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        onCloseSingle() {
            // Emit event to parent
            this.$emit('closeSingle')
        },
        onNextSingle() {
            if (this.nextProductId != null) {
                this.$emit('nextProduct')
                this.showNextProduct()
            }
        },
        onPrevSingle() {
            if (this.prevProductId != null) {
                this.$emit('prevProduct')
                this.showPrevProduct()
            }
        },
        onAddVariant() {
            this.product.color_variants.push({
                color: null,
                image: null,
                blob_id: null,
                sizes: null,
            })
        },
        removeVariant(index) {
            // Remove the variant from the product
            const variants = this.productToEdit.color_variants
            variants.splice(index, 1)

            if (variants.length <= 0) {
                // Add a blank variant if the last one is deleted
                this.onAddVariant()
            }
        },
        async onUpdateProduct() {
            // Prepare the file to fit the database schema
            const vm = this
            this.updatingProduct = true
            const productToUpload = JSON.parse(JSON.stringify(this.productToEdit))

            // Check if we have any files (images) we need to upload
            const variants = productToUpload.color_variants
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i]
                const editVariant = this.productToEdit.color_variants[i]
                if (variant.imageToUpload) {
                    vm.$set(editVariant.imageToUpload, 'progress', 0)
                }
            }
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i]
                const editVariant = this.productToEdit.color_variants[i]
                if (variant.imageToUpload) {
                    // Use the edit variant instead of the copy to make sure we get the correct blob data and can update the UI while we upload
                    await this.uploadImages({files: [editVariant.imageToUpload], callback: function(uploadProgress) {
                    
                    if (uploadProgress == 100) {
                        vm.$set(editVariant.imageToUpload, 'progress', 99)
                    } else {
                        vm.$set(editVariant.imageToUpload, 'progress', uploadProgress)
                    }
                    // editVariant.imageToUpload.progress = uploadProgress
                    } })
                    .then(success => {
                        // When done trying to upload the image
                        if (success) {
                            variant.blob_id = variant.imageToUpload.id
                            delete variant.imageToUpload
                            variant.image = null
                        }
                    })

                }
            }

            // Check if we have any files (images) we need to delete
            const filesToDelete = this.filesToDelete
            if (filesToDelete.length > 0) {
                // Attempt to delete the images
                this.deleteImages(filesToDelete)
            }

            // Change the delivery_date format back to MySQL Date format (yyyy-mm-dd)
            // Since we are only using months add + ' 3' -> set the date to the 3rd to avoid the month changing when we slice due to timezone differences.
            productToUpload.delivery_date = new Date (productToUpload.delivery_date + ' 3').toJSON().slice(0,10)

            await this.updateProduct(productToUpload)
            .then(success => {
                this.updatingProduct = false
            })
        },
        calculateMarkup(newValue, price) {
            const el = this.currentCurrency
            const decimals = 2
            if (price == 'wholesale_price')
                el.markup = Number(Math.round((el.recommended_retail_price / newValue) + 'e' + decimals)+ 'e-' + decimals)
            else 
                el.markup = Number(Math.round((newValue / el.wholesale_price) + 'e' + decimals)+ 'e-' + decimals)
                
        },
        resetMarkup() {
            if (this.savedMarkup)
                this.currentCurrency.markup = this.savedMarkup
            else {
                this.currentCurrency.markup = this.originalProduct.prices[this.currencyIndex].markup
            }
        },
        revertMarkup() {
            const el = this.currentCurrency
            const decimals = 2
            el.markup = Number(Math.round((el.recommended_retail_price / el.wholesale_price) + 'e' + decimals)+ 'e-' + decimals)
        },
        hotkeyHandler(event) {
            const key = event.code

            // Only do these if the current target is not the comment box
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT' && this.visible) {

                if (key == 'Escape')
                    this.onCloseSingle()
                if (key == 'ArrowRight')
                    this.onNextSingle()
                if (key == 'ArrowLeft')
                    this.onPrevSingle()
                if (key == 'KeyS' && this.saveActive)
                    this.onUpdateProduct()
            }
        },
        formatDelivery(e) {
            let product = this.product
            let date = this.product.delivery_date
            let newDate = new Date(date).toLocaleDateString("en-GB", {month: "long",year: "numeric"})
            product.delivery_date = newDate
        },
        dragActive(e, index) {
            // e.target.querySelector('.drop-area').classList.add('drag')
            this.dragActiveIndex = index
            this.dragCounter++
        },
        dragLeave(e) {
            this.dragCounter--
            if (this.dragCounter == 0) {
                this.dragActiveIndex = null
            }
            // e.target.querySelector('.drop-area').classList.remove('drag')
        },
        dragDrop() {
            this.dragActiveIndex = null
            this.dragCounter = 0
        },
        async filesChange(e, index, variant) {
            const vm = this
            const file = e.target.files[0]
            // Check that the file is an image
            if (file && file['type'].split('/')[0] === 'image') {
                // Generate UUID for the new image
                const newUUID = this.$uuid.v4()

                // Get the orientation of the image to correct for photos taken with an iPhone
                await this.getOrientation(file, imgRotation => {
                        // save the image to upload to the variant with its rotation data,
                        vm.$set(variant, 'imageToUpload', {file: file, id: newUUID, rotation: imgRotation})
                        // variant.imageToUpload = {file: file, id: newUUID, rotation: imgRotation}
                })

                // Process the uploaded image
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = (e) => {
                    // Show the new image on the variant
                    const newImage = e.target.result
                    variant.image = newImage
                    // Set the blob_id to null, to we know to show the new image instead.
                    // The blob_id will be set again if we upload the image
                    variant.blob_id = null
                }
            } else {
                // Throw error
                console.log('invalid file extension')
            }
        },
        getOrientation(file, callback) {
            var reader = new FileReader();

            reader.onload = function(event) {
                var view = new DataView(event.target.result);

                if (view.getUint16(0, false) != 0xFFD8) return callback(-2);

                var length = view.byteLength,
                    offset = 2;

                while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;

                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) {
                    return callback(-1);
                    }
                    var little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;

                    for (var i = 0; i < tags; i++)
                    if (view.getUint16(offset + (i * 12), little) == 0x0112)
                        return callback(view.getUint16(offset + (i * 12) + 8, little));
                }
                else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
                }
                return callback(-1);
            };

            reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
        },
        editURL(index) {
            this.URLActiveIndex = index
            this.$nextTick(() => {
                this.$refs['url-input-'+index][0].focus()
            })
        },
        async getImageFromURL(variant) {
            if (variant.image) {
                // Add to a counter of images we are currently processing
                const vm = this
                vm.gettingImagesFromURL++
                // Generate a new uuid for the image
                const newUUID = this.$uuid.v4()
                // Send a request to get the image
                var request = new XMLHttpRequest();
                await (
                    request.open('GET', variant.image, true),
                    request.responseType = 'blob',
                    request.onload = function() {
                        variant.imageToUpload = {file: request.response, id: newUUID}
                        // decrement the images in process counter
                        vm.gettingImagesFromURL--
                    },
                    request.send()
                )
            }
        },
        setVariantImageURL(variant, imageURL) {
            variant.image = imageURL
            variant.blob_id = null
            // if (variant.imageToUpload)
            //     delete variant.imageToUpload
            this.getImageFromURL(variant)
        },
    },
    created() {
        document.body.addEventListener('keydown', this.hotkeyHandler)
        // Save an initial reference to the product we are going to edit
        if (this.currentProductv1) {
            this.productToEdit = JSON.parse(JSON.stringify(this.currentProductv1))
        }
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .edit-product-single {
        height: 100%;
        > .inner {
            height: 100%;
            width: 100%;
            background: $light;
            display: flex;
            flex-direction: column;
            > .header {
                display: flex;
                border-bottom: solid 2px $light1;
                padding: 6px 20px;
                position: sticky;
                top: 0;
                z-index: 2;
                background: white;
                height: 72px;
                align-items: center;
                h3 {
                    width: 100%;
                }
                > * {
                    flex: 1;
                    display: flex;
                    align-items: center;
                }
                .close {
                    margin-right: 24px;
                }
                .controls {
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                    align-items: flex-start;
                    > *:not(:last-child) {
                        margin-right: 12px;
                    }
                }
            }
            .body {
                padding: 24px;
                height: 50%;
                flex: 1;
                display: grid;
                grid-template-rows: 100%;
            }
        }  
        .details {
            overflow-x: hidden;
            overflow-y: auto;
        }
    }
    h3 {
        font-size: 16px;
        font-weight: 400;
    }
    .close i {
        font-size: 22px;
    }
    .card > .grid-2 {
        > :first-child {
            overflow-x: hidden;
            overflow-y: auto;
            height: 100%;
        }
    }
    .grid-2.grid-border-between {
        grid-template-columns: 1fr 2px 1fr;
        grid-gap: 17px;
        > :nth-child(2) {
            background: $light2;
        }
    }
    .product-variants {
        margin-top: 12px;
        white-space: nowrap;
        overflow-x: auto;
        margin-bottom: 40px;
    }
    .product-variant {
        width: 180px;
        display: inline-block;
        &:not(:last-child) {
            margin-right: 12px;
        }
        .img-wrapper {
            padding-top: 133.33%; // 4:3 
            width: 100%;
            height: 0;
            position: relative;
            overflow: hidden;
            display: inline-block;
            border-radius: 2px;
            border: solid 1px $light2;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                object-position: center;
                position: absolute;
                top: 0;
                left: 0;
                //Check for rotation
                &.rotation-6 {
                    // -90 degree rotation
                    transform: rotate(90deg) translateY(-100%);
                    transform-origin: top left;
                    width: 242px;
                    height: 180px;
                }
            }
            .drop-area {
                input[type=file] {
                    pointer-events: none;
                }
                position: absolute;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                cursor: auto;
                .enter-url {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    background: #f3f3f3;
                    padding: 10px;
                    .buttons-wrapper {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        > * {
                            width: calc(50% - 4px);
                            margin-top: 8px;
                            min-width: 0;
                        }
                    }
                }
                .drop-msg {
                    z-index: 1;
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    justify-content: center;
                    align-items: center;
                    display: none;
                    outline: 2px dashed #dfdfdf;
                    outline-offset: -10px;
                    background: white;
                    padding: 12px 12px;
                    background: $light1;
                }
                &.drag {
                    .drop-msg {
                        display: flex;
                        pointer-events: none;
                    }
                    .controls {
                        pointer-events: none;
                    }
                    input[type=file] {
                        z-index: 2;
                        pointer-events: all
                    }
                }
                .controls {
                    display: flex;
                    flex-direction: column;
                    // position: relative;
                    // z-index: 1;
                    > *:not(:last-child) {
                        margin-bottom: 8px;
                    }
                    .button {
                        width: 124px;
                    }
                }
            }
            > .controls {
                position: absolute;
                z-index: 2;
                right: 4px;
                top: 4px;
                opacity: 0;
                transition: .3s;
            }
            &:hover .controls {
                opacity: 1;
            }
        }
        .color-wrapper {
            overflow: hidden;
            margin-right: 5px;
            span {
                font-size: 10px;
                font-weight: 500;
                color: $dark2;
            }
            .circle-img {
                width: 12px;
                height: 12px;
                border-radius: 6px;
                border: solid 1px $light1;
                position: relative;
                overflow: hidden;
                display: inline-block;
                img {
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    position: absolute;
                }
            }
        }
    }
    .input-wrapper.composition {
        white-space: pre-line;
    }
    .last-update {
        display: flex;
        flex-direction: column;
        font-size: 11px;
        font-weight: 500;
        text-align: right;
    }
    .details {
        .currencies {
            margin-bottom: 32px;
        }
    }
    .dropdown {
        .header {
            color: white;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            padding: 0 0 0 4px;
        }
        .hotkeys {
            padding: 8px;
            display: flex;
            flex-direction: column;
            .hotkey {
                &:not(:last-child) {
                    margin-bottom: 8px;
                }
                > :first-child {
                    margin-right: 6px;
                    width: 86px;
                }
            }
        }
    }
    .progress-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba($dark, .5);
        z-index: 3;
        flex-direction: column;
        color: white;
        padding: 20px;
        svg {
            width: 100%;
            rect {
                &.value {
                    transition: .3s;
                    fill: $primary;
                }
                &.background {
                    fill: $light2;
                }
            }
        }
    }
</style>
