<template>
    <div class="drag-wrapper item-wrapper" :key="look.id">
        <div
            class="search-list-item drag-item flex-list bg-theme-white theme-border"
            tabindex="0"
            @keydown.enter="onAddTiming"
        >
            <BaseImageSizer fit="cover" class="image">
                <BaseVariantImage :variant="look.variantMaps[0].variant" size="sm" />
            </BaseImageSizer>

            <div class="flex-list flex-v justify details">
                <!-- TOP -->

                <div class="name-section flex-list flex-v lh-xs">
                    <div class="flex-list flex-v space-sm">
                        <div class="product-name ft-bd ft-14">
                            <span class="truncate">{{ look.name }}</span>
                        </div>
                        <div class="price flex-list center-v">
                            <div class="current-price ft-bd ft-10">
                                {{ look.yourPrice.wholesale_price }} {{ look.yourPrice.currency }}
                            </div>
                            <div class="old-price ft-strike ft-10 ft-bd">
                                {{ look.yourPrice.recommended_retail_price }} {{ look.yourPrice.currency }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BOTTOM -->
                <div class="flex-list" v-if="variant">
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
                        buttonClass="circle"
                        targetAreaPadding="4px"
                        @click="$emit('create-look', variant)"
                        tabindex="-1"
                        v-tooltip="'Create a look'"
                    >
                        <i class="far fa-layer-group yellow"></i>
                    </BaseButton>
                    <BaseButton
                        buttonClass="invisible circle ghost-hover"
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
                        class: 'yellow',
                        iconLeft: 'far fa-layer-group white',
                        nestedIconLeft: 'fas fa-times pos-top pos-right red',
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
    name: 'SearchListLook',
    components: {
        Draggable,
    },
    props: ['look', 'focusIndex'],
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
        onAddTiming() {
            const newTiming = {
                id: null,
                start_at_ms: 0,
                end_at_ms: this.videoDuration / 12,
                variants: [{ product_id: this.product.id, variant_id: this.variant.id }],
            }
            this.addTiming({ newTiming })
        },
        onAddToLook() {
            this.addVariantMap({ productGroup: this.currentLook, variant: this.variant })
        },
        onRemoveFromLook() {
            this.removeVariantMap({ productGroup: this.currentLook, variant: this.variant })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.item-wrapper {
    margin-bottom: 4px;
}
.search-list-item {
    background: white;
    border-radius: $borderRadiusMd;
    padding: 8px;
    position: relative;
    height: 114px;
    .image {
        width: 72px;
        border-radius: $borderRadiusMd;
        overflow: hidden;
    }
    .color-preview {
        background-size: 50000%;
        background-position: center;
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
</style>
