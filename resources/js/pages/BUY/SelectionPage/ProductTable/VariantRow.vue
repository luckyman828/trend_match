<template>
    <BaseTableInnerRow class="variant-row flex-list lg justify full-w flex-start-v" tabindex="0">
        <div class="flex-list flex-v space-md image-col">
            <div class="flex-list flex-v min lh-xs">
                <div class="ft-12 ft-bd name">{{ variant.name }}</div>
            </div>
            <BaseImageSizer fit="contain" aspect="1:1">
                <BaseVariantImage class="main-img" :key="variant.id" :variant="variant" size="sm" />
            </BaseImageSizer>
        </div>
        <div class="flex-list flex-v fill space-md">
            <LabelList
                v-if="labelsEnabled || variant.labels.length > 0"
                :variant="variant"
                :product="variant.product"
                ref="labelList"
            />
            <div class="size-split-section" v-if="!hasAssortments">
                <div class="ft-10 col-light">Deliveries</div>
                <div class="flex-list space-md">
                    <DeliveryListItem
                        v-for="(delivery, index) in variant.deliveries"
                        :key="index"
                        :variant="variant"
                        :index="index"
                        :delivery="delivery"
                    />
                </div>
            </div>
            <div class="assortment-section" v-else></div>
        </div>

        <div class="actions flex-list center-v full-h">
            <BaseButton buttonClass="pill">
                <i class="far fa-comment"></i>
                <template v-slot:count>
                    <div class="circle dark xs"><span>2</span></div>
                </template>
            </BaseButton>
            <button class="pill">
                <span>View</span>
            </button>
        </div>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import LabelList from '../LabelList'
import DeliveryListItem from './DeliveryListItem'

export default {
    name: 'buy.VariantRow',
    props: ['variant'],
    components: {
        LabelList,
        DeliveryListItem,
    },
    data: function() {
        return {
            hasAssortments: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            availableLabels: 'getAvailableProductLabels',
        }),
        product() {
            return this.variant.product
        },
        labelsEnabled() {
            return this.availableLabels.length > 0
        },
    },
    methods: {},
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.variant-row {
    padding: 8px 16px 8px 8px;
    align-items: flex-start;
    height: 177px;
    &:focus {
        outline: none;
    }
    .image-col {
        width: 108px;
        overflow: hidden;
        .name {
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    .main-img {
        border: $borderElSoft;
        border-radius: $borderRadiusEl;
    }
}
</style>
