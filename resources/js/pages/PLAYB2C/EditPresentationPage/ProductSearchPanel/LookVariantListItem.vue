<template>
    <div class="look-variant-list-item bg-theme-white theme-border interactable flex-list space-sm">
        <BaseImageSizer fit="cover" class="image">
            <BaseVariantImage :variant="variant" size="sm" />
        </BaseImageSizer>
        <div class="details right flex-list flex-v justify flex-1">
            <div class="top flex-list justify">
                <div class="name-wrapper">
                    <div class="name ft-bd ft-12 truncate">{{ variant.name }}</div>
                    <div class="price flex-list center-v truncate">
                        <CurrentPrice :variant="variant" />
                        <OldPrice :variant="variant" />
                    </div>
                </div>
                <div class="action-list" style="flex-shrink: 0">
                    <button class="circle sm remove-variant" @click="onRemoveVariant">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="circle no-bg ghost-hover sm drag-handle" v-if="look.variantMaps.length > 1">
                        <i class="fas fa-grip-vertical"></i>
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
                        v-model="variantMap.variant_id"
                        optionNameKey="name"
                        optionValueKey="id"
                        :disabledOptions="look.variantMaps.map(map => ({ id: map.variant_id }))"
                        @submit="$emit('change-variant')"
                    />
                </v-popover>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import variantImage from '../../../../mixins/variantImage'
import CurrentPrice from '../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../components/PLAY/prices/OldPrice'

export default {
    name: 'LookVariantListItem',
    components: {
        CurrentPrice,
        OldPrice,
    },
    mixins: [variantImage],
    props: ['variantMap', 'look'],
    computed: {
        ...mapGetters('playPresentation', {
            timings: 'getTimings',
            presentation: 'getPresentation',
        }),
        variant() {
            return this.variantMap.variant
        },
        product() {
            return this.variant.product
        },
        linkedTimings() {
            return this.timings.filter(timing => timing.product_group_id == this.look.id)
        },
    },
    methods: {
        ...mapActions('playPresentation', ['removeTimings']),
        ...mapActions('productGroups', ['removeVariantMap', 'deleteProductGroup']),
        async onRemoveVariant() {
            if (this.look.variantMaps.length <= 1 && this.linkedTimings.length > 0) {
                await this.removeTimings(this.linkedTimings)
            }
            this.removeVariantMap({ productGroup: this.look, variant: this.variant })
        },
    },
}
</script>

<style lang="scss" scoped>
.look-variant-list-item {
    padding: 8px;
    border-radius: $borderRadiusMd;
    user-select: none;
    margin-bottom: 8px;
    cursor: default;
    .image {
        width: 52px;
        border-radius: $borderRadiusMd;
        overflow: hidden;
        flex-shrink: 0;
    }
    .details {
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
    .remove-variant {
        opacity: 0;
        transition: 0.1s ease-in;
    }
    .drag-handle {
        cursor: grab;
    }
    &:hover {
        .remove-variant {
            opacity: 1;
        }
    }
}
</style>
