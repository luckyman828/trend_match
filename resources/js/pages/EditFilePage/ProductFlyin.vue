<template>
    <BaseFlyin class="edit-product-single" :show="show" @close="onCloseSingle" :columns=2>
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="product.title" :next="nextProduct" :prev="prevProduct"
            @close="onCloseSingle" @next="showNextProduct" @prev="showPrevProduct">
                <div class="item-group">
                    <div class="last-update" v-if="product.created_at != product.updated_at">
                        <span>Changes saved</span>
                        <span>{{product.updated_at}}</span>
                    </div>
                    <div class="hotkey-wrapper" v-tooltip="{content: !productToEdit.datasource_id && 'Product must have an ID'}">
                        <!-- <h3><BaseEditable :value="product.title" :type="'text'" v-model="product.title"/></h3> -->
                        <button v-if="!updatingProduct && gettingImagesFromURL <= 0" class="ghost" :class="{disabled: !saveActive}"
                        @click="saveActive && onUpdateProduct()"><i class="far fa-save">
                            </i><span>Save</span>
                        </button>
                        <button v-else class="ghost disabled">
                            <BaseLoader/>
                        </button>
                        <span class="hotkey"><span class="key">S</span> Save</span>
                    </div>
                </div>
            </BaseFlyinHeader>
        </template>
        <template v-slot v-if="show">
            <BaseFlyinColumn>
                <span style="margin-right: 8px;">Variants ({{product.variants.length}})</span>
                <button class="invisible ghost-hover" @click="onAddVariant"><i class="far fa-plus"></i><span>Add Variant</span></button>
                <Draggable v-model="product.variants" class="product-variants">
                    
                    <div class="product-variant" v-for="(variant, index) in product.variants" :key="index"
                    @contextmenu.prevent="showVariantContext($event, index)" :class="{'has-img': !!variant.image}">
                        <div class="img-wrapper" @dragenter="dragActive($event, index)" @dragleave="dragLeave" @drop="dragDrop">
                            <div class="drop-area" :class="{drag: dragActiveIndex == index}">
                                <!-- <input v-if="variant.image || variant.blob_id" type="file" accept="image/*" @change="filesChange($event, index, variant)" @click.prevent> -->
                                <input type="file" :ref="'fileInput-'+index" accept="image/*" @change="filesChange($event, index, variant)">
                                <div v-if="variant.imageToUpload && variant.imageToUpload.uploading" class="progress-wrapper">
                                    <span v-if="variant.imageToUpload.progress > 0">{{variant.imageToUpload.progress}}%</span>
                                    <span v-else>Preparing upload..</span>
                                    <svg height="4">
                                        <rect class="background" width="100%" height="4"/>
                                        <rect class="value" v-if="variant.imageToUpload.progress > 0" :width="variant.imageToUpload.progress + '%'" height="4"/>
                                    </svg>
                                </div>
                                <img v-if="variant.image || variant.blob_id" :src="variantImg(variant)" :class="[(variant.imageToUpload) ? 'rotation-'+variant.imageToUpload.rotation : '']">
                                <template v-else>
                                    <div class="controls">
                                        <span class="button light-2" @click="$refs['fileInput-'+index][0].click()">Choose from file</span>
                                        <span @click="editURL(index)" class="button light-2">Enter image URL</span>
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
                                <button @click="showVariantContext($event, index)">
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>
                        <BaseEditable :ref="'nameInput-'+index" :placeholder="'Untitled variant'" :value="variant.name" :type="'text'" v-model="variant.name"/>
                    </div>
                </Draggable>

                <h3>Details</h3>
                <div class="form-element">
                    <label for="product-name">Product name</label>
                    <BaseEditInputWrapper id="product-name" :type="'text'"
                    :value="product.title" :oldValue="originalProduct.title" v-model="product.title"/>
                </div>
                <div class="col-2">
                    <div class="form-element">
                        <label for="datasource-id">Product ID</label>
                        <BaseEditInputWrapper id="datasource-id" :type="'text'" :maxlength="9" :pattern="'[0-9]'" :disabled="!!originalProduct.datasource_id"
                        :value="product.datasource_id" :oldValue="originalProduct.datasource_id" v-model="product.datasource_id"/>
                    </div>
                    <div class="form-element">
                        <label for="delivery">Delivery</label>
                        <BaseDatePicker ref="product.delivery_date" :id="'delivery'" :type="'month'" :format="'MMMM YYYY'"
                        :oldValue="originalProduct.delivery_date" v-model="product.delivery_date"/>
                    </div>
                </div>
                <div class="form-element">
                    <label for="category">Category</label>
                    <BaseEditInputWrapper id="category" :type="'text'" 
                    :value="product.category" :oldValue="originalProduct.category" v-model="product.category"/>
                </div>
                <div class="form-element">
                    <label for="buying-group">Buyer Group</label>
                    <BaseEditInputWrapper id="buying-group" :type="'text'" 
                    :value="product.buyer_group" :oldValue="originalProduct.buyer_group" v-model="product.buyer_group"/>
                </div>
                <div class="form-element">
                    <label for="composition">Composition</label>
                    <BaseEditInputWrapper id="composition" :type="'text'" 
                    :value="product.composition" :oldValue="originalProduct.composition" v-model="product.composition"/>
                </div>
                <div class="form-element">
                    <label for="description">Description</label>
                    <BaseEditableTextarea id="description"
                    :oldValue="originalProduct.sale_description" v-model="product.sale_description"/>
                </div>
            </BaseFlyinColumn>

            <BaseFlyinColumn>
                <h3>Currency</h3>
                <div class="form-element">
                    <label for="currencySelector">Select Currency</label>
                    <BaseInputField :id="'currencySelector'" disabled=true :value="product.prices[currencyIndex].currency" type="select" 
                    @click="showCurrencyContext"/>
                </div>
                <div class="form-element">
                    <button class="ghost" @click="addCurrency">
                        <i class="far fa-plus"></i><span>Add currency</span>
                    </button>
                    <button class="ghost" @click="removeCurrency" v-if="product.prices.length > 1">
                        <i class="far fa-trash-alt"></i><span>Remove currency</span>
                    </button>
                </div>
                <div class="form-element">
                    <label for="currencyName">Currency name</label>
                    <BaseEditInputWrapper ref="currencyName" :id="'currencyName'" :type="'text'" 
                    :oldValue="originalProduct.prices[currencyIndex] ? originalProduct.prices[currencyIndex].currency : null" 
                    v-model="currentCurrency.currency"/>
                </div>

                <div class="col-3">
                    <div class="form-element">
                        <label for="wholesale">WHS ({{currentCurrency.currency}})</label>
                        <BaseEditInputWrapper :id="'recommended-retail'" :type="'number'" 
                        :oldValue="originalProduct.prices[currencyIndex] ? originalProduct.prices[currencyIndex].wholesale_price : null" 
                        v-model.number="currentCurrency.wholesale_price" @submit="calculateMarkup({whs: $event}); savedMarkup = currentCurrency.mark_up"
                        @change="calculateMarkup({whs: $event})" @cancel="resetMarkup" @revert="revertMarkup"/>
                    </div>
                    <div class="form-element">
                        <label for="recommended-retail">RPP ({{currentCurrency.currency}})</label>
                        <BaseEditInputWrapper :id="'recommended-retail'" :type="'number'" 
                        :oldValue="originalProduct.prices[currencyIndex] ? originalProduct.prices[currencyIndex].recommended_retail_price : null" 
                        v-model.number="currentCurrency.recommended_retail_price" @submit="calculateMarkup({rrp: $event}); savedMarkup = currentCurrency.mark_up"
                        @change="calculateMarkup({rrp: $event})" @cancel="resetMarkup" @revert="revertMarkup"/>
                    </div>
                    <div class="form-element">
                        <label>Mark Up</label>
                        <span v-tooltip.top="'Not editable'" class="input-wrapper read-only">{{currentCurrency.mark_up}}</span>
                    </div>
                </div>

                <h3>Minimum</h3>
                <div class="col-2 delivery">
                    <div class="form-element">
                        <label for="min-order">Order minimum (pcs)</label>
                        <BaseEditInputWrapper :id="'min-order'" :type="'number'" 
                        :oldValue="originalProduct.min_order" v-model.number="product.min_order"/>
                    </div>
                    <div class="form-element">
                        <label for="min-order">Variant minimum (pcs)</label>
                        <BaseEditInputWrapper :id="'min-order'" :type="'number'" 
                        :oldValue="originalProduct.min_variant_order" v-model.number="product.min_variant_order"/>
                    </div>
                </div>
            </BaseFlyinColumn>

            <BaseContextMenu ref="contextVariant" class="context-variant"
            @keybind-d="removeVariant(contextVariantIndex)" 
            @keybind-c="$refs['fileInput-'+contextVariantIndex][0].click()"
            @keybind-u="editURL(contextVariantIndex)"
            @keybind-a="onAddVariant()"
            @keybind-r="$refs['nameInput-'+contextVariantIndex][0].$el.click()">
                <template v-slot>
                    <div class="item-group">
                        <div class="item" @click="onAddVariant">
                            <div class="icon-wrapper">
                                <i class="far fa-plus"></i>
                            </div>
                            <u>A</u>dd variant
                        </div>
                    </div>
                    <div class="item-group">
                        <div class="item" @click="$refs['fileInput-'+contextVariantIndex][0].click()">
                            <div class="icon-wrapper">
                                <i class="far fa-file"></i>
                            </div>
                            <u>C</u>hoose image from file
                        </div>
                        <div class="item" @click="editURL(contextVariantIndex)">
                            <div class="icon-wrapper">
                                <i class="far fa-link"></i>
                            </div>
                            Enter image <u>U</u>RL
                        </div>
                    </div>
                    <div class="item-group">
                        <div class="item" @click="$refs['nameInput-'+contextVariantIndex][0].$el.click()">
                            <div class="icon-wrapper">
                                <i class="far fa-pen"></i>
                            </div>
                            <u>R</u>ename
                        </div>
                    </div>
                    <div class="item-group">
                        <div class="item" @click="removeVariant(contextVariantIndex)">
                            <div class="icon-wrapper">
                                <i class="far fa-trash-alt"></i>
                            </div>
                            <u>D</u>elete
                        </div>
                    </div>
                </template>
            </BaseContextMenu>
            
            <BaseContextMenu ref="contextCurrency" class="context-currency">
                <template v-slot:header>
                    Select currency
                </template>
                <template v-slot="slotProps">
                    <div class="item-group">
                        <BaseSelectButtons :type="'radio'"
                        :options="product.prices"
                        v-model.number="currencyIndex" :submitOnChange="true" :optionValueKey="'index'"
                        :optionNameKey="'currency'" @submit="slotProps.hide()"/>
                    </div>
                </template>
            </BaseContextMenu>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Draggable from 'vuedraggable'
import axios from 'axios'

export default {
    name: 'editProductFlyin',
    props: [
        'show',
    ],
    components: {
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
        defaultPriceObject: {
            currency: 'Unnamed currency',
            mark_up: 0,
            wholesale_price: 0,
            recommended_retail_price: 0
        },
        contextVariantIndex: null,
    }},
    watch: {
        currentProduct(newVal, oldVal) {
            this.initProduct()
        }
    },
    computed: {
        ...mapGetters('products', ['currentProduct', 'nextProduct', 'prevProduct']),
        ...mapGetters('files', ['currentFile']),
        product () {
            return this.productToEdit
        },
        originalProduct () {
            return this.currentProduct
        },
        saveActive() {
            return !this.updatingProduct && this.gettingImagesFromURL <= 0 && this.hasChanges && !!this.productToEdit.datasource_id
        },
        currentCurrency () {
            return this.productToEdit 
            ? this.product.prices[this.currencyIndex] 
            : {
                currency: null,
                mark_up: null,
                recommended_retail_price: null,
                wholesale_price: null
            }
        },
        hasChanges() {
            const newProduct = this.productToEdit
            const oldProduct = this.currentProduct
            return JSON.stringify(newProduct) != JSON.stringify(oldProduct)
        },
        filesToDelete() {
            const newProduct = this.productToEdit
            const oldProduct = this.currentProduct
            let filesToDelete = []
            // Loop through the variants on the old product
            oldProduct.variants.forEach(variant => {
                // First check if the current variant has a blob id
                if (variant.blob_id != null) {
                    // See if we can find the blob_id on the new product.
                    const exists = newProduct.variants.find(x => x.blob_id == variant.blob_id)
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
            const variants = this.productToEdit.variants
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
        ...mapActions('products', ['showNextProduct', 'showPrevProduct', 'updateProduct', 'insertProducts', 'uploadImage', 'deleteImages']),
        ...mapMutations('products', ['setCurrentProduct']),
        initProduct() {
            // Make a copy of the product, so we can check for changes compared to the original
            this.productToEdit = JSON.parse(JSON.stringify(this.currentProduct))

            // Check if the product has any currencies, else add a default currency
            if (this.productToEdit.prices.length < 1) {
                this.productToEdit.prices.push(JSON.parse(JSON.stringify(this.defaultPriceObject)))
            }

            // Check if the current currency is available. Else set it to the first available
            if (!this.productToEdit.prices[this.currencyIndex]) this.currencyIndex = 0

            // Create an empty variant if no variants are present
            const variants = this.productToEdit.variants
            if (variants.length <= 0) {
                this.onAddVariant()
            }
        },
        showCurrencyContext(e) {
            this.$refs.contextCurrency.show(e)
        },
        showVariantContext(e, index) {
            this.contextVariantIndex = index
            this.$refs.contextVariant.show(e)
        },
        variantImg (variant) {
            if (variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        addCurrency() {  
            this.productToEdit.prices.push(JSON.parse(JSON.stringify(this.defaultPriceObject)))
            // Set the new currency as the active one
            this.currencyIndex = this.productToEdit.prices.length - 1
            // Focus and Select the new currencies name
            this.$nextTick(() => {
                this.$refs.currencyName.setActive()
            })
        },
        removeCurrency() {
            this.productToEdit.prices.splice(this.currencyIndex,1)
            this.currencyIndex = 0
        },
        onCloseSingle() {
            // Emit event to parent
            this.$emit('closeSingle')
        },
        onAddVariant() {
            this.product.variants.push({
                name: null,
                image: null,
                blob_id: null,
                sizes: null,
            })
        },
        removeVariant(index) {
            // Remove the variant from the product
            const variants = this.productToEdit.variants
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

            this.productToEdit.updated_at = new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ')

            const productToUpload = this.productToEdit

            let productIsNew = false

            // Check if the product has not yet been saved. If true, save it, since we cannot upload images to an unsaved product.
            if (!productToUpload.id) {
                console.log('insert products')
                productIsNew = true
                await this.insertProducts({file: this.currentFile, products: [productToUpload], addToState: true})
            }

            // Check if we have any files (images) we need to upload
            const variants = productToUpload.variants
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i]
                const editVariant = this.productToEdit.variants[i]
                if (variant.imageToUpload) {
                    // Set uploading to true
                    variant.imageToUpload.uploading = true
                    variant.imageToUpload.progress = 0

                    // Use the edit variant instead of the copy to make sure we get the correct blob data and can update the UI while we upload
                    await this.uploadImage({
                        file: this.currentFile, 
                        product: productToUpload,
                        variant: editVariant,
                        image: editVariant.imageToUpload.file, 
                        callback: progress => {
                            editVariant.imageToUpload.progress = progress
                        }
                    })
                    // Remove the image to upload
                    delete variant.imageToUpload
                }
            }

            // Update the product
            console.log('update product')
            await this.updateProduct(productToUpload)
            if (productIsNew) {
                this.setCurrentProduct(productToUpload)
                // Resort the products to include the new product
                this.$emit('onSort')
            }
            this.initProduct()
            this.updatingProduct = false
        },
        calculateMarkup({whs, rrp} = {}) {
            const currency = this.currentCurrency
            const decimals = 2
            const wholesale = whs || currency.wholesale_price
            const recommended = rrp || currency.recommended_retail_price
            if (wholesale > 0) {
                currency.mark_up = Number(Math.round((recommended / wholesale) + 'e' + decimals)+ 'e-' + decimals)
            } else currency.mark_up = 0
        },
        resetMarkup() {
            if (this.savedMarkup)
                this.currentCurrency.mark_up = this.savedMarkup
            else {
                this.currentCurrency.mark_up = this.originalProduct.prices[this.currencyIndex].mark_up
            }
        },
        revertMarkup() {
            this.calculateMarkup()
        },
        hotkeyHandler(event) {
            const key = event.code

            // Only do these if the current target is not the comment box
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT' && this.show) {
                if (key == 'KeyS' && this.saveActive)
                    this.onUpdateProduct()
            }
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

                // Get the orientation of the image to correct for photos taken with an iPhone
                await this.getOrientation(file, imgRotation => {
                        // save the image to upload to the variant with its rotation data,
                        vm.$set(variant, 'imageToUpload', {file: file, rotation: imgRotation, progress: 0, uploading: false})
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
        async getImageFromURL(url) {
            // Add to a counter of images we are currently processing
            this.gettingImagesFromURL++
            // Send a request to get the image
            let image
            await axios.get(url, {responseType: 'blob'}).then(response => {
                image = response.data
            }).catch(err => {
                image = false
            })
            this.gettingImagesFromURL--
            return image
        },
        async setVariantImageURL(variant, imageURL) {
            const image = await this.getImageFromURL(imageURL)
            if (image) {
                this.$set(variant, 'imageToUpload', {file: image, progress: 0, uploading: false})
                variant.image = imageURL
            } else {
                alert('Unable to fetch image from URL. Try manually downloading the image, and upload it as a file. Contact Kollekt Support if the error persists')
            }
        },
    },
    created() {
        document.body.addEventListener('keydown', this.hotkeyHandler)
        // Save an initial reference to the product we are going to edit
        if (this.currentProduct) {
            this.productToEdit = JSON.parse(JSON.stringify(this.currentProduct))
        }
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .product-variants {
        margin-top: 12px;
        white-space: nowrap;
        overflow-x: auto;
        margin-bottom: 18px;
    }
    .product-variant {
        width: 180px;
        display: inline-block;
        &:not(:last-child) {
            margin-right: 12px;
        }
        &.has-img {
            .drop-area {
                border: none;
            }
        }
        .progress-wrapper {
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            background: rgba($dark, .5);
            svg {
                width: 90%;
                rect {
                    fill: white;
                }
                rect.value {
                    fill: $primary;
                } 
            }
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
                z-index: 1;
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
    .currencies {
        margin-bottom: 32px;
    }
    .form-element {
        &:not(.last-child) {
            margin-bottom: 16px;
        }
    }
</style>
