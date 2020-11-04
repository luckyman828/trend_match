<template>
    <div class="product-details-sidebar" v-if="product" :class="{ mobile: isMobile }">
        <!-- DESKTOP -->
        <template v-if="!isMobile">
            <div class="background"></div>
            <div id="sneakpeak-spawner">
                <div class="sneakpeak" ref="sneakpeak">
                    <div class="name-block">
                        <span class="name">{{ product.name }}</span>
                        <span class="id">#{{ product.datasource_id }}</span>
                    </div>
                    <div class="flex-list">
                        <div class="pill dark xs" v-if="product.min_order">
                            <i class="fas fa-box"></i>
                            <span>{{ product.min_order }}</span>
                        </div>
                        <div class="pill dark xs" v-if="product.min_variant_order">
                            <i class="fas fa-tshirt"></i>
                            <span>{{ product.min_variant_order }}</span>
                        </div>
                        <div class="pill dark xs" v-if="product.is_sustainable">
                            <i class="fas fa-seedling"></i>
                            <span>sustainable</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="body">
                <div class="price-list flex-list md col-2">
                    <BaseDisplayField label="WHS" v-if="product.yourPrice.wholesale_price">
                        <span>{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</span>
                    </BaseDisplayField>
                    <BaseDisplayField label="RRP" v-if="product.yourPrice.recommended_retail_price">
                        <span>{{ product.yourPrice.recommended_retail_price }} {{ product.yourPrice.currency }}</span>
                    </BaseDisplayField>
                </div>

                <div class="flex-list md col-2">
                    <BaseDisplayField label="Minimum" v-if="product.min_order">
                        <span
                            >{{ product.min_variant_order ? product.min_variant_order + '/' : ''
                            }}{{ product.min_order }} PCS</span
                        >
                    </BaseDisplayField>
                    <BaseDisplayField label="Delivery" v-if="product.delivery_dates[0]">
                        <span>{{ getPrettyDate(product.delivery_dates[0]) }}</span>
                    </BaseDisplayField>
                </div>

                <div class="variant-list flex-list" v-dragscroll>
                    <div class="list-item" v-for="(variant, index) in product.variants" :key="index">
                        <div class="flex-list flex-v sm">
                            <span class="name">{{ variant.name }}</span>
                            <div class="img-wrapper">
                                <div class="controls">
                                    <button class="white" @click="onShowLargeImage(index)">
                                        <i class="far fa-search-plus"></i>
                                    </button>
                                </div>
                                <BaseVariantImage :variant="variant" size="sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-list flex-v md">
                    <BaseDisplayField label="Description">
                        <span v-if="product.sale_description">{{ product.sale_description }}</span>
                    </BaseDisplayField>
                    <BaseDisplayField label="Composition">
                        <span v-if="product.composition">{{ product.composition.split(', ').join('\n') }}</span>
                    </BaseDisplayField>
                    <BaseDisplayField label="Sizes">
                        <span v-if="product.variants[0]">{{ product.variants[0].sizes.join(', ') }}</span>
                    </BaseDisplayField>
                </div>
            </div>
        </template>

        <!-- MOBILE -->
        <template v-else>
            <div id="sneakpeak-spawner">
                <div class="sneakpeak" ref="sneakpeak">
                    <div class="img-wrapper">
                        <div class="controls">
                            <button class="white" @click="onShowLargeImage(index)">
                                <i class="far fa-search-plus"></i>
                            </button>
                        </div>
                        <BaseVariantImage :variant="product.variants[0]" size="sm" />
                    </div>
                    <span class="price">{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'productDetailsSidebar',
    computed: {
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
        }),
        ...mapGetters('responsive', {
            isMobile: 'getIsMobile',
        }),
    },
    watch: {
        product(newVal, oldVal) {
            if (!newVal) return
            if (!oldVal || newVal.id != oldVal.id) {
                // Make a copy of the old element and insert
                const container = document.getElementById('sneakpeak-spawner')
                const el = this.$refs.sneakpeak
                if (el) {
                    el.classList.add('hide')
                    // Wait for next tick to get the updated sneakpeak
                    this.$nextTick(() => {
                        const newClone = el.cloneNode(true)
                        newClone.classList.add('new-clone')
                        newClone.classList.remove('hide')
                        container.appendChild(newClone)
                        setTimeout(() => {
                            el.classList.remove('hide')
                            newClone.remove()
                        }, 200)
                    })
                }
            }
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
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.product-details-sidebar {
    position: absolute;
    width: 384px;
    left: 0;
    top: 0;
    // height: 100%;
    // height: calc(100% - #{$heightPlayerControls} - 8px);
    height: calc(100% - #{$heightPlayerControls} - 8px - 80px);
    display: flex;
    flex-direction: column;
    pointer-events: all;
    z-index: 1;
    .background {
        height: calc(100%);
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: white;
        transform: translateY(-100%);
        transition: transform 0.2s ease-out, opacity 0.2s ease-in;
        z-index: -1;
        opacity: 0;
    }
    &:hover {
        height: calc(100% - #{$heightPlayerControls} - 8px);
        .background {
            transform: none;
            opacity: 1;
        }
        .body {
            opacity: 1;
        }
    }
}
label {
    font-weight: 700;
    font-size: 12px;
    display: block;
    margin-bottom: 4px;
    &.sm {
        font-size: 8px;
        color: $fontSoft;
        margin-bottom: 2px;
    }
}

.sneakpeak {
    display: flex;
    background: white;
    margin: 16px;
    margin-left: 12px;
    padding: 8px;
    border-radius: 4px;
    animation: 0.2s ease-out flyin;
    width: 356px;
    &.hide {
        visibility: hidden;
    }
    // animation-iteration-count: 1;
    &.old-clone,
    &.new-clone {
        position: absolute;
        top: 0;
    }
    &.old-clone {
        animation: none;
    }
    .name-block {
        margin-right: 20px;
        overflow: hidden;
    }
    .name {
        font-size: 16px;
        font-weight: 700;
        display: block;
        margin-bottom: 4px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .id {
        font-size: 14px;
        display: block;
    }
}
.body {
    opacity: 0;
    transition: opacity 0.1s ease-in;
    overflow: auto;
    flex: 1;
    padding: 0 16px 240px 20px;
}
.price-list {
    margin-bottom: 16px;
}
.variant-list {
    margin-top: 20px;
    margin-bottom: 40px;
    overflow: auto;
    padding-bottom: 8px;
    .name {
        font-size: 10px;
        font-weight: 500;
        height: 12px;
    }
    .img-wrapper {
        width: 90px;
        height: 120px;
        overflow: hidden;
        border-radius: $borderRadiusEl;
        border: $borderEl;
        position: relative;
        img {
            height: 100%;
            width: 100%;
            object-fit: cover;
            // Make not draggable
            user-drag: none;
            user-select: none;
            -moz-user-select: none;
            -webkit-user-drag: none;
            -webkit-user-select: none;
            -ms-user-select: none;
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
@keyframes flyin {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: none;
    }
}

.product-details-sidebar.mobile {
    #sneakpeak-spawner {
        position: absolute;
        right: 0;
        bottom: 0;
        .sneakpeak {
            background: white;
            border-radius: 4px;
            position: absolute;
            right: 12px;
            bottom: 60px;
            display: flex;
            flex-direction: column;
            position: relative;
            width: 80px;
            .img-wrapper {
                padding-top: 133.33%;
                height: 0;
                position: relative;
                img {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    -o-object-fit: cover;
                    object-fit: cover;
                    user-drag: none;
                    user-select: none;
                    -moz-user-select: none;
                    -webkit-user-drag: none;
                    -webkit-user-select: none;
                    -ms-user-select: none;
                }
            }
            .price {
                font-weight: 700;
            }
            .controls {
                opacity: 0;
                transition: 0.1s ease-out;
                position: absolute;
                right: 4px;
                top: 4px;
                z-index: 1;
            }
            &:focus {
                .controls {
                    opacity: 1;
                }
            }
        }
    }
}
</style>
