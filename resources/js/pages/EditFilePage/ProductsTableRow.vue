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
                <div class="sync-wrapper" :class="syncStatus" v-if="syncStatus">
                    <i
                        v-if="syncStatus.toLowerCase() == 'success'"
                        class="sync-icon success far green fa-check-circle md"
                    ></i>
                    <i
                        v-else-if="syncStatus.toLowerCase() == 'failed'"
                        class="sync-icon error far red fa-times-circle md"
                    ></i>
                    <i v-else class="sync-icon syncing fad fa-sync md"></i>
                </div>
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
        <td class="wholesale-price">
            <span>{{ product.yourPrice.wholesale_price }}</span>
        </td>
        <td class="recommended-retail-price">
            <span>{{ product.yourPrice.recommended_retail_price }}</span>
        </td>
        <td class="mark-up">
            <span>{{ product.yourPrice.mark_up }}</span>
        </td>
        <td class="currency">
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
            <button class="no-bg ghost-hover primary" v-if="!editOrderModeActive" @click="onViewSingle">
                <span>View / Edit</span>
            </button>

            <div class="square primary drag-handle" v-else>
                <i class="far fa-arrows-alt-v"></i>
            </div>
        </td>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import variantImage from '../../mixins/variantImage'

export default {
    name: 'productsRow',
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
            workspaceRole: 'authUserWorkspaceRole',
        }),
        ...mapGetters('files', {
            currentFile: 'getCurrentFile',
        }),
        ...mapGetters('files', {
            file: 'getCurrentFile',
        }),
        ...mapGetters('backgroundJobs', {
            syncJobs: 'getImageSyncJobs',
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
        syncStatus() {
            return this.product.imageSyncStatus
        },
    },
    methods: {
        ...mapActions('products', ['fetchProduct']),
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
.products-table-row {
    .img-wrapper {
        // border: $borderModule;
        border: $borderElSoft;
        height: 100%;
        width: 100%;
        position: relative;
        // width: 48px;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .sync-wrapper {
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            position: absolute;
            &:not(.Success):not(.Error) {
                // background: rgba(white, 0.8);
            }
            .sync-icon {
                margin: 8px;
                &.syncing {
                    animation: spin infinite 2s;
                }
            }
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
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
