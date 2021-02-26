<template>
    <BaseFlyin
        class="edit-product-single"
        :show="show"
        @close="onCloseSingle"
        :columns="2"
        :class="{ 'has-labels': showLabels }"
    >
        <template v-slot:header>
            <BaseFlyinHeader
                v-if="show"
                :next="nextProduct"
                :prev="prevProduct"
                @close="onCloseSingle"
                @next="showNextProduct"
                @prev="showPrevProduct"
            >
                <template v-slot:left>
                    <div class="item-group product-title-wrapper">
                        <h3>{{ `#${product.datasource_id}: ${product.title}` }}</h3>
                        <span class="product-count"
                            >Product
                            {{ availableProducts.findIndex(x => x.id == product.id) + 1 }}
                            of
                            {{ availableProducts.length }}</span
                        >
                    </div>
                    <div class="item-group">
                        <LabelList
                            ref="labelList"
                            v-if="labelsEnabled || product.labels.length > 0"
                            :product="product"
                            v-horizontal-scroll
                        />
                    </div>
                </template>
                <template v-slot:right>
                    <div class="item-group">
                        <div class="last-update" v-if="product.created_at != product.updated_at">
                            <span>Changes saved</span>
                            <span>{{ product.updated_at }}</span>
                        </div>
                        <button @click="onDeleteProduct" class="ghost">
                            <i class="far fa-trash-alt"></i>
                            <span>Delete</span>
                        </button>
                        <div
                            class="hotkey-wrapper"
                            v-tooltip="{ content: !productToEdit.datasource_id && 'Product must have an ID' }"
                        >
                            <button
                                class="ghost save-button"
                                :class="{ disabled: !saveActive }"
                                @click="saveActive && onUpdateProduct()"
                            >
                                <i class="far fa-save"> </i><span>Save</span>
                            </button>
                            <span class="hotkey"><span class="key">S</span> Save</span>
                        </div>
                    </div>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-slot v-if="show">
            <BaseFlyinColumn>
                <span style="margin-right: 8px;">Variants ({{ product.variants.length }})</span>
                <button class="invisible ghost-hover" @click="onAddVariant">
                    <i class="far fa-plus"></i><span>Add Variant</span>
                </button>
                <Draggable v-model="product.variants" class="product-variants">
                    <div
                        class="product-variant"
                        v-for="(variant, index) in product.variants"
                        :key="index"
                        :class="{ 'is-current': currentVariant && currentVariant.id == variant.id }"
                        @contextmenu.prevent="showVariantContext($event, index)"
                        @click="currentVariant = variant"
                    >
                        <div
                            class="img-wrapper"
                            @dragenter="dragActive($event, index)"
                            @dragleave="dragLeave"
                            @drop="dragDrop"
                        >
                            <div class="drop-area" :class="{ drag: dragActiveIndex == index }">
                                <!-- <input v-if="variant.image || variant.blob_id" type="file" accept="image/*" @change="filesChange($event, index, variant)" @click.prevent> -->
                                <input
                                    type="file"
                                    :ref="'fileInput-' + index"
                                    accept="image/*"
                                    @change="filesChange($event, index, variant)"
                                />
                                <div
                                    v-if="
                                        variant.currentImg.imageToUpload && variant.currentImg.imageToUpload.uploading
                                    "
                                    class="progress-wrapper"
                                >
                                    <span v-if="variant.currentImg.imageToUpload.progress > 0"
                                        >{{ variant.currentImg.imageToUpload.progress }}%</span
                                    >
                                    <span v-else>Preparing upload..</span>
                                    <svg height="4">
                                        <rect class="background" width="100%" height="4" />
                                        <rect
                                            class="value"
                                            v-if="variant.currentImg.imageToUpload.progress > 0"
                                            :width="variant.currentImg.imageToUpload.progress + '%'"
                                            height="4"
                                        />
                                    </svg>
                                </div>
                                <img
                                    v-if="variant.currentImg.url != null"
                                    :key="`image-${variant.id ? variant.id : index}`"
                                    :src="variantImage(variant, { index: variant.imageIndex })"
                                    :class="[
                                        variant.currentImg.imageToUpload
                                            ? 'rotation-' + variant.currentImg.imageToUpload.rotation
                                            : '',
                                    ]"
                                />
                                <template v-else>
                                    <div class="controls">
                                        <span class="button light-2" @click="$refs['fileInput-' + index][0].click()"
                                            >Choose from file</span
                                        >
                                        <span @click="editURL(index)" class="button light-2">Enter image URL</span>
                                    </div>
                                </template>
                                <div v-if="URLActiveIndex == index" class="enter-url">
                                    <label :for="'url-input-' + index">Enter URL</label>
                                    <input
                                        :id="'url-input-' + index"
                                        :ref="'url-input-' + index"
                                        type="url"
                                        class="input-wrapper"
                                        @keyup.enter="
                                            setVariantImageURL(variant, $refs['url-input-' + index][0].value)
                                            URLActiveIndex = null
                                        "
                                        @keyup.esc="URLActiveIndex = null"
                                    />
                                    <div class="buttons-wrapper">
                                        <span
                                            class="button primary"
                                            @click="
                                                setVariantImageURL(variant, $refs['url-input-' + index][0].value)
                                                URLActiveIndex = null
                                            "
                                            >Save</span
                                        >
                                        <span class="button ghost" @click="URLActiveIndex = null">Cancel</span>
                                    </div>
                                </div>
                                <div class="drop-msg">
                                    <span>Drop image here</span>
                                </div>
                            </div>
                            <div class="controls">
                                <button class="white" @click="showVariantContext($event, index)">
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                            <div class="image-drawer">
                                <div class="square white trigger">
                                    <i class="far fa-images"></i>
                                    <div class="count circle xxs dark" v-if="variant.pictures.length > 1">
                                        <span>{{ variant.pictures.length }}</span>
                                    </div>
                                </div>
                                <!-- <div class="drawer"> -->
                                <Draggable
                                    v-model="variant.pictures"
                                    class="drawer"
                                    @start="onVariantPictureDragStart"
                                    @end="onVariantPictureDragEnd($event, variant)"
                                >
                                    <div
                                        class="image-wrapper"
                                        v-for="(image, index) in variant.pictures"
                                        :key="index"
                                        :class="{ active: variant.imageIndex == index }"
                                    >
                                        <BaseVariantImage
                                            :variant="variant"
                                            size="sm"
                                            :index="index"
                                            @click.native="variant.imageIndex = index"
                                        />
                                    </div>
                                    <button class="md" @click="onAddImageToVariant(variant)">
                                        <i class="far fa-plus"></i>
                                    </button>
                                </Draggable>
                                <!-- </div> -->
                            </div>
                        </div>
                        <!-- Variant Name -->
                        <VariantNameInput :variant="variant" @submit="onSubmitField" />
                        <!-- End Variant Name -->
                    </div>
                </Draggable>

                <div class="form-section">
                    <h3>Details</h3>
                    <div class="form-element">
                        <label for="product-name">Product name</label>
                        <BaseEditInputWrapper
                            id="product-name"
                            :type="'text'"
                            :value="product.title"
                            :oldValue="originalProduct.title"
                            v-model="product.title"
                            :submitOnBlur="true"
                            @submit="onSubmitField"
                        />
                    </div>
                    <div class="col-2">
                        <div class="form-element">
                            <label for="datasource-id">Product ID</label>
                            <BaseEditInputWrapper
                                id="datasource-id"
                                :type="'text'"
                                ref="idInput"
                                :maxlength="9"
                                :submitOnBlur="true"
                                :pattern="/^\d+$/"
                                :disabled="!!originalProduct.datasource_id"
                                :value="product.datasource_id"
                                :oldValue="originalProduct.datasource_id"
                                v-model="product.datasource_id"
                                :error="idError"
                                @change="validateProductId"
                                @submit="onSubmitField"
                            />
                        </div>
                        <div class="form-element">
                            <label for="category">Brand</label>
                            <BaseEditInputWrapper
                                id="brand"
                                :type="'text'"
                                :submitOnBlur="true"
                                :value="product.brand"
                                :oldValue="originalProduct.brand"
                                v-model="product.brand"
                                @submit="onSubmitField"
                            />
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="form-element">
                            <label for="category">Category</label>
                            <BaseEditInputWrapper
                                id="category"
                                :type="'text'"
                                :submitOnBlur="true"
                                :value="product.category"
                                :oldValue="originalProduct.category"
                                v-model="product.category"
                                @submit="onSubmitField"
                            />
                        </div>
                        <div class="form-element">
                            <label for="buying-group">Buyer Group</label>
                            <BaseEditInputWrapper
                                id="buying-group"
                                :type="'text'"
                                :submitOnBlur="true"
                                :value="product.buying_group"
                                :oldValue="originalProduct.buying_group"
                                v-model="product.buying_group"
                                @submit="onSubmitField"
                            />
                        </div>
                    </div>
                    <div class="form-element">
                        <label for="composition">Composition</label>
                        <BaseEditInputWrapper
                            id="composition"
                            :type="'text'"
                            :submitOnBlur="true"
                            :value="product.composition"
                            :oldValue="originalProduct.composition"
                            v-model="product.composition"
                            @submit="onSubmitField"
                        />
                    </div>
                    <div class="form-element">
                        <label for="description">Description</label>
                        <BaseEditableTextarea
                            id="description"
                            :oldValue="originalProduct.sale_description"
                            v-model="product.sale_description"
                            @submit="onSubmitField"
                        />
                    </div>
                </div>

                <div class="form-section">
                    <h3>Custom Data</h3>
                    <div
                        class="form-element"
                        v-for="(field, index) in customFields.filter(x => x.belong_to == 'Product')"
                        :key="index"
                    >
                        <label>{{ field.display_name }}</label>
                        <BaseEditInputWrapper
                            v-if="field.type != 'Array'"
                            :id="`extra-data-${index}`"
                            :type="'text'"
                            :value="product.extra_data[field.name]"
                            :oldValue="originalProduct.extra_data[field.name]"
                            v-model="product.extra_data[field.name]"
                            :submitOnBlur="true"
                            @submit="onSubmitField"
                        />
                        <CustomPropertyArray
                            v-else
                            :property="field"
                            :extraData="product.extra_data"
                            @submit="onSubmitField"
                        />
                    </div>
                </div>
            </BaseFlyinColumn>

            <BaseFlyinColumn>
                <div class="deliveries form-section">
                    <h3>Delivery</h3>
                    <div
                        class="col-2 form-element"
                        v-for="(delivery, index) in product.delivery_dates"
                        :key="'delivery-' + index"
                    >
                        <BaseDatePicker
                            :type="'month'"
                            :formatIn="'YYYY-MM-DD'"
                            :formatOut="'MMMM YYYY'"
                            v-model="product.delivery_dates[index]"
                            @submit="onSubmitField"
                        />

                        <div style="display: flex; align-items: center; height: 40px;">
                            <button class="invisible ghost-hover" @click="onRemoveDelivery(index)">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-element">
                        <button class="ghost" @click="onAddDelivery">
                            <i class="far fa-plus"></i><span>Add Delivery</span>
                        </button>
                    </div>
                </div>

                <div class="minimum form-section">
                    <h3>Minimum</h3>
                    <div class="col-2 delivery form-element">
                        <div>
                            <label for="min-order">Order minimum (pcs)</label>
                            <BaseEditInputWrapper
                                :id="'min-order'"
                                :type="'number'"
                                :submitOnBlur="true"
                                :oldValue="originalProduct.min_order"
                                v-model.number="product.min_order"
                                @submit="onSubmitField"
                            />
                        </div>
                        <div>
                            <label for="min-order">Variant minimum (pcs)</label>
                            <BaseEditInputWrapper
                                :id="'min-order'"
                                :type="'number'"
                                :submitOnBlur="true"
                                :oldValue="originalProduct.min_variant_order"
                                v-model.number="product.min_variant_order"
                                @submit="onSubmitField"
                            />
                        </div>
                    </div>
                </div>

                <div class="prices form-section">
                    <h3>Prices</h3>
                    <div class="col-5 form-element">
                        <label>Currency name</label>
                        <label>WHS <BaseTooltipButton msg="Wholesale Price"/></label>
                        <label>RRP <BaseTooltipButton msg="Recommended Retail Price"/></label>
                        <label>Mark up</label>
                    </div>
                    <div class="col-5 form-element" v-for="(price, index) in product.prices" :key="index">
                        <!-- <BaseEditInputWrapper ref="currencyName" :id="'currencyName'" :type="'text'" 
                        :oldValue="originalProduct.prices[index] ? originalProduct.prices[index].currency : null" 
                        v-model="price.currency"/> -->
                        <BaseInputField
                            disabled="true"
                            :value="price.currency"
                            type="select"
                            @click="showCurrencyContext($event, price)"
                        >
                            <i class="fas fa-caret-down"></i>
                        </BaseInputField>

                        <BaseEditInputWrapper
                            :id="'wholesale'"
                            :type="'number'"
                            :submitOnBlur="true"
                            :oldValue="
                                originalProduct.prices[index] ? originalProduct.prices[index].wholesale_price : null
                            "
                            v-model.number="price.wholesale_price"
                            @submit="
                                calculateMarkup({ price, whs: $event })
                                onSubmitField()
                            "
                            @activate="savedMarkup = price.mark_up"
                            @change="calculateMarkup({ price, whs: $event })"
                            @cancel="resetMarkup(price, index)"
                            @revert="revertMarkup(price)"
                        />

                        <BaseEditInputWrapper
                            :id="'recommended-retail'"
                            :type="'number'"
                            :submitOnBlur="true"
                            :oldValue="
                                originalProduct.prices[index]
                                    ? originalProduct.prices[index].recommended_retail_price
                                    : null
                            "
                            v-model.number="price.recommended_retail_price"
                            @submit="
                                calculateMarkup({ price, rrp: $event })
                                onSubmitField()
                            "
                            @activate="savedMarkup = price.mark_up"
                            @change="calculateMarkup({ price, rrp: $event })"
                            @cancel="resetMarkup(price, index)"
                            @revert="revertMarkup(price)"
                        />

                        <BaseEditInputWrapper
                            :id="'markup'"
                            :type="'number'"
                            :submitOnBlur="true"
                            :oldValue="originalProduct.prices[index] ? originalProduct.prices[index].mark_up : null"
                            v-model.number="price.mark_up"
                        />
                        <!-- <span v-tooltip.top="'Not editable'" class="input-wrapper read-only">{{price.mark_up}}</span> -->

                        <div style="display: flex; align-items: center; height: 40px;">
                            <button class="invisible ghost-hover" @click="removeCurrency(index)">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-element">
                        <button class="ghost" @click="addCurrency">
                            <i class="far fa-plus"></i><span>Add currency</span>
                        </button>
                    </div>
                </div>

                <div class="assortments form-section">
                    <h3>Assortments</h3>

                    <div class="col-4 form-element">
                        <label>Assortment name</label>
                        <label>Box size</label>
                        <label>EAN</label>
                    </div>

                    <div class="col-4 form-element" v-for="(assortment, index) in product.assortments" :key="index">
                        <BaseEditInputWrapper
                            :submitOnBlur="true"
                            :oldValue="
                                originalProduct.assortments[index] ? originalProduct.assortments[index].name : null
                            "
                            v-model="assortment.name"
                            @submit="onSubmitField"
                        />

                        <BaseEditInputWrapper
                            type="number"
                            :submitOnBlur="true"
                            :oldValue="
                                originalProduct.assortments[index] ? originalProduct.assortments[index].box_size : null
                            "
                            v-model.number="assortment.box_size"
                            @submit="onSubmitField"
                        />

                        <BaseEditInputWrapper
                            type="number"
                            :submitOnBlur="true"
                            :oldValue="
                                originalProduct.assortments[index] ? originalProduct.assortments[index].box_ean : null
                            "
                            v-model.number="assortment.box_ean"
                            @submit="onSubmitField"
                        />

                        <div style="display: flex; align-items: center; height: 40px;">
                            <button class="invisible ghost-hover" @click="removeAssortment(index)">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-element">
                        <button class="ghost" @click="addAssortment">
                            <i class="far fa-plus"></i><span>Add assortment</span>
                        </button>
                    </div>
                </div>

                <div class="assortment-sizes form-section">
                    <h3>Available Assortment Sizes</h3>
                    <Draggable class="form-element" handle=".drag-handle">
                        <div
                            class="col-2 form-element"
                            v-for="(assortment, index) in product.assortment_sizes"
                            :key="index"
                        >
                            <BaseEditInputWrapper
                                ref="assortmentSizeInput"
                                :type="'text'"
                                :submitOnBlur="true"
                                :oldValue="product.assortment_sizes[index]"
                                v-model="product.assortment_sizes[index]"
                                @submit="onSubmitField"
                            />

                            <div style="display: flex; align-items: center; height: 40px;">
                                <div class="drag-handle square ghost primary" style="margin-left: 8px;">
                                    <i class="far fa-arrows-alt-v"></i>
                                </div>
                                <button class="invisible ghost-hover" @click="onRemoveAssortmentSize(index)">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </Draggable>
                    <div class="form-element">
                        <button class="ghost" @click="onAddAssortmentSize">
                            <i class="far fa-plus"></i><span>Add Size</span>
                        </button>
                    </div>
                </div>

                <div class="EANs form-section">
                    <h3>Variant Sizes</h3>
                    <div v-if="!currentVariant">
                        <p>Click a variant to manage it's sizes</p>
                    </div>

                    <div v-else>
                        <div class="col-3 form-element">
                            <label>Size name</label>
                            <label>Size EAN</label>
                        </div>

                        <div class="col-3 form-element" v-for="(size, index) in currentVariant.ean_sizes" :key="index">
                            <BaseEditInputWrapper
                                ref="variantSizeInput"
                                :submitOnBlur="true"
                                v-model="size.size"
                                :oldValue="size.size"
                                @submit="onSubmitField"
                            />

                            <BaseEditInputWrapper
                                :type="'text'"
                                :pattern="/^\d+$/"
                                :maxlength="13"
                                :submitOnBlur="true"
                                v-model="size.ean"
                                :oldValue="size.ean"
                                @submit="onSubmitField"
                            />

                            <div style="display: flex; align-items: center; height: 40px;">
                                <button class="invisible ghost-hover" @click="onRemoveSize(index)">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="form-element">
                            <button class="ghost" @click="onAddSize">
                                <i class="far fa-plus"></i><span>Add size</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-section variant-custom-props">
                    <h3>Variant Custom Data</h3>
                    <div v-if="!currentVariant">
                        <p>Click a variant to manage it's sizes</p>
                    </div>

                    <div class="custom-property-list" v-else>
                        <div
                            class="form-element"
                            v-for="(field, index) in customFields.filter(x => x.belong_to == 'Variant')"
                            :key="index"
                        >
                            <label>{{ field.display_name }}</label>
                            <BaseEditInputWrapper
                                v-if="field.type != 'Array'"
                                :id="`extra-data-${index}`"
                                :type="'text'"
                                :value="currentVariant.extra_data[field.name]"
                                :oldValue="currentVariant.extra_data[field.name]"
                                v-model="currentVariant.extra_data[field.name]"
                                :submitOnBlur="true"
                                @submit="onSubmitField"
                            />
                            <CustomPropertyArray
                                v-else
                                :property="field"
                                :extraData="currentVariant.extra_data"
                                @submit="onSubmitField"
                            />
                        </div>
                    </div>
                </div>

                <div class="EANs form-section">
                    <h3>
                        EANs
                        <i
                            class="far fa-info-circle"
                            v-tooltip="
                                'EANs added here can be scanned with the Kollekt mobile App to find this product'
                            "
                        ></i>
                    </h3>
                    <div class="col-2 form-element" v-for="(ean, index) in product.eans" :key="index">
                        <BaseEditInputWrapper
                            :type="'text'"
                            :pattern="/^\d+$/"
                            :maxlength="13"
                            :submitOnBlur="true"
                            :oldValue="originalProduct.eans[index]"
                            v-model="product.eans[index]"
                            :value="ean"
                            @submit="onSubmitField"
                        />

                        <div style="display: flex; align-items: center; height: 40px;">
                            <button class="invisible ghost-hover" @click="removeEAN(index)">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-element">
                        <button class="ghost" @click="addEAN"><i class="far fa-plus"></i><span>Add EAN</span></button>
                    </div>
                </div>
            </BaseFlyinColumn>

            <BaseContextMenu ref="contextVariant" class="context-variant">
                <template v-slot>
                    <div class="item-group">
                        <BaseContextMenuItem iconClass="far fa-plus" hotkey="KeyA" @click="onAddVariant">
                            <u>A</u>dd variant
                        </BaseContextMenuItem>
                    </div>
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-file"
                            hotkey="KeyC"
                            @click="$refs['fileInput-' + contextVariantIndex][0].click()"
                        >
                            <u>C</u>hoose image from file
                        </BaseContextMenuItem>
                        <BaseContextMenuItem
                            iconClass="far fa-link"
                            hotkey="KeyU"
                            @click="editURL(contextVariantIndex)"
                        >
                            <span>Enter image <u>U</u>RL</span>
                        </BaseContextMenuItem>
                    </div>
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-pen"
                            hotkey="KeyR"
                            @click="$refs['nameInput-' + contextVariantIndex][0].$el.click()"
                        >
                            <u>R</u>ename
                        </BaseContextMenuItem>
                    </div>
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-trash-alt"
                            hotkey="KeyD"
                            @click="removeVariant(contextVariantIndex)"
                        >
                            <u>D</u>elete variant
                        </BaseContextMenuItem>
                        <BaseContextMenuItem
                            iconClass="far fa-trash-alt"
                            hotkey="KeyP"
                            @click="removePicture(contextVariantIndex)"
                        >
                            <span>Delete <u>p</u>icture</span>
                        </BaseContextMenuItem>
                    </div>
                </template>
            </BaseContextMenu>

            <BaseDialog ref="confirmDeleteProduct" type="confirm" confirmColor="red">
                <div class="icon-graphic">
                    <i class="lg primary far fa-file"></i>
                    <i class="lg far fa-arrow-right"></i>
                    <i class="lg dark far fa-trash"></i>
                </div>
                <h3>Are you sure you want to delete this product?</h3>
            </BaseDialog>

            <BaseSelectButtonsContextMenu
                v-if="contextPrice"
                ref="contextCurrency"
                header="Choose Currency"
                :submitOnChange="true"
                v-model="contextPrice.currency"
                unsetOption="Clear"
                :unsetValue="null"
                type="radio"
                :options="availableCurrencies"
                :search="true"
            />

            <BaseDialog
                ref="confirmDiscardDialog"
                type="confirm"
                confirmColor="red"
                confirmText="Yes, discard product"
                cancelText="No, wait"
            >
                <div class="icon-graphic">
                    <i class="lg primary far fa-box"></i>
                    <i class="lg far fa-arrow-right"></i>
                    <i class="lg dark far fa-trash"></i>
                </div>
                <h3>Really discard this product?</h3>
                <p>The product has no ID and will be discarded</p>
            </BaseDialog>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Draggable from 'vuedraggable'
import axios from 'axios'
import variantImage from '../../mixins/variantImage'
import VariantNameInput from './VariantNameInput'
import CustomPropertyArray from './CustomPropertyArray'
import LabelList from '../SelectionPage/ProductsTableRow/LabelList'

export default {
    name: 'editProductFlyin',
    props: ['show'],
    mixins: [variantImage],
    components: {
        Draggable,
        VariantNameInput,
        CustomPropertyArray,
        LabelList,
    },
    data: function() {
        return {
            productToEdit: null,
            savedMarkup: null,
            editingTitle: false,
            updatingProduct: false,
            dragActiveIndex: null,
            dragCounter: 0,
            URLActiveIndex: null,
            gettingImagesFromURL: 0,
            defaultPriceObject: {
                currency: 'New currency',
                mark_up: 0,
                wholesale_price: 0,
                recommended_retail_price: 0,
            },
            defaultAssortmentObject: {
                name: 'New assortment',
                box_size: null,
                box_ean: null,
            },
            contextVariantIndex: null,
            idError: null,
            contextPrice: null,
            draggingVariantPicture: false,
            variantImageFromURLQueue: [],
            currentVariant: null,
        }
    },
    watch: {
        currentProduct: {
            deep: true,
            handler: 'initProduct',
        },
    },
    computed: {
        ...mapGetters('products', ['currentProduct', 'nextProduct', 'prevProduct', 'products', 'availableProducts']),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('workspaces', {
            customFields: 'getCustomProductFields',
            availableLabels: 'getAvailableProductLabels',
            workspaceRole: 'authUserWorkspaceRole',
        }),
        product() {
            return this.productToEdit
        },
        showLabels() {
            return this.labelsEnabled || this.product.labels.length > 0
        },
        originalProduct() {
            return this.currentProduct
        },
        saveActive() {
            return (
                !this.updatingProduct &&
                this.gettingImagesFromURL <= 0 &&
                this.hasChanges &&
                !!this.productToEdit.datasource_id
            )
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
        labelsEnabled() {
            return this.availableLabels.length > 0
        },
        hasLabelWriteAccess() {
            return this.labelsEnabled && (this.currentFile.editable || this.workspaceRole == 'Admin')
        },
    },
    methods: {
        ...mapActions('files', ['syncExternalImages']),
        ...mapActions('products', [
            'showNextProduct',
            'showPrevProduct',
            'updateProduct',
            'insertProducts',
            'uploadImage',
            'deleteImages',
            'deleteProducts',
            'initProducts',
        ]),
        ...mapMutations('products', ['setCurrentProduct']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        showCurrencyContext(e, price) {
            this.contextPrice = price
            this.$nextTick(() => {
                this.$refs.contextCurrency.show(e)
            })
        },
        async onDeleteProduct() {
            if (!this.product.id) {
                this.onCloseSingle()
                return
            }
            if (await this.$refs.confirmDeleteProduct.confirm()) {
                this.deleteProducts({ file: this.currentFile, products: [this.product] })
                this.onCloseSingle()
            }
        },
        validateProductId(value) {
            // Check if the value already exists on a product
            const existingProduct = this.products.find(x => x.datasource_id == value)
            if (existingProduct && existingProduct.id != this.productToEdit.id) {
                this.idError = 'ID already taken'
            } else {
                this.idError = null
            }
        },
        initProduct() {
            // Make a copy of the product, so we can check for changes compared to the original
            const productClone = JSON.parse(JSON.stringify(this.currentProduct))
            this.productToEdit = productClone
            this.initProducts([this.productToEdit])
            this.currentVariant = null

            // Check if the product has any currencies, else add a default currency
            // if (this.productToEdit.prices.length < 1) {
            //     this.productToEdit.prices.push(JSON.parse(JSON.stringify(this.defaultPriceObject)))
            // }

            // Create an empty variant if no variants are present
            const variants = this.productToEdit.variants
            if (variants.length <= 0) {
                this.onAddVariant()
            }
            variants.map(variant => {
                if (variant.pictures.length <= 0) {
                    this.onAddImageToVariant(variant)
                }
            })
        },
        showVariantContext(e, index) {
            this.contextVariantIndex = index
            this.$refs.contextVariant.show(e)
        },
        addCurrency() {
            this.productToEdit.prices.push(JSON.parse(JSON.stringify(this.defaultPriceObject)))
        },
        removeCurrency(index) {
            this.productToEdit.prices.splice(index, 1)
        },
        addAssortment() {
            this.productToEdit.assortments.push(JSON.parse(JSON.stringify(this.defaultAssortmentObject)))
        },
        removeAssortment(index) {
            this.productToEdit.assortments.splice(index, 1)
        },
        addEAN() {
            this.productToEdit.eans.push(null)
        },
        removeEAN(index) {
            this.productToEdit.eans.splice(index, 1)
        },
        async onCloseSingle() {
            document.activeElement.blur()
            if (!this.product.id) {
                if (await this.$refs.confirmDiscardDialog.confirm()) {
                    this.$emit('closeSingle')
                }
            } else {
                // Emit event to parent
                this.$emit('closeSingle')
            }
        },
        onAddVariant() {
            const newVariant = {
                id: this.$uuid.v4(),
                name: 'Unnamed',
                color: null,
                variant: null,
                image: null,
                blob_id: null,
                sizes: [],
                images: [],
                pictures: [
                    {
                        url: null,
                        name: null,
                    },
                ],
                imageIndex: 0,
                ean: null,
                ean_sizes: [],
                extra_data: {},
            }

            Object.defineProperty(newVariant, 'currentImg', {
                get: function() {
                    return newVariant.pictures[newVariant.imageIndex]
                },
            })

            this.product.variants.push(newVariant)

            this.currentVariant = newVariant
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
        onSubmitField() {
            // Don't update the product if it hasn't been assigned a datasource id yet
            if (!this.productToEdit.datasource_id) return

            this.onUpdateProduct()
        },
        async onUpdateProduct() {
            // Prepare the file to fit the database schema
            const vm = this
            this.updatingProduct = true

            const productToEdit = this.productToEdit

            let productIsNew = false

            // Check if the product has not yet been saved. If true, save it, since we cannot upload images to an unsaved product.
            let insertError = false
            if (!productToEdit.id) {
                productIsNew = true
                const productToUpload = JSON.parse(JSON.stringify(this.productToEdit))
                productToUpload.variants = []
                await this.insertProducts({
                    file: this.currentFile,
                    products: [productToUpload],
                    addToState: true,
                }).catch(err => {
                    insertError = true
                })
                productToEdit.id = productToUpload.id
            }
            if (insertError) {
                this.updatingProduct = false
                return
            }

            if (this.variantImageFromURLQueue.length > 1) {
                this.variantImageFromURLQueue.map(async queueItem => {
                    await this.setVariantImageURL(queueItem.variant, queueItem.imageURL, queueItem.picture)
                })
            }

            // Check if we have any files (images) we need to upload
            const variants = productToEdit.variants
            let variantError = false
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i]
                const editVariant = this.productToEdit.variants[i]
                for (let i = 0; i < variant.pictures.length; i++) {
                    const picture = variant.pictures[i]
                    if (picture.imageToUpload) {
                        // Set uploading to true
                        picture.imageToUpload.uploading = true
                        picture.imageToUpload.progress = 0
                        variant.imageIndex = i

                        // Use the edit variant instead of the copy to make sure we get the correct blob data and can update the UI while we upload
                        await this.uploadImage(
                            {
                                file: this.currentFile,
                                product: productToEdit,
                                picture,
                                image: picture.imageToUpload.file,
                            },
                            { onUploadProgress: progressEvent => console.log('progressevent', progressEvent) }
                        )
                            .then(response => {
                                // Remove the image to upload
                                delete picture.imageToUpload
                                variant.image = variant.pictures[0].url
                            })
                            .catch(err => {
                                variantError = true
                                picture.imageToUpload.uploading = false
                            })
                    }
                }
            }
            if (variantError) {
                this.updatingProduct = false
                // Show alert
                this.SHOW_SNACKBAR({
                    msg: 'Error when trying to upload image. Please try again',
                    callback: () => this.onUpdateProduct(),
                    callbackLabel: 'Retry',
                    iconClass: 'fa-exclamation-triangle',
                    type: 'warning',
                    duration: 0,
                })
                return
            }

            // Update the product
            await this.updateProduct(productToEdit)
                .then(response => {
                    if (productIsNew) {
                        this.setCurrentProduct(productToEdit)
                        // Resort the products to include the new product
                        this.$emit('onSort')
                    } else {
                        this.initProduct()
                    }
                })
                .catch(err => {})
            this.updatingProduct = false
        },
        calculateMarkup({ price, whs, rrp } = {}) {
            const decimals = 2
            const wholesale = whs || price.wholesale_price
            const recommended = rrp || price.recommended_retail_price
            if (wholesale > 0) {
                price.mark_up = Number(Math.round(recommended / wholesale + 'e' + decimals) + 'e-' + decimals)
            } else price.mark_up = 0
        },
        resetMarkup(price, index) {
            if (this.savedMarkup != null) price.mark_up = this.savedMarkup
            else {
                price.mark_up = this.originalProduct.prices[index].mark_up
            }
        },
        revertMarkup(price) {
            this.calculateMarkup({ price })
        },
        hotkeyHandler(event) {
            const key = event.code

            // Only do these if the current target is not the comment box
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT' && this.show) {
                if (key == 'KeyS' && this.saveActive) this.onUpdateProduct()

                // Label hotkeys
                if (this.hasLabelWriteAccess) {
                    // Number hotkey
                    if (parseInt(e.key)) {
                        const pressedNumber = e.key
                        const label = this.availableLabels[pressedNumber - 1]
                        if (!label) return

                        // Check if the label is already added
                        const existingIndex = this.product.labels.findIndex(x => x == label)
                        if (existingIndex >= 0) {
                            this.product.labels.splice(existingIndex, 1)
                        } else {
                            this.product.labels.push(label)
                        }
                        this.onUpdateProduct()
                    }
                    // Hashtag
                    if (e.key == '#') {
                        // Open labels menu
                        this.$refs.labelList.$refs.popover.show()
                    }
                }
            }
        },
        dragActive(e, index) {
            // console.log('drag active', e, e.relatedTarget.closest('.drawer'))
            // If we are dragging an image from the drawer, don't trigger dragging
            if (this.draggingVariantPicture) return
            if (
                e.target.classList.contains('.image-drawer') ||
                (e.relatedTarget && e.relatedTarget.closest('.drawer'))
            ) {
                return
            }
            // e.target.querySelector('.drop-area').classList.add('drag')
            this.dragActiveIndex = index
            this.dragCounter++
        },
        dragLeave(e) {
            if (this.draggingVariantPicture) return
            this.dragCounter--
            if (this.dragCounter == 0) {
                this.dragActiveIndex = null
            }
            // e.target.querySelector('.drop-area').classList.remove('drag')
        },
        dragDrop() {
            if (this.draggingVariantPicture) return
            this.dragActiveIndex = null
            this.dragCounter = 0
        },
        async filesChange(e, index, variant) {
            const vm = this
            const file = e.target.files[0]
            // Check that the file is an image
            if (file && file['type'].split('/')[0] === 'image') {
                // xxxxx GET ORIENTATION IS LEGACY CODE. IT HAS BEEN REPLACED BY COMPRESS JS xxxxxx
                // Get the orientation of the image to correct for photos taken with an iPhone
                await this.getOrientation(file, imgRotation => {
                    // save the image to upload to the variant picture with its rotation data,
                    const picture = variant.currentImg

                    vm.$set(picture, 'imageToUpload', { file: file, progress: 0, uploading: false })
                    // variant.imageToUpload = {file: file, id: newUUID, rotation: imgRotation}
                })
                // xxxxx GET ORIENTATION IS LEGACY CODE. IT HAS BEEN REPLACED BY COMPRESS JS xxxxxx

                // Process the uploaded image
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = e => {
                    // Show the new image on the variant

                    const newImage = e.target.result
                    variant.image = newImage
                    variant.currentImg.url = newImage
                }
            } else {
                // Throw error
                console.log('invalid file extension')
            }
        },
        getOrientation(file, callback) {
            var reader = new FileReader()

            reader.onload = function(event) {
                var view = new DataView(event.target.result)

                if (view.getUint16(0, false) != 0xffd8) return callback(-2)

                var length = view.byteLength,
                    offset = 2

                while (offset < length) {
                    var marker = view.getUint16(offset, false)
                    offset += 2

                    if (marker == 0xffe1) {
                        if (view.getUint32((offset += 2), false) != 0x45786966) {
                            return callback(-1)
                        }
                        var little = view.getUint16((offset += 6), false) == 0x4949
                        offset += view.getUint32(offset + 4, little)
                        var tags = view.getUint16(offset, little)
                        offset += 2

                        for (var i = 0; i < tags; i++)
                            if (view.getUint16(offset + i * 12, little) == 0x0112)
                                return callback(view.getUint16(offset + i * 12 + 8, little))
                    } else if ((marker & 0xff00) != 0xff00) break
                    else offset += view.getUint16(offset, false)
                }
                return callback(-1)
            }

            reader.readAsArrayBuffer(file.slice(0, 64 * 1024))
        },
        editURL(index) {
            this.URLActiveIndex = index
            this.$nextTick(() => {
                this.$refs['url-input-' + index][0].focus()
            })
        },
        async setVariantImageURL(variant, imageURL, picture) {
            if (!this.product.id) {
                this.variantImageFromURLQueue.push({ picture: variant.currentImg, variant, imageURL })
                variant.image = imageURL
                variant.currentImg.url = imageURL
                return
            }

            // variant.image = imageURL
            if (picture) {
                picture.url = imageURL
            } else {
                variant.currentImg.url = imageURL
            }
            await this.syncExternalImages({ file: this.currentFile, products: [this.productToEdit] })
        },
        onAddImageToVariant(variant) {
            variant.pictures.push({ url: null, name: null })
            variant.imageIndex = variant.pictures.length - 1
        },
        onVariantPictureDragStart(e, variant) {
            this.draggingVariantPicture = true
        },
        onVariantPictureDragEnd(e, variant) {
            this.draggingVariantPicture = false
            // If the dragged picture was the currently active picture set the active picture index to the pictures new index
            // I.e. keep the same picure as the active one even after dragging
            if (e.oldIndex == variant.imageIndex) {
                variant.imageIndex = e.newIndex
                return
            }
            // Keep the same position when the active picture gets "bumped"
            if (e.newIndex >= variant.imageIndex && e.oldIndex < variant.imageIndex) variant.imageIndex--
            if (e.newIndex <= variant.imageIndex && e.oldIndex > variant.imageIndex) variant.imageIndex++
        },
        removePicture(index) {
            const variant = this.product.variants[index]
            const toDeleteIsLastPicture = variant.imageIndex > 0 && variant.imageIndex == variant.pictures.length - 1
            variant.pictures.splice(variant.imageIndex, 1)
            if (toDeleteIsLastPicture) {
                variant.imageIndex--
            }
            if (variant.pictures.length <= 0) {
                this.onAddImageToVariant(variant)
            }
        },
        onAddAssortmentSize() {
            this.product.assortment_sizes.push('unset')
            this.$nextTick(() => {
                this.$refs.assortmentSizeInput[this.product.assortment_sizes.length - 1].setActive()
            })
        },
        onRemoveAssortmentSize(index) {
            this.product.assortment_sizes.splice(index, 1)
        },
        onAddSize() {
            if (!this.currentVariant.ean_sizes) Vue.set(this.currentVariant, 'ean_sizes', [])
            this.currentVariant.ean_sizes.push({
                size: 'New size',
                ean: null,
            })
            this.$nextTick(() => {
                this.$refs.variantSizeInput[this.currentVariant.ean_sizes.length - 1].setActive()
            })
        },
        onRemoveSize(index) {
            this.currentVariant.ean_sizes.splice(index, 1)
        },
        onAddDelivery() {
            this.product.delivery_dates.push(new Date().toLocaleDateString({}, { month: 'long', year: 'numeric' }))
        },
        onRemoveDelivery(index) {
            this.product.delivery_dates.splice(index, 1)
        },
    },
    created() {
        document.body.addEventListener('keydown', this.hotkeyHandler)
        // Save an initial reference to the product we are going to edit
        if (this.currentProduct) {
            this.productToEdit = Object.assign({}, this.currentProduct)
        }
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

::v-deep {
    &.has-labels {
        .flyin-header {
            margin-bottom: 40px;
        }
        .label-list {
            top: 76px;
            left: 0;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 0 16px 6px;
            max-width: none;
            &::after {
                content: '';
                display: block;
                width: 16px;
                height: 1px;
                flex-shrink: 0;
            }
            > * {
                flex-shrink: 0;
            }
            .add-button {
                display: block;
            }
        }
    }
}

.product-title-wrapper {
    flex-direction: column;
    justify-content: flex-start;
    .product-count {
        font-size: 12px;
        line-height: 1;
    }
}

.save-button {
    min-width: 72px;
}
.product-variants {
    margin-top: 12px;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 18px;
}
.assortments {
    .col-4 {
        grid-template-columns: 1fr 100px 192px 32px;
    }
}
.prices {
    .col-5 {
        grid-template-columns: 140px repeat(3, 1fr) 32px;
    }
}
.form-section {
    padding: 16px 16px 32px;
    border: $borderModule;
    box-shadow: $shadowModule;
    border-radius: $borderRadiusModule;
    // background: $bg;
    background: white;
    &:not(:last-child) {
        margin-bottom: 32px;
    }
}
.product-variant {
    width: 182px;
    display: inline-block;
    &.is-current {
        .drop-area {
            border: solid 2px $primary;
        }
    }
    &:not(:last-child) {
        margin-right: 12px;
    }
    &.has-img {
        .drop-area {
            border: none;
        }
        .img-wrapper {
            border: $borderElHard;
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
        background: rgba($dark, 0.5);
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
        // padding-top: 133.33%; // 4:3
        // height: 0;
        height: 242px;
        width: 100%;
        position: relative;
        overflow: hidden;
        display: inline-block;
        border-radius: $borderRadiusEl;
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
            input[type='file'] {
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
                input[type='file'] {
                    z-index: 2;
                    pointer-events: all;
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
            left: 4px;
            top: 4px;
            opacity: 0;
            transition: 0.3s;
            border: $borderElSoft;
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
.form-element {
    &:not(:last-child) {
        margin-bottom: 16px;
    }
}

.image-drawer {
    position: absolute;
    right: 4px;
    top: 4px;
    padding: 4px;
    border: $borderElSoft;
    border-radius: $borderRadiusEl;
    border-color: transparent;
    z-index: 1;
    &:hover,
    &.hover {
        background: white;
        border-color: $borderColorEl;
        box-shadow: $shadowEl;
        .drawer {
            display: block;
        }
        .trigger {
            display: none;
        }
    }
    .trigger {
        border: $borderElSoft;
        margin-right: -4px;
        margin-top: -4px;
        position: relative;
        .count {
            position: absolute;
            top: -6px;
            right: -6px;
            height: 16px;
            width: 16px;
            font-size: 10px;
        }
    }
    .drawer {
        display: none;
        overflow-y: auto;
        max-height: 200px;
        > :not(:last-child) {
            margin-bottom: 4px;
        }
    }
    > :not(:last-child) {
        margin-bottom: 4px;
    }
    .image-wrapper {
        width: 36px;
        height: 36px;
        border: $borderElSoft;
        border-radius: $borderRadiusEl;
        position: relative;
        cursor: pointer;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            position: absolute;
        }
        &.active {
            border: solid 2px $primary;
            cursor: default;
        }
    }
}
</style>
