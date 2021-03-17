<template>
    <BaseTableInnerRow class="variant-row flex-list lg justify full-w flex-start-v" tabindex="0">
        <div class="flex-list flex-v space-md image-col">
            <div class="flex-list flex-v min lh-xs">
                <div class="ft-12 ft-bd name">{{ variant.name }}</div>
            </div>
            <BaseImageSizer fit="contain" aspect="1:1">
                <BaseVariantImage v-if="hasImage" class="main-img" :key="variant.id" :variant="variant" size="sm" />
                <div v-else class="color main-img" :style="imageBackground"></div>
            </BaseImageSizer>
        </div>
        <div class="flex-list flex-v fill space-md main-section">
            <LabelList
                v-if="labelsEnabled || variant.labels.length > 0"
                :variant="variant"
                :product="variant.product"
                ref="labelList"
            />
            <div class="size-split-section" v-if="!hasAssortments" v-dragscroll>
                <div class="ft-10 col-light">Deliveries</div>
                <div class="flex-list space-md">
                    <DeliveryListItem
                        v-for="(delivery, index) in deliveriesSorted"
                        :key="index"
                        :variant="variant"
                        :index="index"
                        :delivery="delivery"
                    />
                </div>
            </div>
            <div class="assortment-section flex-list flex-v" v-else v-dragscroll>
                <div class="delivery-selector">
                    <BaseSegmentedControl
                        activeClass="white"
                        sizeClass="sm"
                        theme="light"
                        v-model="selectedDeliveryDate"
                        :options="assortmentDeliveries"
                    />
                </div>
                <div class="assortment-list">
                    <div class="ft-10 col-light">Assortments ({{ variant.assortments.length }})</div>
                    <div class="flex-list space-md">
                        <AssortmentListItem
                            v-for="(assortment, index) in assortmentsSorted"
                            :key="index"
                            :variant="variant"
                            :assortment="assortment"
                            :index="index"
                            :deliveryDate="selectedDeliveryDate"
                        />
                    </div>
                </div>
            </div>
        </div>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import LabelList from '../LabelList'
import DeliveryListItem from './DeliveryListItem'
import AssortmentListItem from './AssortmentListItem'
import { getVariantBackgroundStyle } from '../../../../helpers/dkcIntegration'
import variantImage from '../../../../mixins/variantImage'

export default {
    name: 'buy.VariantRow',
    components: {
        LabelList,
        DeliveryListItem,
        AssortmentListItem,
    },
    props: ['variant'],
    mixins: [variantImage],
    data: function() {
        return {
            selectedDeliveryDate: null,
            assortmentsSorted: [],
            deliveriesSorted: [],
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
        hasAssortments() {
            return this.variant.assortments.length > 0
        },
        assortmentDeliveries() {
            return this.variant.deliveries.map(delivery => {
                return {
                    label: this.getPrettyDate(delivery.delivery_date, 'medium'),
                    value: delivery.delivery_date,
                    count: delivery.quantity,
                }
            })
        },
        imageBackground() {
            return getVariantBackgroundStyle(this.variant)
        },
        hasImage() {
            const url = this.variantImage(this.variant)
            return url != '/images/placeholder.JPG'
        },
    },
    methods: {},
    mounted() {
        if (this.product.delivery_dates.length > 0) {
            this.selectedDeliveryDate = this.product.delivery_dates[0]
        }
        this.deliveriesSorted = this.variant.deliveries.slice().sort((a, b) => b.quantity - a.quantity)
        this.assortmentsSorted = this.variant.assortments
            .filter(assortment => assortment.delivery_dates.includes(this.selectedDeliveryDate))
            .slice()
            .sort((a, b) => b.quantity - a.quantity)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.variant-row {
    padding: 8px 16px 8px 8px;
    align-items: flex-start;
    height: 177px;
    overflow: hidden;
    .main-section {
        overflow: hidden;
    }
    &:focus {
        outline: none;
    }
    .image-col {
        width: 108px;
        flex-shrink: 0;
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
    .assortment-section,
    .size-split-section {
        overflow-x: auto;
        padding-bottom: 6px;
    }
}
</style>
