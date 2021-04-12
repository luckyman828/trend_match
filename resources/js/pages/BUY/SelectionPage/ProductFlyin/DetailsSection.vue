<template>
    <BaseFlyinColumn class="details-section">
        <BaseImageSizer fit="contain" class="main-img">
            <BaseVariantImage :variant="currentVariant" size="lg" />
            <div class="controls">
                <button class="white" @click="onShowLargeImage(index)">
                    <i class="far fa-search-plus"></i>
                </button>
            </div>
        </BaseImageSizer>
        <div class="variant-list form-element flex-list" v-horizontal-scroll="50" v-dragscroll>
            <div
                class="variant-list-item"
                v-for="variant in product.variants"
                :key="variant.id"
                :class="{ 'is-current': variant.id == currentVariant.id }"
            >
                <div class="header">
                    <span>
                        {{ variant.name }}
                    </span>
                </div>
                <div class="img-wrapper">
                    <BaseVariantImage :variant="variant" size="sm" @click.native="currentVariant = variant" />
                </div>
            </div>
        </div>

        <div class="form-element flex-list md center-v">
            <i class="row-icon fal fa-tags md"></i>
            <BaseValueDisplay label="WHS">
                <span> {{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }} </span>
            </BaseValueDisplay>
            <BaseValueDisplay label="RRP">
                <span>{{ product.yourPrice.recommended_retail_price }} {{ product.yourPrice.currency }}</span>
            </BaseValueDisplay>
            <BaseValueDisplay label="Mark Up">
                <span>{{ product.yourPrice.mark_up }}</span>
            </BaseValueDisplay>
        </div>

        <div class="form-element flex-list md center-v">
            <i class="row-icon fal fa-calendar md"></i>
            <BaseValueDisplay
                :label="`Delivery ${index + 1}`"
                v-for="(delivery, index) in product.delivery_dates"
                :key="index"
            >
                <span>{{ getPrettyDate(delivery, 'md') }}</span>
            </BaseValueDisplay>
        </div>

        <div
            class="form-element flex-list md center-v"
            v-if="product.min_order != null || product.min_variant_order != null"
        >
            <i class="row-icon fal fa-boxes md"></i>
            <BaseValueDisplay label="Order min." v-if="product.min_order != null">
                <span>{{ product.min_order }}</span>
            </BaseValueDisplay>
            <BaseValueDisplay label="Variant min." v-if="product.min_variant_order != null">
                <span>{{ product.min_variant_order }}</span>
            </BaseValueDisplay>
        </div>

        <div class="form-element flex-list md center-v">
            <i class="row-icon fal fa-flower md"></i>
            <BaseValueDisplay label="Composition">
                <span>{{ product.composition }}</span>
            </BaseValueDisplay>
        </div>

        <div class="form-element flex-list md center-v">
            <i class="row-icon fal fa-ruler md"></i>
            <BaseValueDisplay label="Box Sizes">
                <span>{{ product.assortment_sizes.join(', ') }}</span>
            </BaseValueDisplay>
        </div>

        <div class="form-element flex-list md center-v">
            <i class="row-icon fal fa-tshirt md"></i>
            <BaseValueDisplay label="Category">
                <span>{{ product.category }}</span>
            </BaseValueDisplay>
        </div>

        <div class="form-element flex-list md center-v">
            <i class="row-icon fal fa-palette md"></i>
            <BaseValueDisplay label="Assortments">
                <span>{{ product.assortments.map(x => `${x.name}`).join(',\n') }}</span>
            </BaseValueDisplay>
        </div>

        <div class="form-element flex-list md center-v">
            <i class="row-icon fal fa-info-circle md"></i>
            <BaseValueDisplay label="Description">
                <span>{{ product.sale_description }}</span>
            </BaseValueDisplay>
        </div>
    </BaseFlyinColumn>
</template>

<script>
import { mapMutations } from 'vuex'
import variantImage from '../../../../mixins/variantImage'

export default {
    name: 'detailsSection',
    mixins: [variantImage],
    props: ['product'],
    data() {
        return {
            currentVariant: null,
        }
    },
    watch: {
        product(newProduct) {
            if (!newProduct) return
            this.currentVariant = newProduct.variants[0]
        },
    },
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
    created() {
        if (this.product) {
            this.currentVariant = this.product.variants[0]
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
::v-deep {
    &.details-section {
        .body {
            padding: 8px 16px 64px;
        }
    }
}
.details-section {
    .main-img {
        width: 100%;
        position: relative;
        margin-bottom: 12px;
        img {
            border: $borderEl;
            border-radius: $borderRadiusEl;
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

    .row-icon {
        display: block;
        width: 24px;
        flex-shrink: 0;
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
            background: $borderColorEl;
            overflow: hidden;
            &:not(.is-current) {
                cursor: pointer;
            }
            &.is-current {
                border: solid 2px $primary;
                background: $primary;
                .header {
                    background: $primary;
                    color: white;
                }
            }
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
                background: white;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }
        }
    }
}
</style>
