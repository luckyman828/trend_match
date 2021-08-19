<template>
    <div class="drag-wrapper item-wrapper" :key="look.id">
        <div
            class="search-list-item drag-item flex-list bg-theme-white theme-border"
            :class="contextMenuVisible && 'focus'"
            tabindex="0"
            @keydown.enter.self="onAddTiming"
        >
            <BaseImageSizer fit="cover" class="image" @click.native="$emit('edit-look', look)">
                <div class="resize-target picture-collage" :class="`size-${look.variantMaps.slice(0, 4).length}`">
                    <BaseVariantImage
                        :variant="variantMap.variant"
                        size="sm"
                        v-for="variantMap in look.variantMaps.slice(0, 4)"
                        :key="variantMap.variant_id"
                    />
                </div>
                <div v-if="look.variantMaps.length > 4" class="pill dark extra-count xs w-sm">
                    <span>+ {{ look.variantMaps.slice(4).length }}</span>
                </div>
            </BaseImageSizer>

            <div class="flex-list flex-v justify details" style="margin-right: 0">
                <!-- TOP -->

                <div class="name-section flex-list flex-v lh-xs">
                    <div class="flex-list flex-v space-sm">
                        <div class="product-name ft-bd ft-14">
                            <span class="line-clamp-3" v-if="!editName">{{ look.name }}</span>
                            <BaseTextarea
                                v-else
                                class="name ft-14 ft-bd input-wrapper"
                                @click.native.stop
                                v-model="look.name"
                                ref="nameInput"
                                :inheritStyles="false"
                                :focusOnMount="true"
                                :selectOnFocus="true"
                                @blur="editName = false"
                                @submit="
                                    onSaveLook()
                                    editName = false
                                "
                            />
                        </div>
                    </div>
                </div>

                <!-- BOTTOM -->
                <div class="flex-list justify" v-if="variant">
                    <div class="price flex-list center-v">
                        <div class="current-price ft-bd ft-10">
                            {{ look.yourPrice.wholesale_price }} {{ look.yourPrice.currency }}
                        </div>
                        <div class="old-price ft-strike ft-10 ft-bd">
                            {{ look.yourPrice.recommended_retail_price }} {{ look.yourPrice.currency }}
                        </div>
                    </div>
                    <div class="pill no-bg xs dark">
                        <i class="fas fa-tshirt"></i>
                        <span>{{ look.variantMaps.length }}</span>
                    </div>
                </div>
            </div>
            <!-- ACTIONS  -->
            <div class="action-list flex-list center-v">
                <BaseButton
                    v-if="isCurrentLook"
                    buttonClass="circle"
                    targetAreaPadding="4px"
                    @click="$emit('edit-look', null)"
                    tabindex="-1"
                    v-tooltip="'Done'"
                >
                    <i class="far fa-check"></i>
                </BaseButton>
                <BaseButton
                    v-else
                    buttonClass="circle"
                    targetAreaPadding="4px"
                    @click="$emit('edit-look', look)"
                    tabindex="-1"
                    v-tooltip="'Edit look'"
                >
                    <i class="far fa-pen"></i>
                </BaseButton>

                <BaseButton
                    buttonClass="no-bg circle ghost-hover"
                    targetAreaPadding="4px"
                    @click="onAddTiming"
                    :disabled="look.variants.length <= 0"
                    disabledTooltip="Can't add an empty look"
                    tabindex="-1"
                    v-tooltip="'Add to timeline'"
                >
                    <i class="far fa-plus primary"></i>
                </BaseButton>
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
    props: ['look', 'focusIndex', 'contextMenuVisible'],
    mixins: [variantImage],
    data() {
        return { editName: false }
    },
    computed: {
        ...mapGetters('player', {
            videoDuration: 'getDuration',
        }),
        ...mapGetters('productGroups', {
            currentLook: 'getCurrentProductGroup',
        }),
        ...mapGetters('playPresentation', {
            presentation: 'getPresentation',
        }),
        variant() {
            return this.look.variantMaps[0]
        },
        isCurrentLook() {
            return this.currentLook && this.look.id == this.currentLook.id
        },
    },
    methods: {
        ...mapMutations('playPresentation', ['SET_SEARCH_ITEM_DRAG_ACTIVE', 'SET_TIMING_CLONE']),
        ...mapActions('playPresentation', ['addTiming']),
        ...mapActions('productGroups', ['addVariantMap', 'removeVariantMap', 'insertOrUpdateProductGroup']),
        onAddTiming() {
            const newTiming = {
                id: null,
                start_at_ms: 0,
                end_at_ms: this.videoDuration / 12,
                variants: [],
                product_group_id: this.look.id,
            }
            this.addTiming({ newTiming })
        },
        onAddToLook() {
            this.addVariantMap({ productGroup: this.currentLook, variant: this.variant })
        },
        onRemoveFromLook() {
            this.removeVariantMap({ productGroup: this.currentLook, variant: this.variant })
        },
        onSaveLook() {
            this.insertOrUpdateProductGroup({ fileId: this.presentation.id, productGroup: this.look })
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
    &.focus {
        border-color: $primary;
    }
    .image {
        width: 72px;
        border-radius: $borderRadiusMd;
        overflow: hidden;
        cursor: pointer;
        .extra-count {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        img {
            // transition: opacity 0.1s ease-in;
        }
        &:hover {
            img {
                opacity: 0.7;
            }
        }
    }
    .picture-collage {
        display: grid;
        gap: 2px;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        > * {
            height: 100%;
            width: 100%;
            overflow: hidden;
            object-fit: cover;
            border-radius: $borderRadiusSm;
        }
        &.size-1 {
            grid-template-areas:
                'main main'
                'main main';
            > * {
                grid-area: main;
            }
        }
        &.size-2 {
            grid-template-areas:
                'top top'
                'bottom bottom';
            > :nth-child(1) {
                grid-area: top;
            }
            > :nth-child(2) {
                grid-area: bottom;
            }
        }
        &.size-3 {
            grid-template-areas:
                'top top'
                'bottom-left bottom-right';
            > :nth-child(1) {
                grid-area: top;
            }
            > :nth-child(2) {
                grid-area: bottom-left;
            }
            > :nth-child(3) {
                grid-area: bottom-right;
            }
        }
        &.size-4 {
            grid-template-areas:
                'top-left top-right'
                'bottom-left bottom-right';
            > :nth-child(1) {
                grid-area: top-left;
            }
            > :nth-child(2) {
                grid-area: top-right;
            }
            > :nth-child(3) {
                grid-area: bottom-left;
            }
            > :nth-child(4) {
                grid-area: bottom-right;
            }
        }
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
