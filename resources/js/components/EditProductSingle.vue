<template>
    <div class="edit-product-single">
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
                            <span class="button ghost icon-left" :class="{disabled: !hasChanges}" @click="onUpdateProduct"><i class="far fa-save"></i>Save</span>
                            <span class="hotkey"><span class="key">S</span> Save</span>
                        </div>
                        <div class="hotkey-wrapper">
                            <span class="button ghost icon-left"><i class="far fa-file-edit"></i>Edit</span>
                            <span class="hotkey"><span class="key">E</span> Edit</span>
                        </div>
                        <span class="circle primary clickable" @click="onPrevSingle()" :class="[{ disabled: prevProductId == null}]"><i class="fas fa-chevron-left"></i></span>
                        <span class="circle primary clickable" @click="onNextSingle()" :class="[{ disabled: nextProductId == null}]"><i class="fas fa-chevron-right"></i></span>
                    </div>
                </div>
                <div class="grid-2 grid-border-between body">
                    <div class="details">
                        <span>Variants ({{product.color_variants.length}})</span>
                        <span class="button light-2 icon-left" @click="onAddVariant"><i class="far fa-plus"></i> Add Variant</span>
                        <div class="product-variants" v-dragscroll>
                            <div class="product-variant" v-for="(variant, index) in product.color_variants" :key="index">
                                <div class="img-wrapper">
                                    <div class="drop-area" :class="{disabled: variant.image}" @dragenter="dragActive" @dragleave="dragInactive" @drop="dragInactive">
                                        <input v-if="variant.image" type="file" accept=".csv, text/csv" @change="filesChange($event, index, variant)" @click.prevent>
                                        <input v-else type="file" :ref="'fileInput-'+index" accept=".csv, text/csv" @change="filesChange($event, index, variant)">
                                        <img v-if="variant.image" :src="variantImg(variant)" @error="imgError(variant)">
                                        <template v-else>
                                            <div class="controls">
                                                <span class="button light-2" @click="$refs['fileInput-'+index][0].click()">Choose from file</span>
                                                <span class="button light-2">URL</span>
                                            </div>
                                        </template>
                                    </div>
                                    <div class="controls">
                                        <Dropdown class="dropdown-parent dark">
                                            <template v-slot:button="slotProps">
                                                <span class="square true-square light-2 clickable" @click="slotProps.toggle()"><i class="fas fa-ellipsis-h"></i></span>
                                            </template>
                                            <template v-slot:header="slotProps">
                                                <div class="header">
                                                    <span>Edit Variant</span>
                                                    <span class="circle small dark" @click="slotProps.toggle()"><i class="far fa-times"></i></span>
                                                </div>
                                            </template>
                                            <template v-slot:body>
                                                <div class="hotkeys">
                                                    <div class="hotkey">
                                                        <span class="button white">Choose file</span><span class="square true-square white">C</span>
                                                    </div>
                                                    <div class="hotkey">
                                                        <span class="button white">URL</span><span class="square true-square white">U</span>
                                                    </div>
                                                    <div class="hotkey">
                                                        <span class="button white">Rename</span><span class="square true-square white">R</span>
                                                    </div>
                                                    <div class="hotkey">
                                                        <span class="button red" @click="removeVariant(index)">Delete</span><span class="square true-square red">D</span>
                                                    </div>
                                                </div>
                                            </template>
                                        </Dropdown>
                                    </div>
                                </div>
                                <Editable :placeholder="'Untitled'" :value="variant.color" :type="'text'" v-model="variant.color"/>
                            </div>
                        </div>
                        <label>Product ID</label>
                        <span v-tooltip.top="'Not editable'" class="input-wrapper read-only">{{product.datasource_id}}</span>
                        <label>Cateogry</label>
                        <span v-tooltip.top="'Not editable'" class="input-wrapper read-only">{{product.category}}</span>
                        <label>Composition</label>
                        <span v-tooltip.top="'Not editable'" class="input-wrapper read-only composition multiline">{{product.composition.split(',').join(',\n')}}</span>
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
    },
    data: function () { return {
        currencyIndex: 0,
        productToEdit: null,
        savedMarkup: null,
        editingTitle: false,
        filesToUpload: [],
    }},
    watch: {
        currentProductv1(newVal, oldVal) {
            this.productToEdit = JSON.parse(JSON.stringify(newVal))
            this.productToEdit.delivery_date = new Date(this.productToEdit.delivery_date).toLocaleDateString("en-GB", {month: "long",year: "numeric"})
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
        }
    },
    methods: {
        ...mapActions('entities/products', ['showNextProduct', 'showPrevProduct', 'updateProduct']),
        variantImg (variant) {
            if (!variant.error && variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        imgError (variant) {
             variant.error = true
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
            console.log('hekk')
            this.productToEdit.color_variants.splice(index)
        },
        onUpdateProduct() {
            // Prepare the file to fit the database schema
            const productToUpload = JSON.parse(JSON.stringify(this.productToEdit))

            // Check if we have any files (images) we need to upload
            const files = this.filesToUpload
            if (files.length > 0) {

            }

            // Change the delivery_date format back to MySQL Date format (yyyy-mm-dd)
            // Since we are only using months add + ' 3' -> set the date to the 3rd to avoid the month changing when we slice due to timezone differences.
            productToUpload.delivery_date = new Date (productToUpload.delivery_date + ' 3').toJSON().slice(0,10)

            this.updateProduct(productToUpload)
        },
        calculateMarkup(newValue, price) {
            console.log('claculating markup')
            const el = this.currentCurrency
            const decimals = 2
            if (price == 'wholesale_price')
                el.markup = Number(Math.round((el.recommended_retail_price / newValue) + 'e' + decimals)+ 'e-' + decimals)
            else 
                el.markup = Number(Math.round((newValue / el.wholesale_price) + 'e' + decimals)+ 'e-' + decimals)
                
        },
        resetMarkup() {
            console.log('reset markup')
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
                const inAvailable = this.$refs.inButton ? !this.$refs.inButton.classList.contains('disabled') : false
                const outAvailable = this.$refs.outButton ? !this.$refs.outButton.classList.contains('disabled') : false
                const focusAvailable = this.$refs.focusButton ? !this.$refs.focusButton.classList.contains('disabled') : false

                if (key == 'Escape')
                    this.onCloseSingle()
                if (key == 'ArrowRight')
                    this.onNextSingle()
                if (key == 'ArrowLeft')
                    this.onPrevSingle()
                if (key == 's' && this.hasChanges)
                    this.onUpdateProduct()
            }
        },
        formatDelivery(e) {
            let product = this.product
            let date = this.product.delivery_date
            let newDate = new Date(date).toLocaleDateString("en-GB", {month: "long",year: "numeric"})
            product.delivery_date = newDate
        },
        dragActive(e) {
            e.target.closest('.drop-area').classList.add('drag')
        },
        dragInactive(e) {
            e.target.closest('.drop-area').classList.remove('drag')
        },
        filesChange(e, index, variant) {
            const file = e.target.files[0]
            // Check that the file is an image
            if (file && file['type'].split('/')[0] === 'image') {
                // if (this.filesToUpload.index) {
                //     this.filesToUpload.index = file
                // } else {
                //     this.filesToUpload.index = file
                // }
                const existingFile = this.filesToUpload.find(x => x.index == index)
                if (!existingFile) {
                    this.filesToUpload.push({index: index, file: file, image: null})
                } else {
                    existingFile.file = file
                }
            } else {
                // Throw error
                console.log('invalid file extension')
            }
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            // fileReader.onload = this.imageLoadHandler
            fileReader.onload = (e) => {
                console.log(' load load?')
                const newImage = e.target.result
                variant.image = newImage
            }
        },
        imageLoadHandler(e) {
            image = e.target.result
            console.log(e.target.result)
        }
        // removeFile(index) {
        //     this.newFile.files.splice(index, 1)
        // },
        // uploadFiles() {
        //     // Set new file data
        //     const newFile = this.newFile
        //     newFile.phase = Phase.query().first().id
        //     newFile.folderId = File.query().first().catalog_id
        //     newFile.workspace_id = this.currentWorkspaceId


        //     // Create collection from name
        //     this.uploadingFile = true
        //     this.uploadFile(newFile)
        //     .then(success => {
        //         this.uploadingFile = false
                
        //         // Close modal on succes
        //         if (success) 
        //             this.$refs.addFileModal.toggle()
        //         else window.alert('Something went wrong. Please try again')
        //     })


        //     // Do some validation with fileReader

        //     // newFile.files.forEach(file => {
        //     //     this.filesToProces++
        //     //     const fileReader = new FileReader()
        //     //     fileReader.readAsText(file)
        //     //     fileReader.onload = this.loadHandler
        //     // })
        // },
    },
    created() {
        document.body.addEventListener('keydown', this.hotkeyHandler)
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
            margin-right: 4px;
            border-radius: 2px;
            border: solid 1px $light2;
            overflow: hidden;
            img {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
            .drop-area {
                input[type=file] {
                    cursor: auto;
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
                &.drag {
                    background: $light1;
                }
                &.disabled {
                    pointer-events: none;
                }
                .controls {
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    z-index: 1;
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
</style>
