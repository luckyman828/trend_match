<template>
    <div class="variant-tooltip">

        <div class="header">
            <h4 class="primary">{{variant.name || 'Unnamed'}}</h4>
        </div>
        <div :class="{'col-2': showQty && selectionMode != 'Approval'}">
            <div class="action-list">

                <div class="action-list-item">
                    <BaseButton :buttonClass="variant[currentAction] == 'Focus' ? 'primary' : 'ghost'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    @click="updateVariantAction('Focus')">
                        <i class="far fa-star"></i>
                    </BaseButton>
                    <span class="count">{{variant.allFocus}}</span>
                </div>

                <div class="action-list-item">
                    <BaseButton :buttonClass="variant[currentAction] == 'In' ? 'green' : 'ghost'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    @click="updateVariantAction('In')">
                        <i class="far fa-heart"></i>
                    </BaseButton>
                    <span class="count">{{variant.allIns}}</span>
                </div>

                <div class="action-list-item">
                    <BaseButton :buttonClass="variant[currentAction] == 'Out' ? 'red' : 'ghost'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    @click="updateVariantAction('Out')">
                        <i class="far fa-times"></i>
                    </BaseButton>
                    <span class="count">{{variant.allOuts}}</span>
                </div>
            </div>

            <div class="quantity-input" v-if="showQty && selectionMode != 'Approval'">
                <BaseInputField ref="qtyInput" inputClass="small" v-model.number="newQuantity"
                :selectOnFocus="true" type="number"
                @keyup.enter.native="onSubmitQuantity"/>
                <div class="total" v-tooltip.right="'total quantity input / variant minimum'">
                    <span>{{variant.totalQuantity}} / {{product.min_variant_order}}</span>
                </div>
            </div>
        </div>

        <ActionDistributionList 
        :feedbackActions="variant.feedbacks" 
        :alignmentActions="variant.actions"
        :defaultTab="actionDistributionTooltipTab"
        :displayQty="showQty"
        @changeTab="event => $emit('changeTab', event)"/>
    </div>
</template>

<script>
import ActionDistributionList from './ActionDistributionList'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'variantTooltip',
    components: {
        ActionDistributionList
    },
    props: [
        'variant',
        'product',
        'selectionInput',
        'selection',
        'actionDistributionTooltipTab',
    ],
    data() { return {
        newQuantity: this.variant.quantity,
    }},
    watch: {
        variant(newVariant) {
            this.newQuantity = newVariant.quantity
            this.$nextTick(() => {
                this.focusQtyInput()
            })
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', {
            selectionMode: 'currentSelectionMode',
            currentAction: 'currentSelectionModeAction',
            getUserWriteAccess: 'getAuthUserSelectionWriteAccess',
        }),
        userWriteAccess () {
            return this.getUserWriteAccess(this.selection)
        },
        showQty() {
            return this.selection.budget > 0
        }
    },
    
    methods: {
        ...mapActions('actions', ['updateFeedbacks', 'updateActions']),
        focusQtyInput() {
            if (this.showQty) {
                this.$refs.qtyInput.focus()
            }
        },
        updateVariantAction(newAction) {
            // If the new action to set is the same as the one already set, return
            // if (this.variant[this.currentAction] == newAction) return

            // Loop through all the variants. If their action is None, then give them a default action
            this.product.variants.forEach(variant => {
                if (variant.id != this.variant.id && variant[this.currentAction] == 'None') {
                    if (newAction == 'Out') variant[this.currentAction] = 'Out'
                    else variant[this.currentAction] = 'In'
                }
            })

            // Set the variant feedback
            this.variant[this.currentAction] = newAction
            if (newAction == 'Out') {
                this.variant.quantity = 0
                this.newQuantity = 0
            }
            let currentAction 
            
            if (this.selectionMode == 'Feedback') {
                // Find the users feedback action for the product and make sure it is not None
                currentAction = this.selectionInput.yourSelectionFeedback
            }
            if (this.selectionMode == 'Alignment') {
                // Find the users feedback action for the product and make sure it is not None
                currentAction = this.selectionInput.selectionAction
            }

            // If the product has no action, set it's action to the variants new action
            if (currentAction.action == 'None') {
                currentAction.action = newAction
            }
            // If all variants are marked OUT, mark the product OUT
            else if (!this.selectionInput.variants.find(variant => ['Focus', 'In', 'None'].includes(variant[this.currentAction]))) {
                currentAction.action = 'Out'
            }
            // If at least ONE varaint in IN or FOCUS mark the product as IN
            else if (this.selectionInput.variants.find(variant => ['Focus', 'In'].includes(variant[this.currentAction]))) {
                if (this.selectionInput[this.currentAction] != 'Focus') {
                    currentAction.action = 'In'
                }
            }

            if (this.selectionMode == 'Feedback') {
                this.updateFeedbacks({actions: [currentAction], newAction})
            }
            if (this.selectionMode == 'Alignment') {
                this.updateActions({actions: [currentAction], newAction})
            }

        },
        onSubmitQuantity() {
            const newQty = this.newQuantity
            this.variant.quantity = newQty
            let actionToSet = this.variant.action
            if (newQty > 0 && ['None', 'Out'].includes(this.variant.action)) {
                actionToSet = 'In'
            }
            // if (newQty == 0) actionToSet = 'Out'
            this.updateVariantAction(actionToSet)
        }
    },
    mounted() {
        this.focusQtyInput()
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

div.header {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-bottom: solid 1px $divider;
    h4 {
        font-size: 12px;
        color: $primary;
        font-weight: 700;
        margin: 0;
        max-width: 148px;
        word-break: break-all;
    }
}
.quantity-input {
    padding: 8px 16px 12px 0;
    .total {
        margin-left: 12px;
        font-size: 12px;
    }
}

.action-list {
    margin: 8px auto 12px;
    display: flex;
    justify-content: center;
    ::v-deep {
        .action-list-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            button {
                width: 32px;
                max-width: 32px;
                border-radius: 0;
            }
            .count {
                margin-top: 4px;
                line-height: 1;
                font-size: 14px;
            }
            &:first-child button {
                border-radius: 4px 0 0 4px;
            }
            &:last-child button {
                border-radius: 0 4px 4px 0;
            }
        }
    }
}
</style>