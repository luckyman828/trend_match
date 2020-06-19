<template>
    <div class="variant-list-item-wrapper" :class="{'has-action': variant[currentAction] != 'None'}">
        <!-- <v-popover :disabled="multiSelectionMode"> -->
            <div class="variant-item-wrapper">
                <BaseShape class="variant-list-item" shapeClass="pill ghost sm"
                targetAreaPadding="8px 2px">
                    <span>{{variant.name || 'Unnamed' | truncate(variantNameTruncateLength())}}</span>
                    <div class="bar" :class="{full: minimumPercentage >= 100}" :style="{width: `${minimumPercentage}%`}"></div>
                </BaseShape>
                <!-- <div class="variant-list-item pill ghost xs">
                    <span>{{variant.name || 'Unnamed' | truncate(variantNameTruncateLength())}}</span>
                </div> -->
                <div class="your-action" v-if="!multiSelectionMode && variant[currentAction] != 'None'">
                    <div class="pill ghost xs">
                        <i v-if="variant[currentAction] == 'Focus'" class="fas fa-star primary"></i>
                        <i v-if="variant[currentAction] == 'In'" class="fas fa-heart green"></i>
                        <i v-if="variant[currentAction] == 'Out'" class="fas fa-times red"></i>
                        <span v-if="selection.budget > 0">{{variant.quantity}}</span>
                    </div>
                </div>
            </div>
            <!-- <template slot="popover">
                <div class="header">
                    <h4 class="primary">{{variant.name}}</h4>
                </div>
                <div class="action-list">

                    <div class="action-list-item">
                        <button :class="variant[currentAction] == 'Focus' ? 'primary' : 'ghost'"
                        @click="updateVariantAction('Focus')">
                            <i class="far fa-star"></i>
                        </button>
                        <span class="count">{{variant.allFocus}}</span>
                    </div>

                    <div class="action-list-item">
                        <button :class="variant[currentAction] == 'In' ? 'green' : 'ghost'"
                        @click="updateVariantAction('In')">
                            <i class="far fa-heart"></i>
                        </button>
                        <span class="count">{{variant.allIns}}</span>
                    </div>

                    <div class="action-list-item">
                        <button :class="variant[currentAction] == 'Out' ? 'red' : 'ghost'"
                        @click="updateVariantAction('Out')">
                            <i class="far fa-times"></i>
                        </button>
                        <span class="count">{{variant.allOuts}}</span>
                    </div>
                </div>

                <ActionDistributionList 
                :feedbackActions="variant.feedbacks" 
                :alignmentActions="variant.actions"
                defaultTab="feedback"/>

            </template>
        </v-popover> -->
    </div>
</template>

<script>
import ActionDistributionList from '../ActionDistributionList'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'variantListItem',
    props: [
        'variant',
        'product',
        'selection',
    ],
    components: {
        ActionDistributionList
    },
    filters: {
        truncate: function(text, length) {
            const clamp = '...'
            var node = document.createElement('div')
            node.innerHTML = text
            var content = node.textContent
            // return `<span>124</span>`
            return content.length > length ? content.slice(0, length) + clamp : content
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', {
            currentAction: 'currentSelectionModeAction',
            multiSelectionMode: 'getMultiSelectionModeIsActive',
        }),
        minimumPercentage() {
            const percentage = Math.min((this.variant.totalQuantity / this.product.min_variant_order) * 100, 100)
            return percentage ? percentage.toFixed(0) : 0
        }
    },
    methods: {
        ...mapActions('actions', ['insertOrUpdateProductActionPairs']),
        variantNameTruncateLength() {
            const amount = this.product.variants.length
            if (amount > 4) {
                return window.innerWidth > 1260 ? 12 : 6
            }
            else if (amount > 2) {
                return window.innerWidth > 1260 ? 20 : 15
            }
        },
        updateVariantAction(newAction) {
            // If the new action to set is the same as the one already set, return
            if (this.variant[this.currentAction] == newAction) return

            // Loop through all the variants. If their action is None, then give them a default action
            this.product.variants.forEach(variant => {
                if (variant[this.currentAction] == 'None') {
                    variant[this.currentAction] = 'In'
                }
            })

            // Set the variant feedback
            this.variant[this.currentAction] = newAction
            
            // Find the users feedback action for the product and make sure it is not None
            const authUserFeedback = this.product.feedbacks.find(x => x.user_id == this.authUser.id)
            if (authUserFeedback.action == 'None') {
                authUserFeedback.action = newAction
            }

            this.insertOrUpdateProductActionPairs({
                productActionPairs: [{
                    product: this.product, 
                    action: authUserFeedback
                }], 
                selection: this.selection
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.variant-list-item-wrapper {
    &:not(:last-child) {
        margin-right: 4px;
        &.has-action {
            margin-right: 12px;
        }
    }
}
.variant-item-wrapper {
    position: relative;
    .your-action {
        position: absolute;
        top: -16px;
        left: -8px;
        .pill {
            box-shadow: $shadowElSoft;
            background: white;
            height: 18px;
        }
    }
}
.variant-list-item {
    .bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: $bluegrey800;
        &.full {
            background: $green;
        }
    }
    ::v-deep {
        .base-shape {
            padding-bottom: 2px;
            position: relative;
            overflow: hidden;
            padding-right: 4px;
            &:hover {
                padding-right: 3px;
            }
        }
    }
}

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