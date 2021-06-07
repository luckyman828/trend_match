<template>
    <div class="edit-look-popover bg-theme-white theme-border">
        <div class="header flex-list justify">
            <div class="name-wrapper">
                <span
                    v-if="!editName"
                    class="name ft-14 ft-bd line-clamp-2"
                    v-tooltip="!lookIsSaved && 'Editing look name, will save it as a look to the file'"
                    @click="editName = true"
                    >{{ look.name }} <i class="edit-icon far fa-pen"></i
                ></span>
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
            <div class="right flex-list flex-v flex-end-h flex-start-v">
                <div class="count flex-list flex-end-h">
                    <div class="pill dark xs ">
                        <i class="fas fa-tshirt"></i>
                        <span>{{ look.variantMaps.length }}</span>
                    </div>
                </div>
                <div class="total-price ft-10 ft-bd">
                    {{ totalPrice | rounded(2) }}
                    <span class="currency" v-if="look.variantMaps.length > 0">{{
                        look.variantMaps[0].product.yourPrice.currency
                    }}</span>
                </div>
            </div>
        </div>
        <div class="body">
            <Draggable class="variant-list" v-model="look.variantMaps" @end="onSaveLook">
                <LookVariantListItem
                    v-for="variantMap in look.variantMaps"
                    :key="variantMap.variant_id"
                    :variantMap="variantMap"
                    :look="look"
                    @change-variant="onSaveLook"
                />
            </Draggable>
        </div>
        <div class="footer flex-list">
            <button
                class="pill auto-right sm"
                v-show-contextmenu="{ trigger: 'click', ref: 'moreContext', placement: 'right' }"
            >
                <i class="far fa-ellipsis-h primary"></i>
            </button>

            <button v-if="!linkedTiming" class="pill sm" @click="onAddTiming">
                <i class="far fa-plus"></i>
                <span>To timeline</span>
            </button>
            <!-- EDITING TIMING -->
            <template v-else>
                <button class="pill sm" @click="onClose">
                    <i class="far fa-check"></i>
                    <span>Done</span>
                </button>
            </template>
        </div>

        <BaseContextMenu ref="moreContext" class="more-context">
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-times" hotkey="keyC" @click="onClose">
                    <u>C</u>ancel
                </BaseContextMenuItem>
            </div>
            <div
                class="item-group"
                :class="{ disabled: !lookIsSaved }"
                v-tooltip="!lookIsSaved && 'Save look before you can edit it'"
            >
                <BaseContextMenuItem iconClass="far fa-pen" hotkey="KeyR" @click="editName = true">
                    <u>R</u>ename
                </BaseContextMenuItem>
            </div>
            <div class="item-group" v-if="lookIsSaved || look.timingId">
                <BaseContextMenuItem iconClass="far fa-trash" hotkey="KeyD" @click="onDeleteLook">
                    <u>D</u>elete look
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseDialog ref="confirmDeleteDialog" type="confirm" confirmColor="red" confirmText="Yes, delete it">
            <div class="icon-graphic">
                <i class="lg primary far fa-layer-group"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>A video timing is linked to this look</h3>
            <p>Deleting this look, will cause any linked video timings to also be deleted</p>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import LookVariantListItem from './LookVariantListItem'
import Draggable from 'vuedraggable'

export default {
    name: 'EditLookPopover',
    components: { LookVariantListItem, Draggable },
    data() {
        return {
            editName: false,
        }
    },
    computed: {
        ...mapGetters('productGroups', {
            look: 'getCurrentProductGroup',
            looks: 'getProductGroups',
        }),
        ...mapGetters('playPresentation', {
            timings: 'getTimings',
            presentation: 'getPresentation',
        }),
        totalPrice() {
            return this.look.variantMaps.reduce((total, curr) => {
                return (total += curr.product.yourPrice.recommended_retail_price)
            }, 0)
        },
        linkedTiming() {
            return this.timings.find(timing => timing.product_group_id == this.look.id)
        },
        variantMapLength() {
            return this.look.variantMaps.length
        },
        lookIsSaved() {
            return this.looks.find(look => look.id == this.look.id)
        },
    },
    watch: {
        variantMapLength() {
            this.onSaveLook()
        },
    },
    methods: {
        ...mapActions('playPresentation', ['addTiming', 'updateTiming', 'removeTiming', 'updatePresentation']),
        ...mapActions('productGroups', ['insertOrUpdateProductGroup', 'deleteProductGroup']),
        ...mapMutations('productGroups', ['SET_CURRENT_GROUP']),
        async onAddTiming() {
            const newTiming = {
                id: null,
                start_at_ms: null,
                end_at_ms: null,
                variants: JSON.parse(JSON.stringify(this.look.variantMaps)),
            }
            await this.addTiming({ newTiming })
            this.SET_CURRENT_GROUP(newTiming.productGroup)
        },
        async onSaveLook() {
            await this.insertOrUpdateProductGroup({ fileId: this.presentation.id, productGroup: this.look })
        },
        onClose() {
            this.SET_CURRENT_GROUP(null)
        },
        async onDeleteLook() {
            const linkedTimings = this.timings.filter(timing => timing.product_group_id == this.look.id)
            if (!linkedTimings.length > 0 || (await this.$refs.confirmDeleteDialog.confirm())) {
                linkedTimings.map(linkedTiming => {
                    const index = this.timings.findIndex(timing => timing.id == linkedTiming.id)
                    this.removeTiming(index)
                })

                this.deleteProductGroup({ fileId: this.presentation.id, productGroup: this.look })
            }
            this.onClose()
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.edit-look-popover {
    border-radius: $borderRadiusMd;
    position: absolute;
    width: 280px;
    top: 8px;
    left: 360px;
    padding: 16px;
    z-index: 9;
    .header {
        margin-bottom: 12px;
    }
    .body {
        max-height: 380px;
        overflow-y: scroll;
        padding-right: 10px;
        margin-right: -14px;
    }
    .name-wrapper {
        overflow: hidden;
        cursor: pointer;
        .name {
            font-size: 14px;
            font-weight: 800;
        }
        .edit-icon {
            opacity: 0;
            transition: 0.2s ease-out;
        }
        &:hover {
            .edit-icon {
                opacity: 1;
            }
        }
    }
    .right {
        flex-shrink: 0;
    }
}
</style>
