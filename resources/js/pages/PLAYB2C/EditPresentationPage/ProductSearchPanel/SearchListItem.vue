<template>
    <div class="drag-wrapper item-wrapper" :key="product.id">
        <div
            class="search-list-item drag-item flex-list bg-theme-white theme-border"
            :class="{ 'look-open': currentLook }"
            tabindex="0"
            @keydown.enter="onAddTiming"
        >
            <BaseImageSizer fit="cover" class="image">
                <BaseVariantImage :variant="variant" size="sm" :key="variant.id" class="bg-shimmer" />
            </BaseImageSizer>

            <div class="flex-list flex-v justify details">
                <!-- TOP -->

                <div class="name-section flex-list flex-v lh-xs">
                    <div class="id ft-10 ft-md">#{{ product.datasource_id }}</div>
                    <div class="flex-list flex-v space-sm">
                        <div class="product-name ft-bd ft-14">
                            <span class="truncate">{{ product.name }}</span>
                        </div>
                        <div class="price flex-list center-v">
                            <div class="current-price ft-bd ft-10" v-if="product.yourPrice.wholesale_price">
                                {{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}
                            </div>
                            <div
                                class="old-price ft-10 ft-bd"
                                :class="{ 'ft-strike': !!product.yourPrice.wholesale_price }"
                            >
                                {{ product.yourPrice.recommended_retail_price }} {{ product.yourPrice.currency }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BOTTOM -->
                <div class="flex-list" v-if="variant">
                    <v-popover
                        trigger="click"
                        class="variant-selector"
                        ref="variantSelector"
                        :disabled="product.variants.length <= 1"
                    >
                        <button
                            class="color pill sm full-width color-button"
                            :class="{ multiple: product.variants.length > 1 }"
                        >
                            <span
                                class="circle xxs color-preview"
                                :style="{ backgroundImage: `url(${variantImage(variant)})` }"
                            ></span>
                            <span class="ft-bd truncate auto-right">{{ variant.name }}</span>
                            <i class="fas fa-caret-down" v-if="product.variants.length > 1"></i>
                        </button>
                        <BaseSelectButtons
                            header="Change color"
                            slot="popover"
                            type="radio"
                            :submitOnChange="true"
                            :options="product.variants"
                            :value="variantIndex"
                            optionValueKey="index"
                            optionNameKey="name"
                            v-model="variantIndex"
                            @submit="$refs.variantSelector.hide()"
                        />
                    </v-popover>
                </div>
            </div>
            <!-- ACTIONS  -->
            <div class="action-list flex-list center-v">
                <!-- Not editing look -->
                <template v-if="!currentLook">
                    <BaseButton
                        buttonClass="circle no-bg"
                        targetAreaPadding="4px"
                        @click="onCreateLook"
                        tabindex="-1"
                        v-tooltip="'Create a look'"
                    >
                        <i class="far fa-layer-group yellow"></i>
                    </BaseButton>
                    <BaseButton
                        buttonClass="no-bg circle"
                        targetAreaPadding="4px"
                        @click="onAddTiming"
                        tabindex="-1"
                        v-tooltip="'Add to timeline'"
                    >
                        <i class="far fa-plus primary"></i>
                    </BaseButton>
                </template>
                <!-- Editing look -->
                <BaseStateAlternatingButton
                    v-else
                    buttonClass="circle"
                    targetAreaPadding="4px"
                    @click="!inCurrentLook ? onAddToLook() : onRemoveFromLook()"
                    tabindex="-1"
                    :active="inCurrentLook"
                    :baseState="{
                        iconLeft: 'far fa-layer-group yellow',
                        nestedIconLeft: 'fas fa-plus pos-top pos-right dark',
                        tooltip: 'Add to look',
                    }"
                    :activeState="{
                        class: 'yellow',
                        iconLeft: 'far fa-layer-group white',
                        nestedIconLeft: 'fas fa-check pos-top pos-right white',
                    }"
                    :activeHoverState="{
                        class: 'red',
                        iconLeft: 'far fa-layer-group white',
                        nestedIconLeft: 'fas fa-times pos-top pos-right',
                        tooltip: 'Remove from look',
                    }"
                >
                    <!-- <i class="far fa-layer-group yellow"><i class="fas fa-plus pos-top pos-right dark"></i></i> -->
                </BaseStateAlternatingButton>
            </div>
            <!-- END ACTIONS  -->
        </div>
    </div>
    <!-- </Draggable> -->
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Draggable from 'vuedraggable'
import variantImage from '../../../../mixins/variantImage'

export default {
    name: 'SearchListItem',
    components: {
        Draggable,
    },
    props: ['product', 'focusIndex'],
    mixins: [variantImage],
    data() {
        return {
            variantIndex: 0,
        }
    },
    computed: {
        ...mapGetters('player', {
            videoDuration: 'getDuration',
        }),
        ...mapGetters('productGroups', {
            currentLook: 'getCurrentProductGroup',
        }),
        variant() {
            return this.product.variants[this.variantIndex]
        },
        inCurrentLook() {
            return this.currentLook.variantMaps.find(map => map.variant_id == this.variant.id)
        },
    },
    methods: {
        ...mapMutations('playPresentation', ['SET_SEARCH_ITEM_DRAG_ACTIVE', 'SET_TIMING_CLONE']),
        ...mapActions('playPresentation', ['addTiming']),
        ...mapActions('productGroups', ['addVariantMap', 'removeVariantMap']),
        ...mapActions('products', ['insertProducts']),
        async getSavedTimingProduct() {
            // Check if the product exists on Kollekt
            const existingProduct = this.$store.getters['products/getProducts'].find(
                product => product.datasource_id == this.product.datasource_id
            )

            let product = existingProduct ? existingProduct : this.product

            // Otherwise create it
            if (!this.product.id && !existingProduct) {
                product = await this.$store.dispatch('playPresentation/createKollektProductFromTiming', this.product)
            }

            return product
        },
        async onAddTiming() {
            const product = await this.getSavedTimingProduct()
            const variant = product.variants[this.variantIndex]

            const newTiming = {
                id: null,
                start_at_ms: 0,
                end_at_ms: this.videoDuration / 12,
                variants: [{ product_id: product.id, variant_id: variant.id }],
            }
            this.addTiming({ newTiming })
        },
        async onAddToLook() {
            const product = await this.getSavedTimingProduct()
            const variant = product.variants[this.variantIndex]

            this.addVariantMap({ productGroup: this.currentLook, variant })
        },
        async onCreateLook() {
            const product = await this.getSavedTimingProduct()
            const variant = product.variants[this.variantIndex]

            this.$emit('create-look', variant)
        },
        onRemoveFromLook() {
            this.removeVariantMap({ productGroup: this.currentLook, variant: this.variant })
        },
        async createKollektProduct() {
            // Create product
            const product = await this.insertProducts({
                file: this.$store.getters['playPresentation/getPresentation'],
                products: [this.product],
                addToState: true,
            })
            // Sync images
            this.$store.dispatch('files/syncExternalImages', {
                file: this.$store.getters['playPresentation/getPresentation'],
                products: [this.product],
            })
            // Fetch size ean for the product
            const productData = this.$store.dispatch('bonaparte/fetchProduct', product)
        },
    },
}
</script>

<style lang="scss" scoped>
.item-wrapper {
    margin-bottom: 4px;
}
.search-list-item {
    background: white;
    border-radius: $borderRadiusMd;
    padding: 8px;
    position: relative;
    height: 114px;
    &:not(.look-open) {
        &:hover,
        &:active {
            .action-list {
                &::v-deep {
                    button {
                        background: $themeLightBgHover;
                    }
                }
            }
        }
    }
    .image {
        width: 72px;
        border-radius: $borderRadiusMd;
        overflow: hidden;
    }
    .color-preview {
        background-size: 50000%;
        background-position: center;
    }
    .color-button {
        &:not(.multiple) {
            cursor: default;
        }
        .auto-right {
            margin-right: auto;
        }
    }
    .details {
        overflow: hidden;
        flex: 1;
        position: relative;
        .name-section {
            overflow: hidden;
            padding-left: 4px;
            margin-top: 4px;
            padding-right: 80px;
        }
    }
    .action-list {
        position: absolute;
        top: 8px;
        right: 8px;
    }
    .variant-selector {
        width: 100%;
        .pill {
            width: 100%;
            i {
                margin-left: auto !important;
                margin-right: 4px !important;
            }
        }
    }
}

// .product-search-list-item {
//     height: 138px;
//     padding: 8px;
//     display: flex;
//     border: solid $divider 1px;
//     border-radius: 4px;
//     background: white;
//     margin-bottom: 8px;
//     .name {
//         word-break: break-word;
//     }
//     img {
//         height: 120px;
//         width: 90px;
//         border-radius: 4px;
//         object-fit: contain;
//     }
//     .details {
//         padding: 8px 16px 0;
//         .title {
//             line-height: 1.4;
//             margin-left: 4px;
//         }
//         > * {
//             display: block;
//         }
//     }
//     .actions {
//         margin-left: auto;
//     }
//     .sortable-ghost & {
//         height: 100%;
//         width: 200px;
//         > * {
//             visibility: visible;
//         }
//         > .actions {
//             display: none;
//         }
//     }
//     .added-indicator {
//         cursor: pointer;
//         .hover {
//             display: none;
//         }
//         &:hover {
//             .default {
//                 display: none;
//             }
//             .hover {
//                 display: inline-block;
//             }
//         }
//     }
// }
</style>
