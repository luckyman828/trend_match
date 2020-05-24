<template>
    <div class="variant-list-item-wrapper" :class="{'has-action': variant[currentAction] != 'None'}">
        <v-popover :disabled="multiSelectionMode">
            <div class="variant">
                <div class="img-wrapper">
                    <img :src="variantImage(variant)" @error="imgError(variant)">
                    <div class="your-action" v-if="!multiSelectionMode && variant[currentAction] != 'None'">
                        <div class="square xs" :class="
                        variant[currentAction] == 'Focus' ? 'primary'
                        : variant[currentAction] == 'In' ? 'green'
                        : 'red'">
                            <i v-if="variant[currentAction] == 'Focus'" class="fas fa-star"></i>
                            <i v-if="variant[currentAction] == 'In'" class="fas fa-heart"></i>
                            <i v-if="variant[currentAction] == 'Out'" class="fas fa-times"></i>
                        </div>
                    </div>
                </div>
                <div class="color-wrapper">
                    <div class="circle-img"><img :src="variantImage(variant)" @error="imgError(variant)"></div>
                    <span>{{variant.name || 'Unnamed' | truncate(6)}}</span>
                </div>
            </div>
            <template slot="popover">
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
        </v-popover>
    </div>
</template>

<script>
import ActionDistributionList from '../ActionDistributionList'
import variantImage from '../../../mixins/variantImage'
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
    mixins: [
        variantImage
    ],
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
    },
    methods: {
        ...mapActions('actions', ['insertOrUpdateProductActionPairs']),
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
        margin-right: 8px;
    }
}
.variant .img-wrapper {
    position: relative;
    .your-action {
        position: absolute;
        top: 4px;
        right: 4px;
        .square {
            box-shadow: $shadowXs;
        }
    }
}
.variant-list-item {
    padding-right: 4px;
    &:hover {
        padding-right: 3px;
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

.variant {
    width: 80px;
    display: inline-block;
    cursor: pointer;
    &:not(:last-child) {
        margin-right: 16px;
    }
    .img-wrapper {
        height: 108px;
        width: 80px;
        border-radius: 4px;
        border: solid 2px $divider;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
        }
    }
    .color-wrapper {
        overflow: hidden;
        margin-right: 4px;
        margin-top: 8px;
        display: flex;
        align-items: center;
        span {
            font-size: 10px;
            font-weight: 500;
            color: $dark2;
        }
        .circle-img {
            width: 12px;
            height: 12px;
            border-radius: 6px;
            border: solid 1px $light1;
            position: relative;
            overflow: hidden;
            margin-right: 4px;
            img {
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                position: absolute;
            }
        }
    }
    &.active {
        .img-wrapper {
            border-color: $primary;
        }
    }
}

</style>