<template>
    <div class="edit-look-popover bg-theme-white theme-border">
        <div class="header flex-list justify">
            <div class="name-wrapper">
                <span v-if="!editName" class="name ft-14 ft-bd line-clamp-2" @click="editName = true">{{
                    look.name
                }}</span>
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
                        updateLook()
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
            <Draggable class="variant-list" v-model="look.variantMaps">
                <LookVariantListItem
                    v-for="variantMap in look.variantMaps"
                    :key="variantMap.variant_id"
                    :variantMap="variantMap"
                    :look="look"
                />
            </Draggable>
        </div>
        <div class="footer flex-list">
            <button class="pill auto-right sm">
                <i class="far fa-ellipsis-h primary"></i>
            </button>
            <button class="pill sm">
                <i class="far fa-tshirt primary"></i>
                <span class="color-primary">Save</span>
            </button>
            <button v-if="!linkedTiming" class="pill sm" @click="onAddTiming">
                <i class="far fa-plus"></i>
                <span>To timeline</span>
            </button>
            <!-- EDITING TIMING -->
            <template v-else>
                <button v-if="changedFromLinkedTiming" class="pill sm" @click="updateLinkedTiming">
                    <i class="far fa-save"></i>
                    <span>Update</span>
                </button>
                <div v-else class="pill sm disabled secondary">
                    <i class="far fa-save"><i class="fas fa-check primary pos-top pos-right"></i></i>
                    <span>Changes saved</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
        }),
        ...mapGetters('playPresentation', {
            timings: 'getTimings',
        }),
        totalPrice() {
            return this.look.variantMaps.reduce((total, curr) => {
                return (total += curr.product.yourPrice.recommended_retail_price)
            }, 0)
        },
        linkedTiming() {
            return this.timings.find(timing => timing.id == this.look.timingId)
        },
        changedFromLinkedTiming() {
            return (
                this.linkedTiming &&
                JSON.stringify(this.linkedTiming.variantMaps) != JSON.stringify(this.look.variantMaps)
            )
        },
    },
    methods: {
        ...mapActions('playPresentation', ['addTiming', 'updateTiming']),
        updateLook() {},
        onAddTiming() {
            const newTiming = {
                id: null,
                start_at_ms: null,
                end_at_ms: null,
                variants: JSON.parse(JSON.stringify(this.look.variantMaps)),
            }
            this.addTiming({ newTiming })
        },
        updateLinkedTiming() {
            this.updateTiming(this.linkedTiming)
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
        .name {
            font-size: 14px;
            font-weight: 800;
        }
    }
    .right {
        flex-shrink: 0;
    }
}
</style>
