<template>
    <BaseFlyin class="product-details-sidebar form-wrapper" placement="left" :show="show" @close="$emit('close')">
        <div class="flex-list justify">
            <h3 class="name">{{ product.title }}</h3>
            <div class="flex-list sm">
                <div class="pill xs dark" v-if="product.min_order != null">
                    <i class="far fa-box"></i>
                    <span>{{ product.min_order }}</span>
                </div>
                <div class="pill xs dark" v-if="product.min_variant_order != null">
                    <i class="far fa-tshirt"></i>
                    <span>{{ product.min_variant_order }}</span>
                </div>
            </div>
        </div>
        <span class="id">#{{ product.datasource_id }}</span>

        <div class="variant-list form-element flex-list" v-horizontal-scroll="50" v-dragscroll>
            <div class="variant-list-item" v-for="(variant, index) in product.variants" :key="variant.id">
                <div class="header">
                    <span>
                        {{ variant.name }}
                    </span>
                </div>
                <div class="img-wrapper">
                    <BaseVariantImage :variant="variant" size="sm" />
                    <div class="controls">
                        <button class="white" @click="onShowLargeImage(index)">
                            <i class="far fa-search-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-element flex-list md">
            <i class="fal fa-tags md"></i>
            <div class="list-item">
                <label>WHS</label>
                <span class="value"> {{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }} </span>
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

        <div class="form-element flex-list md" v-if="product.min_order != null || product.min_variant_order != null">
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
                <span class="value description"> {{ product.assortments.map(x => `${x.name}`).join(',\n') }}</span>
            </div>
        </div>

        <div class="form-element flex-list md">
            <i class="fal fa-info-circle md"></i>
            <div class="list-item">
                <label>Description</label>
                <span class="value description"> {{ product.sale_description }}</span>
            </div>
        </div>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'productDetailsSidebar',
    props: ['product', 'show'],
    computed: {},
    methods: {
        ...mapMutations('lightbox', ['SET_LIGHTBOX_VISIBLE', 'SET_LIGHTBOX_IMAGES', 'SET_LIGHTBOX_IMAGE_INDEX']),
        onShowLargeImage(index) {
            const images = []
            this.product.variants.map((variant, variantIndex) => {
                if (variantIndex == index) {
                    this.SET_LIGHTBOX_IMAGE_INDEX(images.length)
                }
                images.push(...variant.pictures.map(picture => picture.url))
            })
            this.SET_LIGHTBOX_IMAGES(images)
            this.SET_LIGHTBOX_VISIBLE(true)
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.product-details-sidebar {
    ::v-deep {
        .flyin {
            width: 400px;
            min-width: 0;
            background: white;
            border-radius: 0 12px 12px 0;
            z-index: 1;
            .body {
                padding-bottom: 300px;
            }
        }
        .overlay {
            z-index: 0;
            background: none;
        }
    }

    .name {
        margin: 0;
    }
    .id {
        margin: 4px 0 20px;
        display: block;
    }

    .form-element {
        margin-bottom: 40px;
    }

    .variant-list {
        width: 100%;
        overflow: auto;
        padding-bottom: 8px;
        margin-bottom: 20px;
        &::-webkit-scrollbar-track {
            border-radius: 4px;
        }
        .variant-list-item {
            width: 100px;
            min-width: 100px;
            border: $borderEl;
            border-radius: $borderRadiusEl;
            .header {
                overflow: hidden;
                padding: 0 6px;
                height: 24px;
                font-size: 12px;
                font-weight: 500;
                display: flex;
                align-items: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                span {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    display: block;
                    overflow: hidden;
                }
            }
            .name {
                font-weight: 700;
                display: block;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            .img-wrapper {
                position: relative;
                height: 0;
                padding-top: 133.3333%;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                .controls {
                    opacity: 0;
                    transition: 0.1s ease-out;
                    position: absolute;
                    right: 4px;
                    top: 4px;
                    z-index: 1;
                }
                &:hover {
                    .controls {
                        opacity: 1;
                    }
                }
            }
        }
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
