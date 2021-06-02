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
            <div class="variant-list">
                <LookVariantListItem
                    v-for="variantMap in look.variantMaps"
                    :key="variantMap.variant_id"
                    :variantMap="variantMap"
                    :look="look"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LookVariantListItem from './LookVariantListItem'

export default {
    name: 'EditLookPopover',
    components: { LookVariantListItem },
    data() {
        return {
            editName: false,
        }
    },
    computed: {
        ...mapGetters('productGroups', {
            look: 'getCurrentProductGroup',
        }),
        totalPrice() {
            return this.look.variantMaps.reduce((total, curr) => {
                return (total += curr.product.yourPrice.recommended_retail_price)
            }, 0)
        },
    },
    methods: {
        updateLook() {},
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
