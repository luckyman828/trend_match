<template>
    <BaseTableInnerRow class="products-table-row">
        <td class="image clickable" @click="onViewSingle">
            <div class="img-wrapper">
                <BaseVariantImage
                    :key="product.id"
                    v-if="product.variants[0] != null"
                    :variant="product.variants[0]"
                    size="sm"
                />
            </div>
        </td>
        <td class="id clickable" @click="onViewSingle">
            <span>{{ product.datasource_id }}</span>
        </td>
        <td class="title">
            <span class="clickable">
                <span
                    @click="onViewSingle"
                    v-tooltip="!!product.title && product.title.length > titleTruncateSize && product.title"
                    >{{ product.title | truncate(titleTruncateSize) }}</span
                >
                <LabelList v-if="labelsEnabled || product.labels.length > 0" :product="product" />
                <div class="variant-list" @click="onViewSingle">
                    <div
                        class="variant-list-item pill ghost xs"
                        v-for="(variant, index) in product.variants.slice(0, 5)"
                        :key="index"
                    >
                        <span>{{ variant.name || 'Unnamed' | truncate(variantNameTruncateLength(product)) }}</span>
                    </div>
                    <div class="variant-list-item pill ghost xs" v-if="product.variants.length > 5">
                        <span>+ {{ product.variants.length - 5 }} more</span>
                    </div>
                </div>
            </span>
        </td>
        <td
            class="delivery"
            v-tooltip="{
                content:
                    product.delivery_dates.length > 1 &&
                    product.delivery_dates.map(x => getPrettyDate(x, 'short')).join(', '),
                trigger: 'hover',
            }"
            :style="product.delivery_dates.length > 1 && 'cursor: pointer;'"
            @click="onViewSingle"
        >
            <span v-if="product.delivery_dates[0]">
                {{ getPrettyDate(product.delivery_dates[0], 'short') }}
                <span v-if="product.delivery_dates.length > 1" class="square ghost xs">
                    <span>+{{ +product.delivery_dates.length - 1 }}</span>
                </span>
            </span>
        </td>

        <!-- Start Prices -->
        <td class="wholesale-price hide-screen-xs">
            <span>{{ product.yourPrice.wholesale_price }}</span>
        </td>
        <td class="recommended-retail-price hide-screen-xs">
            <span>{{ product.yourPrice.recommended_retail_price }}</span>
        </td>
        <td class="mark-up hide-screen-xs">
            <span>{{ product.yourPrice.mark_up }}</span>
        </td>
        <td class="currency hide-screen-xs">
            <span>{{ product.yourPrice.currency }}</span>
        </td>
        <!-- End Prices -->

        <td class="minimum">
            <div class="square ghost xs">
                <span>
                    <template v-if="product.min_variant_order">
                        <span>{{ product.min_variant_order }}/</span>
                    </template>
                    <span>{{ product.min_order }}</span>
                </span>
                <i class="far fa-box"></i>
            </div>
        </td>

        <td class="action">
            <button class="invisible ghost-hover primary" v-if="!editOrderModeActive" @click="onViewSingle">
                <span>View / Edit</span>
            </button>

            <div class="square primary drag-handle" v-else>
                <i class="far fa-arrows-alt-v"></i>
            </div>
        </td>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import variantImage from '../../mixins/variantImage'
import LabelList from '../SelectionPage/ProductsTableRow/LabelList'

export default {
    name: 'productsRow',
    components: { LabelList },
    props: ['product', 'selectedProducts', 'editOrderModeActive'],
    mixins: [variantImage],
    filters: {
        truncate: function(text, length) {
            const clamp = '...'
            var node = document.createElement('div')
            node.innerHTML = text
            var content = node.textContent
            // return `<span>124</span>`
            return content.length > length ? content.slice(0, length) + clamp : content
        },
    },
    computed: {
        ...mapGetters('workspaces', {
            availableLabels: 'getAvailableProductLabels',
            workspaceRole: 'authUserWorkspaceRole',
        }),
        ...mapGetters('files', {
            currentFile: 'getCurrentFile',
        }),
        localSelectedProducts: {
            get() {
                return this.selectedProducts
            },
            set(localSelectedProducts) {
                this.$emit('input', localSelectedProducts)
            },
        },
        titleTruncateSize() {
            return window.innerWidth < 1260 ? 16 : 24
        },
        labelsEnabled() {
            return this.availableLabels.length > 0
        },
        hasLabelWriteAccess() {
            return this.labelsEnabled && (this.currentFile.editable || this.workspaceRole == 'Admin')
        },
    },
    methods: {
        productImg(variant) {
            if (!variant || (!variant.blob_id && !variant.image)) return `/images/placeholder.JPG`
            if (variant.blob_id)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        onViewSingle() {
            this.$emit('view-single-product', this.product)
        },
        variantNameTruncateLength(product) {
            const amount = product.variants.length
            if (amount > 4) {
                return window.innerWidth > 1260 ? 12 : 6
            } else if (amount > 2) {
                return window.innerWidth > 1260 ? 20 : 15
            }
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.products-table-row {
    .img-wrapper {
        // border: $borderModule;
        border: $borderElSoft;
        height: 100%;
        width: 100%;
        // width: 48px;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}
td.title {
    position: relative;
}
.variant-list {
    position: absolute;
    left: 0;
    bottom: -6px;
    // max-width: 700px;
    // overflow: hidden;
    // &::after {
    //     content: "";
    //     display: block;
    //     height: 100%;
    //     width: 80px;
    //     background: linear-gradient(90deg, transparent, white);
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     tr:hover & {
    //         background: linear-gradient(90deg, transparent, $bgContentAlt);
    //     }
    // }
}
.variant-list-item:not(:first-child) {
    margin-left: 4px;
}

.drag-handle {
    cursor: grab;
    i {
        font-weight: 400 !important;
    }
}
</style>
