<template>
    <BaseFlyin placement="left" :show="show" class="product-details-flyin bg-theme-white" @close="$emit('close')">
        <template v-slot:header="slotProps" v-if="product">
            <div class="header-inner flex-list justify">
                <div class="flex-list flex-v space-min">
                    <div class="ft-10 ft-md ft-uppercase color-ft-soft">{{ product.brand }}</div>
                    <div class="ft-16 ft-bd">{{ product.name }}</div>
                </div>
                <button class="close circle" @click="slotProps.close()">
                    <i class="far fa-times"></i>
                </button>
            </div>
        </template>
        <template v-slot:default v-if="product">
            <div class="body-inner form-wrapper">
                <MainImageSection :variant="currentVariant" class="form-element" />

                <VariantRail
                    class="form-element"
                    :product="product"
                    :currentVariant="currentVariant"
                    @show-variant="setCurrentVariant($event)"
                />

                <div class="price flex-list center-v form-element">
                    <CurrentPrice :variant="currentVariant" class="ft-14" style="font-size: 14px;" />
                    <OldPrice :variant="currentVariant" class="ft-14" style="font-size: 14px;" />
                </div>

                <div class="form-element flex-list-item">
                    <label>Sizes</label>
                    <div class="size-list flex-list space-y-2">
                        <div
                            class="true-square size"
                            :class="{ 'sold-out': !size.inStock, 'selected' : size.size === selectedSize.size }"
                            v-for="size in currentVariant.ean_sizes"
                            :key="size.ean"
                            @click="onChangeSize(size)"
                        >
                            {{ size.size }}
                        </div>
                    </div>
                </div>

                <div class="flex-list flex-v space-lg">
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
            </div>
            <AddToBasketSelector class="add-to-basket-bar" :variant="currentVariant" :size="selectedSize" :show="true" @submit="selectedSize=$event"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters } from 'vuex'
import MainImageSection from './MainImageSection'
import VariantRail from './VariantRail'
import AddToBasketSelector from '../AddToBasketSelector'
import CurrentPrice from '../../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../../components/PLAY/prices/OldPrice'

export default {
    name: 'productDetailsFlyin',
    components: { MainImageSection, VariantRail, AddToBasketSelector, CurrentPrice, OldPrice },
    props: ['show'],
    data: function() {
        return {
            currentVariant: null,
            selectedSize: {}, 
        }
    },
    computed: {
        ...mapGetters('playPresentation', {
            pdpItem: 'getPdpItem',
        }),
        product() {
            if (!this.pdpItem) return
            return this.pdpItem.product
        },
    },
    methods: {
        setCurrentVariant(variant) {
            this.currentVariant = variant
            this.selectedSize = {}
        },
        onChangeSize(size) {
            this.selectedSize = size
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
}
</script>

<style lang="scss" scoped>
.product-details-flyin {
    line-height: 1.4;
    background: white;
    &::v-deep {
        .flyin {
            min-width: 0;
            width: 384px;
            .flyin-inner {
                background: white;
            }
        }
        .overlay {
            opacity: 0;
        }
    }
    .header-inner {
        padding: 8px 8px 0 16px;
    }
    .body-inner {
        padding: 0 0 100px;
    }

    .form-element {
        margin-bottom: 16px;
    }
    .size {
        background: $grey300;
        border-color: $grey300;
        color: $fontBody;
        font-size: 900;
        position: relative;
        cursor: pointer;
        &.selected {
            background: $almostBlack;
            color: $grey300;
        }
        &.sold-out {
            opacity: 0.5;
            pointer-events: none;
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
    .add-to-basket-selector {
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 8px;
    }
}
</style>
