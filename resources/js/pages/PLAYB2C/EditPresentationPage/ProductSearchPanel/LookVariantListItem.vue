<template>
    <div class="look-variant-list-item bg-theme-white theme-border interactable flex-list space-sm">
        <BaseImageSizer fit="cover" class="image">
            <BaseVariantImage :variant="variant" size="sm" />
        </BaseImageSizer>
        <div class="right flex-list flex-v justify flex-1">
            <div class="top flex-list justify">
                <div class="name-wrapper">
                    <div class="name ft-bd ft-12 truncate">{{ variant.name }}</div>
                    <div class="price flex-list center-v truncate">
                        <div class="current-price ft-bd ft-10">
                            {{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}
                        </div>
                        <div class="old-price ft-strike ft-10 ft-bd truncate">
                            {{ product.yourPrice.recommended_retail_price }} {{ product.yourPrice.currency }}
                        </div>
                    </div>
                </div>
                <div class="action-list" style="flex-shrink: 0">
                    <button class="circle sm">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="circle invisible ghost-hover sm">
                        <i class="far fa-grip-vertical"></i>
                    </button>
                </div>
            </div>
            <div class="bottom">
                <v-popover trigger="click" class="variant-selector" ref="variantSelector">
                    <div class="color pill sm full-width">
                        <span
                            class="circle xxs color-preview"
                            :style="{ backgroundImage: `url(${variantImage(variant)})` }"
                        ></span>
                        <span class="ft-bd truncate">{{ variant.name }}</span>
                        <i class="fas fa-caret-down"></i>
                    </div>
                    <BaseSelectButtons
                        header="Change color"
                        slot="popover"
                        type="radio"
                        :submitOnChange="true"
                        :options="product.variants"
                        :value="variant"
                        optionNameKey="name"
                        @submit="onChangeVariant"
                    />
                </v-popover>
            </div>
        </div>
    </div>
</template>

<script>
import variantImage from '../../../../mixins/variantImage'

export default {
    name: 'LookVariantListItem',
    props: ['variant', 'look'],
    mixins: [variantImage],
    computed: {
        product() {
            return this.variant.product
        },
    },
    methods: {
        onChangeVariant(newVariant) {
            this.look.variants[this.variant.index].variant_id = newVariant.id
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.look-variant-list-item {
    padding: 8px;
    border-radius: $borderRadiusMd;
    .image {
        width: 52px;
        border-radius: $borderRadiusMd;
        overflow: hidden;
    }
    .name-wrapper {
        overflow: hidden;
        padding-left: 4px;
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
</style>
