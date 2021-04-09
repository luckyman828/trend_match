<template>
    <BaseFlyin
        class="product-single has-budget"
        :show="show"
        @close="onCloseSingle"
        :columns="2"
        :class="[{ 'has-labels': showLabels }]"
    >
        <template v-slot:header>
            <BaseFlyinHeader
                class="the-flyin-header"
                v-if="show"
                :next="nextProduct"
                :prev="prevProduct"
                @close="onCloseSingle"
                @next="showNextProduct"
                @prev="showPrevProduct"
            >
                <template v-slot:left>
                    <div class="item-group product-title-wrapper">
                        <h3>{{ `#${product.datasource_id}: ${product.title}` }}</h3>
                        <span class="product-count"
                            >Product
                            {{ availableProducts.findIndex(x => x.id == product.id) + 1 }}
                            of
                            {{ availableProducts.length }}</span
                        >
                    </div>
                    <div class="item-group">
                        <LabelList v-if="showLabels" ref="labelList" :product="product" v-horizontal-scroll />
                    </div>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-slot v-if="show">
            <DetailsSection :product="product" />

            <CommentsSection :selectionInput="product" class="comments" ref="commentsSection" />

            <BudgetCounter :hideLabel="true" class="the-budget-counter" :selection="selection" />
        </template>
    </BaseFlyin>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import DetailsSection from './DetailsSection'
import CommentsSection from './CommentsSection'

import BudgetCounter from '../BudgetCounter'
import LabelList from '../LabelList'

export default {
    name: 'productFlyin',
    props: ['show'],

    components: {
        DetailsSection,
        CommentsSection,
        BudgetCounter,
        LabelList,
    },
    computed: {
        ...mapGetters('requests', {
            currentRequestThread: 'getCurrentRequestThread',
        }),
        ...mapGetters('products', ['currentProduct', 'nextProduct', 'prevProduct']),
        ...mapGetters('products', {
            availableProducts: 'getAvailableProducts',
            currentVariantIndex: 'getPdpVariantIndex',
        }),
        ...mapGetters('selections', [
            'getCurrentPDPSelection',
            'getSelectionCurrentMode',
            'getSelectionModeAction',
            'getAuthUserSelectionWriteAccess',
        ]),
        ...mapGetters('workspaces', {
            availableLabels: 'getAvailableProductLabels',
            workspaceRole: 'authUserWorkspaceRole',
        }),
        ...mapGetters('files', {
            currentFile: 'getCurrentFile',
        }),
        ...mapGetters('presentationQueue', ['getpresentationQueue', 'getpresentationQueueCurrentProductIndex']),
        product() {
            return this.currentProduct
        },
        showLabels() {
            return this.labelsEnabled || (this.product && this.product.labels.length > 0)
        },
        selection() {
            return this.getCurrentPDPSelection
        },
        labelsEnabled() {
            return this.availableLabels.length > 0
        },
        hasLabelWriteAccess() {
            return this.labelsEnabled && (this.currentFile.editable || this.workspaceRole == 'Admin')
        },
    },
    methods: {
        ...mapActions('products', ['showNextProduct', 'showPrevProduct']),
        async onCloseSingle() {
            this.$emit('close')
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

::v-deep {
    &.product-single {
        &.has-labels {
            &.has-budget {
                .label-list {
                    top: 64px;
                }
            }
            .flyin-header {
                margin-bottom: 40px;
                &:hover {
                    .label-list .add-button {
                        opacity: 1;
                    }
                }
            }
            .flyin {
                background: white;
                > .body {
                    border-top: $borderModule;
                }
            }
            .label-list {
                position: absolute;
                top: 56px;
                left: 0;
                overflow-x: auto;
                overflow-y: hidden;
                padding: 0 16px 6px;
                max-width: none;
                &::after {
                    content: '';
                    display: block;
                    width: 16px;
                    height: 1px;
                    flex-shrink: 0;
                }
                > * {
                    flex-shrink: 0;
                }
                .add-button {
                    display: block;
                }
            }
        }
        > .flyin {
            min-width: 0;
            width: 100%;
            max-width: 752px;
            .flyin-header {
                > .left {
                    // max-width: 380px;
                    h3 {
                        max-width: calc(36vw - 92px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
        &.has-budget {
            > .flyin {
                > .body {
                    margin-top: 8px;
                    border-top: $borderModule;
                }
            }
            .the-budget-counter {
                overflow: hidden;
                .bar {
                    margin-left: -4px;
                    margin-right: -4px;
                }
            }
        }
    }
}

.the-budget-counter {
    position: absolute;
    top: 48px;
    margin: 0;
    left: 0;
    max-width: none;
    width: 100%;
}

.product-title-wrapper {
    flex-direction: column;
    justify-content: flex-start;
    .product-count {
        font-size: 12px;
        line-height: 1;
    }
}
</style>
