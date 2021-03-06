<template>
    <BaseFlyin
        class="product-single product-flyin"
        :show="show"
        @close="onCloseSingle"
        :columns="4"
        :class="[{ 'has-budget': showQty }, { 'has-labels': showLabels }]"
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
                        <h3 class="truncate">{{ `#${product.datasource_id}: ${product.title}` }}</h3>
                        <span class="product-count"
                            >Product
                            {{ availableProducts.findIndex(x => x.id == product.id) + 1 }}
                            of
                            {{ availableProducts.length }}</span
                        >
                    </div>
                    <div class="item-group">
                        <LabelList
                            v-if="showLabels"
                            ref="labelList"
                            :labelPopoverRef="labelPopoverRef"
                            :product="product"
                            v-horizontal-scroll
                        />
                    </div>
                </template>
                <template v-slot:right>
                    <div
                        class="item-group"
                        v-if="
                            !isObserver &&
                                ((ticketsEnabled && product.is_completed) ||
                                    (selection.type == 'Master' &&
                                        ticketsEnabled &&
                                        currentSelectionMode == 'Alignment'))
                        "
                    >
                        <!-- Master actions -->
                        <BaseButton
                            buttonClass="pill xs ghost"
                            targetAreaPadding="4px 4px"
                            :disabled="!(selection.type == 'Master' && currentSelectionMode == 'Alignment')"
                            @click="onToggleCompleted"
                        >
                            <template v-if="!product.is_completed">
                                <i class="far fa-circle" style="font-weight: 400;"></i>
                                <span>Complete</span>
                            </template>
                            <template v-else>
                                <i class="far fa-check-circle primary"></i>
                                <span>Completed</span>
                            </template>
                        </BaseButton>
                        <!-- END Master actions -->
                    </div>
                    <div class="item-group">
                        <v-popover>
                            <button class="ghost true-square">
                                <i class="far fa-ellipsis-h"></i>
                            </button>
                            <div slot="popover">
                                <BaseContextMenu :inline="true">
                                    <!-- <template v-slot:header>
                                        <span>More actions</span>
                                    </template> -->
                                    <template v-slot:default>
                                        <div class="item-group">
                                            <div class="item-wrapper">
                                                <SelectionPresenterModeButton
                                                    :selection="selection"
                                                    @toggle="onTogglePresenterMode"
                                                />
                                            </div>
                                        </div>
                                    </template>
                                </BaseContextMenu>
                            </div>
                        </v-popover>
                    </div>
                    <!-- <div class="item-group">
                        <SelectionPresenterModeButton :selection="selection" @toggle="onTogglePresenterMode"/>
                    </div> -->
                    <div class="item-group" v-if="activeSelectionList.length > 1">
                        <SelectionSelector
                            ref="selectionSelector"
                            v-if="currentSelectionMode == 'Alignment' && !selection.is_presenting"
                        />
                    </div>
                    <div class="item-group">
                        <BaseButton
                            :buttonClass="[
                                'true-square',
                                selectionInput[currentAction] != 'Focus' ? 'ghost' : 'primary',
                            ]"
                            :disabled="!userWriteAccess.actions.hasAccess"
                            v-tooltip="userWriteAccess.actions.msg"
                            @click="onUpdateAction('Focus')"
                        >
                            <i class="far fa-star"></i>
                        </BaseButton>
                        <BaseButton
                            :buttonClass="selectionInput[currentAction] != 'In' ? 'ghost' : 'green'"
                            :disabled="!userWriteAccess.actions.hasAccess"
                            v-tooltip="userWriteAccess.actions.msg"
                            @click="onUpdateAction('In')"
                        >
                            <i class="far fa-heart"></i>
                            <span>In</span>
                        </BaseButton>
                        <BaseButton
                            :buttonClass="selectionInput[currentAction] != 'Out' ? 'ghost' : 'red'"
                            :disabled="!userWriteAccess.actions.hasAccess"
                            v-tooltip="userWriteAccess.actions.msg"
                            @click="onUpdateAction('Out')"
                        >
                            <i class="far fa-times-circle"></i>
                            <span>out</span>
                        </BaseButton>
                    </div>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-slot v-if="show">
            <BaseFlyinColumn class="details">
                <div class="main-img" @click="cycleImage(true)">
                    <BaseImageSizer>
                        <BaseVariantImage
                            :key="product.id + '-' + currentImgIndex"
                            :variant="currentVariant"
                            size="sm"
                            :index="currentVariant ? currentVariant.imageIndex : 0"
                        />
                    </BaseImageSizer>
                    <button
                        class="white controls true-square"
                        v-tooltip="'View large images'"
                        @click.stop="onShowLightbox"
                    >
                        <i class="far fa-search-plus"></i>
                    </button>

                    <div class="image-drawer" v-if="currentVariant && currentVariant.pictures.length > 1">
                        <BaseShape shapeClass="true-square white">
                            <i class="far fa-images"></i>
                            <template v-slot:outside>
                                <div class="count circle xxs dark top-right">
                                    <span>{{ currentVariant.pictures.length }}</span>
                                </div>
                            </template>
                        </BaseShape>
                        <div class="drawer">
                            <div
                                class="image-wrapper"
                                v-for="(image, index) in currentVariant.pictures"
                                :key="index"
                                :class="{ active: currentVariant.imageIndex == index }"
                            >
                                <BaseVariantImage
                                    :variant="currentVariant"
                                    size="sm"
                                    :index="index"
                                    @click.native.stop="currentVariant.imageIndex = index"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="product-variants" v-dragscroll>
                    <VariantListItem
                        v-for="(variant, index) in selectionInput.variants"
                        :key="index"
                        :variant="variant"
                        :product="product"
                        :selection="selection"
                        :selectionInput="selectionInput"
                        :class="{ active: currentImgIndex == index }"
                        v-tooltip-trigger="{ tooltipRef: 'variantTooltip', showArg: variant }"
                        @click.native="currentImgIndex = index"
                    />
                </div>

                <!-- <label>Style number</label>
                <BaseInputField readOnly=true :value="product.datasource_id"/> -->

                <div class="col-3 prices">
                    <div>
                        <v-popover :disabled="product.prices.length < 1">
                            <label>WHS ({{ product.yourPrice.currency }}) <i class="far fa-info-circle"></i></label>
                            <template slot="popover">
                                <BasePopoverList header="Wholesale price">
                                    <BasePopoverListItem
                                        v-for="(price, index) in product.prices"
                                        :key="index"
                                        :label="price.currency"
                                        :value="price.wholesale_price"
                                    />
                                </BasePopoverList>
                            </template>
                        </v-popover>
                        <BaseInputField readOnly="true" :value="product.yourPrice.wholesale_price" />
                    </div>
                    <div>
                        <v-popover :disabled="product.prices.length < 1">
                            <label>RRP ({{ product.yourPrice.currency }}) <i class="far fa-info-circle"></i></label>
                            <template slot="popover">
                                <BasePopoverList header="Recommended retail price">
                                    <BasePopoverListItem
                                        v-for="(price, index) in product.prices"
                                        :key="index"
                                        :label="price.currency"
                                        :value="price.recommended_retail_price"
                                    />
                                </BasePopoverList>
                            </template>
                        </v-popover>
                        <BaseInputField readOnly="true" :value="product.yourPrice.recommended_retail_price" />
                    </div>
                    <div>
                        <v-popover :disabled="product.prices.length < 1">
                            <label>Mark up <i class="far fa-info-circle"></i></label>
                            <template slot="popover">
                                <BasePopoverList header="Mark up">
                                    <BasePopoverListItem
                                        v-for="(price, index) in product.prices"
                                        :key="index"
                                        :label="price.currency"
                                        :value="price.mark_up"
                                    />
                                </BasePopoverList>
                            </template>
                        </v-popover>
                        <BaseInputField readOnly="true" :value="product.yourPrice.mark_up" />
                    </div>
                </div>

                <label>Delivery Date(s)</label>
                <BaseInputTextArea
                    readOnly="true"
                    :value="product.delivery_dates.map(date => `${getPrettyDate(date)}`).join('\n')"
                />

                <div class="col-2 minimum">
                    <div>
                        <label>Order min. (pcs)</label>
                        <BaseInputField readOnly="true" :value="product.min_order" />
                    </div>
                    <div>
                        <label>Variant min. (pcs)</label>
                        <BaseInputField readOnly="true" :value="product.min_variant_order" />
                    </div>
                </div>

                <label>Composition</label>
                <BaseInputField readOnly="true" :value="product.composition" />
                <label>Box Sizes</label>
                <BaseInputTextArea readOnly="true" :value="product.assortment_sizes.join(', ')" />
                <label>Assortments</label>
                <BaseInputTextArea readOnly="true" :value="product.assortments.map(x => `${x.name}`).join(',\n')" />
                <label>Category</label>
                <BaseInputField readOnly="true" :value="product.category" />
                <label>Description</label>
                <BaseInputTextArea readOnly="true" :value="product.sale_description" />
            </BaseFlyinColumn>

            <DistributionSection :selectionInput="selectionInput" :product="product" />

            <RequestsSection
                class="comments"
                ref="requestsSection"
                :selectionInput="selectionInput"
                :requests="selectionInput.requests"
                @activateCommentWrite="$refs.commentsSection.activateWrite()"
            />

            <CommentsSection
                v-if="!showRequestThread"
                class="comments"
                ref="commentsSection"
                :selectionInput="selectionInput"
                @activateRequestWrite="$refs.requestsSection.activateWrite()"
                @hotkeyEnter="hotkeyEnterHandler"
            />

            <RequestThreadSection v-else :selectionInput="selectionInput" @onTab="onTabRequestThread" />

            <PresentationQueueFlyin :product="product" v-if="selection.is_presenting && show" />

            <!-- <RequestThreadFlyin/> -->

            <BaseDialog
                ref="confirmCloseInPresentation"
                type="confirm"
                confirmColor="dark"
                confirmText="Okay, close it"
            >
                <div class="icon-graphic">
                    <i class="lg primary far fa-file"></i>
                    <i class="lg far fa-arrow-right"></i>
                    <i class="lg dark far fa-times"></i>
                </div>
                <h3>You are about to close the Product Flyin</h3>
                <p>Your presentation will still continue</p>
                <p>Press any product to access your queue again</p>
            </BaseDialog>

            <BasePopover ref="variantTooltip" @show="variant => (tooltipVariant = variant)">
                <VariantTooltip
                    :variant="tooltipVariant"
                    :selection="selection"
                    :product="product"
                    :actionDistributionTooltipTab="actionDistributionTooltipTab"
                    :selectionInput="selectionInput"
                    @changeTab="tab => (actionDistributionTooltipTab = tab)"
                />
            </BasePopover>

            <BudgetCounter v-if="showQty" :hideLabel="true" class="the-budget-counter" :selection="selection" />
        </template>
    </BaseFlyin>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import CommentsSection from './CommentsSection'
import DistributionSection from './DistributionSection/'
import RequestsSection from './RequestsSection'
import SelectionSelector from './SelectionSelector'
import VariantListItem from './VariantListItem'
import PresentationQueueFlyin from './PresentationQueueFlyin/'
import VariantTooltip from '../VariantTooltip'
import variantImage from '../../../mixins/variantImage'
import SelectionPresenterModeButton from '../../../components/SelectionPresenterModeButton'
import BudgetCounter from '../BudgetCounter'
import LabelList from '../ProductsTableRow/LabelList'
// import RequestThreadFlyin from './RequestThreadFlyin'
import RequestThreadSection from './RequestThreadSection'
import HotkeyHandler from '../../../components/common/HotkeyHandler'

export default {
    name: 'productFlyin',
    props: ['show', 'labelPopoverRef'],
    mixins: [variantImage],
    components: {
        CommentsSection,
        DistributionSection,
        RequestsSection,
        SelectionSelector,
        SelectionPresenterModeButton,
        PresentationQueueFlyin,
        VariantListItem,
        VariantTooltip,
        BudgetCounter,
        LabelList,
        // RequestThreadFlyin,
        RequestThreadSection,
        HotkeyHandler,
    },
    data: function() {
        return {
            lastBroadcastProductId: null,
            tooltipVariant: null,
            actionDistributionTooltipTab: 'Feedback',
        }
    },
    watch: {
        product(newVal, oldVal) {
            if (oldVal && oldVal.id != newVal.id) {
                this.currentImgIndex = 0

                // Broadcast the product when the product changes
                if (this.broadcastActive && this.lastBroadcastProductId != newVal.id) {
                    this.onBroadcastProduct(newVal)
                }
            }
        },
        show(newVal, oldVal) {
            if (newVal) {
                // Broadcast the product if we have not yet broadcast a product or we have just opened the same product as shown before
                if (
                    this.broadcastActive &&
                    (!this.lastBroadcastProductId || this.lastBroadcastProductId == this.product.id)
                ) {
                    this.onBroadcastProduct(this.product)
                }
                document.activeElement.blur()
                document.body.addEventListener('keydown', this.hotkeyHandler)
                // document.body.addEventListener('keydown', this.keydownHandler)
            } else {
                // On close
                document.body.removeEventListener('keydown', this.hotkeyHandler)
                // document.body.removeEventListener('keydown', this.keydownHandler)
                this.SET_CURRENT_REQUEST_THREAD(null)
            }
        },
    },
    computed: {
        ...mapGetters('requests', {
            showRequestThread: 'getRequestThreadVisible',
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
        ...mapGetters('selections', {
            multiSelectionMode: 'getMultiSelectionModeIsActive',
            showQty: 'getQuantityModeActive',
            activeSelectionList: 'getCurrentSelections',
            isObserver: 'getViewingAsObserver',
            selectionRole: 'getCurrentSelectionMode',
        }),
        ...mapGetters('workspaces', {
            availableLabels: 'getAvailableProductLabels',
            workspaceRole: 'authUserWorkspaceRole',
        }),
        ...mapGetters('files', {
            currentFile: 'getCurrentFile',
        }),
        ...mapGetters('requests', ['getRequestThreadVisible']),
        ...mapGetters('presentationQueue', ['getpresentationQueue', 'getpresentationQueueCurrentProductIndex']),
        selectionInput() {
            return this.product.selectionInputList.find(x => x.selection_id == this.getCurrentPDPSelection.id)
        },
        product() {
            return this.currentProduct
        },
        currentVariant() {
            return this.selectionInput.variants[this.currentImgIndex]
        },
        currentImgIndex: {
            get() {
                return this.currentVariantIndex
            },
            set(value) {
                this.SET_CURRENT_PDP_VARIANT_INDEX(value)
            },
        },
        showLabels() {
            return this.labelsEnabled || (this.product && this.product.labelInput && this.product.labelInput.length > 0)
        },
        broadcastActive() {
            return this.selection.is_presenting
        },
        selection() {
            return this.getCurrentPDPSelection
        },
        currentSelectionMode() {
            return this.getSelectionCurrentMode(this.selection)
        },
        currentSelectionModeAction() {
            return this.getSelectionModeAction(this.currentSelectionMode)
        },
        currentAction() {
            return this.currentSelectionModeAction
        },
        userWriteAccess() {
            return this.getAuthUserSelectionWriteAccess(this.selection, this.product)
        },
        ticketsEnabled() {
            return this.selection.settings.ticket_level != 'None'
        },
        labelsEnabled() {
            return this.availableLabels.length > 0
        },
        hasLabelWriteAccess() {
            return this.labelsEnabled && this.userWriteAccess.actions.hasAccess
        },
    },
    methods: {
        ...mapActions('products', ['showNextProduct', 'showPrevProduct', 'toggleProductCompleted', 'updateProduct']),
        ...mapActions('presentation', ['broadcastProduct']),
        ...mapActions('actions', ['updateProductLabelInput']),
        ...mapMutations('lightbox', ['SET_LIGHTBOX_VISIBLE', 'SET_LIGHTBOX_IMAGES', 'SET_LIGHTBOX_IMAGE_INDEX']),
        ...mapMutations('requests', ['SET_CURRENT_REQUEST_THREAD']),
        ...mapMutations('products', ['SET_CURRENT_PDP_VARIANT_INDEX']),
        ...mapMutations('presentationQueue', [
            'ADD_PRODUCT_TO_PRESENTER_QUEUE',
            'SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID',
        ]),
        onTogglePresenterMode(gotActivated) {
            if (gotActivated) {
                this.onBroadcastProduct(this.product)
            }
        },
        onToggleCompleted() {
            this.toggleProductCompleted({ selectionId: this.selection.id, product: this.product })
        },
        onBroadcastProduct(product) {
            this.lastBroadcastProductId = product.id
            // Add the product to our queue
            // If the product is not currently in our queue, add it right after the current product
            const newProductIndex = this.getpresentationQueue.findIndex(x => x.id == product.id)
            const currentProductIndex = this.getpresentationQueueCurrentProductIndex
            if (newProductIndex < 0) {
                this.ADD_PRODUCT_TO_PRESENTER_QUEUE({ product, index: currentProductIndex + 1 })
            }
            this.SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID(product.id)
            this.broadcastProduct({ product })
        },
        onUpdateAction(action) {
            this.$emit('updateAction', action, this.selectionInput)
        },
        onShowLightbox() {
            const lightboxImages = this.product.variants.reduce(
                (arr, variant) =>
                    arr.concat(variant.pictures.map((picture, index) => this.variantImage(variant, { index }))),
                []
            )
            // this.SET_LIGHTBOX_IMAGES(this.product.variants.map(x => this.variantImage(x)))
            let lightboxImageIndex = 0
            for (let i = 0; i <= this.currentImgIndex; i++) {
                if (i < this.currentImgIndex) {
                    lightboxImageIndex += this.selectionInput.variants[i].pictures.length
                }
                if (i == this.currentImgIndex) {
                    lightboxImageIndex += this.selectionInput.variants[i].imageIndex
                }
            }
            this.SET_LIGHTBOX_IMAGES(lightboxImages)
            // this.SET_LIGHTBOX_IMAGE_INDEX(this.currentImgIndex)
            this.SET_LIGHTBOX_IMAGE_INDEX(lightboxImageIndex)
            this.SET_LIGHTBOX_VISIBLE(true)
        },
        async onCloseSingle() {
            if (this.selection.is_presenting && !(await this.$refs.confirmCloseInPresentation.confirm())) {
                return
            }

            this.currentImgIndex = 0
            // Emit event to parent
            this.$emit('close')
        },
        cycleImage(cycleForward = true) {
            if (cycleForward) {
                if (this.currentImgIndex + 1 == this.product.variants.length) {
                    this.currentImgIndex = 0
                } else {
                    this.currentImgIndex++
                }
            } else {
                if (this.currentImgIndex == 0) {
                    this.currentImgIndex = this.product.variants.length - 1
                } else {
                    this.currentImgIndex--
                }
            }
        },
        onTabRequestThread(cycleForward) {
            const allTickets = this.product.requests.filter(x => x.type == 'Ticket')
            const tickets = []
            const ownTickets = allTickets.filter(x => x.selection_id == this.selection.id)
            const otherTickets = allTickets
                .filter(x => x.selection_id != this.selection.id)
                .sort((a, b) => (a.selection.type == 'Master' ? -1 : 1))
            tickets.push(...ownTickets)
            tickets.push(...otherTickets)

            // Find the index of our current request thread
            const index = tickets.findIndex(x => x.id == this.currentRequestThread.id)
            if (cycleForward && index + 1 <= tickets.length) {
                this.SET_CURRENT_REQUEST_THREAD(tickets[index + 1])
            } else if (!cycleForward && index > 0) {
                this.SET_CURRENT_REQUEST_THREAD(tickets[index - 1])
            }
        },
        hotkeyHandler(event) {
            this.keydownHandler(event)
            const key = event.code
            // Only do these if the current target is not the comment box
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT' && this.show) {
                if (
                    event.altKey &&
                    key == 'KeyC' &&
                    this.selection.type == 'Master' &&
                    this.currentSelectionMode == 'Alignment'
                ) {
                    this.onToggleCompleted()
                }

                if (this.userWriteAccess.actions.hasAccess) {
                    if (key == 'KeyI') this.onUpdateAction('In')
                    if (key == 'KeyO') this.onUpdateAction('Out')
                    if (key == 'KeyF' || key == 'KeyU') this.onUpdateAction('Focus')
                }
                if (key == 'Tab') {
                    event.preventDefault()
                    // Find requests with threads
                    const allTickets = this.product.requests.filter(x => x.type == 'Ticket')
                    if (allTickets.length <= 0) return

                    // // Else, show the first reqeust thread
                    if (!this.currentRequestThread) {
                        const ownTickets = allTickets.filter(x => x.selection_id == this.selection.id)
                        const ticketToShow = ownTickets.length > 0 ? ownTickets[0] : allTickets[0]
                        this.SET_CURRENT_REQUEST_THREAD(ticketToShow)
                    }
                }
            }
        },
        hotkeyEnterHandler(e) {
            // If the request thread flyin is visible, do nothing
            if (this.getRequestThreadVisible || !this.selection.is_open || e.target.contentEditabl) return
            // If the current mode is Alignment, focus the request field. Else focus comment
            if (this.currentSelectionMode == 'Alignment' && !this.product.is_completed) {
                this.$refs.requestsSection.activateWrite()
            } else {
                this.$refs.commentsSection.activateWrite()
            }
        },
        keydownHandler(e) {
            const key = e.code
            if (e.target.type != 'textarea' && e.target.tagName.toUpperCase() != 'INPUT' && this.show) {
                if (key == 'ArrowUp') e.preventDefault(), this.cycleImage(true)
                if (key == 'ArrowDown') e.preventDefault(), this.cycleImage(false)
                // Label hotkeys
                if (this.hasLabelWriteAccess) {
                    // Number hotkey
                    if (parseInt(e.key)) {
                        const pressedNumber = e.key
                        const label = this.availableLabels[pressedNumber - 1]
                        if (!label) return

                        // Check if the label is already added
                        const existingIndex = this.product.yourLabels.findIndex(x => x == label)
                        if (existingIndex >= 0) {
                            this.product.yourLabels.splice(existingIndex, 1)
                        } else {
                            this.product.yourLabels.push(label)
                        }
                        this.updateProductLabelInput(this.product)
                    }
                    // Hashtag
                    if (e.key == '#') {
                        // Open labels menu
                        this.$refs.labelList.$refs.popover.show()
                    }
                }
            }
            if (key == 'Tab') {
                e.preventDefault()
            }
        },
        async onUpdateProduct() {
            const product = Object.assign({}, this.product)
            delete product.selectionInputList
            await this.updateProduct(product)
        },
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
        // document.body.removeEventListener('keydown', this.keydownHandler)
    },
}
</script>

<style scoped lang="scss">
::v-deep {
    &.product-single {
        &.has-labels {
            &.has-budget {
                .label-list {
                    top: 64px;
                }
                > .flyin {
                    > .flyin-inner {
                        > .flyin-header {
                            margin-bottom: 48px;
                        }
                    }
                }
            }
            > .flyin {
                > .flyin-inner {
                    > .flyin-header {
                        margin-bottom: 40px;
                    }
                    background: white;
                    > .body {
                        border-top: $borderModule;
                    }
                }
            }
            .label-list {
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
            width: calc(100vw - 242px);
            > .flyin-inner {
                > .body {
                    grid-template-columns: 26% 26% 24% 24% !important;
                }
            }
            .flyin-header {
                > .left {
                    // max-width: 380px;
                    h3 {
                        max-width: calc(36vw - 92px);
                        overflow: hidden;
                    }
                }
            }
        }
        &.has-budget {
            > .flyin {
                > .flyin-inner {
                    > .flyin-header {
                        margin-bottom: 8px;
                    }
                    > .body {
                        border-top: $borderModule;
                    }
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

.product-single {
    .prices {
        label {
            white-space: nowrap;
        }
    }
    .details {
        background: $bgContent;
        ::v-deep {
            .body > *:not(:last-child) {
                margin-bottom: 16px;
            }
            .main-img {
                cursor: pointer;
                width: 100%;
                // height: 300px;
                overflow: hidden;
                border: $borderElHard;
                border-radius: $borderRadiusEl;
                position: relative;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center;
                }
                .controls {
                    position: absolute;
                    left: 4px;
                    top: 4px;
                    opacity: 0;
                }
                &:hover {
                    .controls {
                        opacity: 1;
                    }
                }
            }
            .product-variants {
                margin-top: 12px;
                white-space: nowrap;
                overflow-x: auto;
                margin-bottom: 8px;
                display: flex;
            }
        }
    }
    .image-drawer {
        position: absolute;
        right: 4px;
        top: 4px;
        padding: 4px;
        border: $borderElSoft;
        border-radius: $borderRadiusEl;
        border-color: transparent;
        z-index: 1;
        &:hover,
        &.hover {
            background: white;
            border-color: $borderColorEl;
            box-shadow: $shadowEl;
            .drawer {
                display: block;
            }
            .trigger {
                display: none;
            }
        }
        .drawer {
            display: none;
            overflow-y: auto;
            max-height: 200px;
            > :not(:last-child) {
                margin-bottom: 4px;
            }
        }
        > :not(:last-child) {
            margin-bottom: 4px;
        }
        .image-wrapper {
            width: 32px;
            height: 32px;
            border: $borderElSoft;
            border-radius: 4px;
            position: relative;
            cursor: pointer;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                position: absolute;
            }
            &.active {
                border: solid 2px $primary;
                cursor: default;
            }
        }
    }
}
</style>
