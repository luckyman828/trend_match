<template>
    <BaseDrawer position="bottom" :show="show" class="product-details-drawer" @close="$emit('close')">
        <template v-slot:header v-if="product">
            <CurrentTimingPreview class="current-timing-preview" />
            <div class="header-inner flex-list justify">
                <div class="flex-list flex-v sm">
                    <div class="brand">{{ product.brand }}</div>
                    <h3 class="product-name">{{ product.name }}</h3>
                </div>
                <div class="price">
                    <CurrentPrice class="ft-14" :product="product" />
                    <OldPrice class="ft-12" :product="product" />
                </div>
            </div>
        </template>
        <template v-slot:default v-if="product">
            <div class="body-inner form-wrapper">
                <ImageRail :variant="currentVariant" style="margin-bottom: 12px" />

                <VariantRail
                    class="form-element"
                    :product="product"
                    :currentVariant="currentVariant"
                    @show-variant="$event => (currentVariant = $event)"
                />

                <div class="form-element flex-list-item">
                    <label>Sizes</label>
                    <div class="size-list flex-list">
                        <div
                            class="true-square size"
                            :class="{ 'sold-out': !size.inStock }"
                            v-for="size in currentVariant.ean_sizes"
                            :key="size.ean"
                        >
                            {{ size.size }}
                        </div>
                    </div>
                </div>

                <h3>Style info</h3>

                <div class="form-element flex-list md">
                    <i class="fal fa-info-circle md"></i>
                    <div class="flex-list-item">
                        <label>Description</label>
                        <span class="value description"> {{ product.sale_description }}</span>
                    </div>
                </div>

                <div class="form-element flex-list md">
                    <i class="fal fa-flower md"></i>
                    <div class="flex-list-item">
                        <label>Composition</label>
                        <span class="value"> {{ product.composition }}</span>
                    </div>
                </div>

                <div class="form-element flex-list md">
                    <i class="fal fa-tshirt md"></i>
                    <div class="flex-list-item">
                        <label>Style number</label>
                        <span class="value"> {{ product.datasource_id }}</span>
                    </div>
                </div>
            </div>
            <AddToBasketSelector :item.sync="currentVariant" :show="true" />
        </template>
    </BaseDrawer>
</template>

<script>
import { mapGetters } from 'vuex'
import ImageRail from './ImageRail'
import VariantRail from './VariantRail'
import AddToBasketSelector from '../AddToBasketSelector'
import CurrentTimingPreview from './CurrentTimingPreview'
import CurrentPrice from '../../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../../components/PLAY/prices/OldPrice'

export default {
    name: 'play.productDetailsDrawer',
    components: { ImageRail, VariantRail, AddToBasketSelector, CurrentTimingPreview, CurrentPrice, OldPrice },
    props: ['show'],
    data: function() {
        return {
            currentVariant: null,
        }
    },
    computed: {
        ...mapGetters('playPresentation', {
            pdpItem: 'getPdpItem',
        }),
        product() {
            return this.pdpItem && this.pdpItem.product
        },
    },
    watch: {
        show(isVisible) {
            if (isVisible) {
                this.setCurrentVariant(this.pdpItem.variant ? this.pdpItem.variant : this.pdpItem.product.variants[0])
            }
        },
        pdpItem(newItem) {
            if (newItem) {
                this.setCurrentVariant(newItem.variant)
            }
        },
    },
    methods: {
        setCurrentVariant(variant) {
            this.currentVariant = variant
        },
    },
}
</script>

<style lang="scss" scoped>
.current-timing-preview {
    position: absolute;
    left: 8px;
    top: -8px;
    transform: translateY(-100%);
}
.product-details-drawer {
    line-height: 1.4;
    .brand {
        font-weight: 12px;
        font-weight: 700;
        color: $fontSoft;
    }
    .price {
        text-align: right;
    }
    .body-inner {
        padding: 0 16px 100px;
    }

    .form-element {
        margin-bottom: 40px;
    }
    .size {
        background: $grey300;
        border-color: $grey300;
        color: $fontBody;
        font-size: 900;
        position: relative;
        &.sold-out {
            opacity: 0.5;
            &::after {
                position: absolute;
                content: '|';
                font-weight: 500;
                font-size: 28px;
                left: 14px;
                top: 0px;
                transform: rotateZ(45deg);
            }
        }
    }
    .flex-list-item {
        min-width: 72px;
        > * {
            display: block;
            &:first-line {
                line-height: 1;
                white-space: normal;
            }
        }

        label {
            font-size: 11px;
            font-weight: 500;
            display: block;
            margin-bottom: 6px;
            color: $bluegrey600;
        }
        .value {
            font-size: 14px;
            font-weight: 700;
            &.description {
                white-space: pre-line;
                word-break: break-word;
                &:first-line {
                    line-height: 1.6;
                    // white-space: normal;
                }
            }
        }
    }
    .delivery-list {
        width: 100%;
        overflow: auto;
        padding-bottom: 8px;
        margin-bottom: 32px;
    }
}
</style>
