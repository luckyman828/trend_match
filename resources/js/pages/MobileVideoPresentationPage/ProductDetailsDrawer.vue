<template>
    <BaseDrawer position="bottom" :show="show" class="product-details-drawer" @close="$emit('close')">
        <template v-slot:header v-if="product">
            <div class="header-inner flex-list justify">
                <h3 class="product-name">{{ product.name }}</h3>
                <span class="price">{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</span>
            </div>
        </template>
        <template v-slot:default v-if="product">
            <div class="body-inner form-wrapper">
                <div class="variant-list form-element">
                    <div class="image-rail" :class="{ center: product.variants.length <= 1 }">
                        <BaseVariantImage
                            class="variant-image"
                            v-for="variant in product.variants"
                            :key="variant.id"
                            :variant="variant"
                            size="sm"
                        />
                    </div>
                    <!-- <div class="pagination" v-for="variant in product.variants" :key="variant.id"></div> -->
                </div>
                <div class="form-element flex-list md">
                    <i class="fal fa-tags md"></i>
                    <div class="list-item">
                        <label>WHS</label>
                        <span class="value">
                            {{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}
                        </span>
                    </div>
                    <div class="list-item">
                        <label>RRP</label>
                        <span class="value">
                            {{ product.yourPrice.recommended_retail_price }} {{ product.yourPrice.currency }}
                        </span>
                    </div>
                    <div class="list-item">
                        <label>Mark Up</label>
                        <span class="value">
                            {{ product.yourPrice.mark_up }}
                        </span>
                    </div>
                </div>

                <div class="form-element flex-list md">
                    <i class="fal fa-calendar md"></i>
                    <div class="list-item" v-for="(delivery, index) in product.delivery_dates" :key="index">
                        <label>Delivery {{ index + 1 }}</label>
                        <span class="value">
                            {{ getPrettyDate(delivery, 'md') }}
                        </span>
                    </div>
                </div>

                <div
                    class="form-element flex-list md"
                    v-if="product.min_order != null || product.min_variant_order != null"
                >
                    <i class="fal fa-boxes md"></i>
                    <div class="list-item" v-if="product.min_order != null">
                        <label>Order min.</label>
                        <span class="value"> {{ product.min_order }} PCS </span>
                    </div>
                    <div class="list-item" v-if="product.min_variant_order != null">
                        <label>Variant min.</label>
                        <span class="value"> {{ product.min_variant_order }} PCS </span>
                    </div>
                </div>

                <div class="form-element flex-list md">
                    <i class="fal fa-flower md"></i>
                    <div class="list-item">
                        <label>Composition</label>
                        <span class="value"> {{ product.composition }}</span>
                    </div>
                </div>

                <div class="form-element flex-list md">
                    <i class="fal fa-ruler md"></i>
                    <div class="list-item">
                        <label>Box Sizes</label>
                        <span class="value"> {{ product.assortment_sizes.join(', ') }}</span>
                    </div>
                </div>

                <div class="form-element flex-list md">
                    <i class="fal fa-tshirt md"></i>
                    <div class="list-item">
                        <label>Category</label>
                        <span class="value"> {{ product.category }}</span>
                    </div>
                </div>

                <div class="form-element flex-list md">
                    <i class="fal fa-palette md"></i>
                    <div class="list-item">
                        <label>Assortments</label>
                        <span class="value description">
                            {{ product.assortments.map(x => `${x.name}`).join(',\n') }}</span
                        >
                    </div>
                </div>

                <div class="form-element flex-list md">
                    <i class="fal fa-info-circle md"></i>
                    <div class="list-item">
                        <label>Description</label>
                        <span class="value description"> {{ product.sale_description }}</span>
                    </div>
                </div>
            </div>
        </template>
    </BaseDrawer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'productDetailsDrawer',
    props: ['show', 'product'],
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.product-details-drawer {
    pointer-events: all;
    line-height: 1.4;
    .product-name {
        max-width: 50%;
        margin: 0;
        font-size: 16px;
        font-weight: 700;
    }
    .price {
        font-size: 14px;
        font-weight: 500;
    }
    .body-inner {
        padding: 16px;
    }
    .variant-list {
        .image-rail {
            display: flex;
            margin-left: 16px;
            overflow: auto;
            .variant-image {
                width: 270px;
                height: 360px;
                object-fit: cover;
                margin-right: 12px;
                border-radius: 2px;
                overflow: hidden;
            }
            &::after {
                content: '';
                height: 1px;
                width: 16px;
                display: block;
            }
            &.center {
                margin: 0;
                .variant-image {
                    margin: auto;
                }
            }
        }
    }
    .form-element {
        margin-bottom: 40px;
    }
    .list-item {
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
            font-weight: 400;
            display: block;
            margin-bottom: 6px;
            color: $bluegrey500;
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
}
</style>
