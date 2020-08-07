<template>
    <div class="variant-list-item-wrapper" :class="{'has-action': variant[currentAction] != 'None'}">
        <div class="variant">
            <div class="img-wrapper">
                <!-- <img :src="variantImage(variant,'sm')"> -->
                <BaseVariantImg :variant="variant" size="sm"/>
                <div class="your-action" v-if="variant[currentAction] != 'None'">
                    <div class="pill ghost xs">
                        <i v-if="variant[currentAction] == 'Focus'" class="fas fa-star primary"></i>
                        <i v-if="variant[currentAction] == 'In'" class="fas fa-heart green"></i>
                        <i v-if="variant[currentAction] == 'Out'" class="fas fa-times red"></i>
                        <span v-if="showQty" class="quantity">{{variant.quantity}}</span>
                    </div>
                </div>
                <div class="quantity-progress" v-if="showQty" :class="{full: minimumPercentage >= 100}" :style="{width: `${minimumPercentage}%`}"></div>
            </div>
            <div class="color-wrapper">
                <div class="circle-img"><img :src="variantImage(variant, 'sm')"></div>
                <span>{{variant.name || 'Unnamed' | truncate(6)}}</span>
            </div>
        </div>
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
        'selectionInput',
        'distributionScope',
    ],
    data() { return {
        tooltipIsVisible: false
    }},
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
            showQty: 'getQuantityModeActive',
            currentSelectionMode: 'currentSelectionMode'
        }),
        minimumPercentage() {
            const totalQty = this.currentSelectionMode == 'Alignment' ? this.variant.totalQty : this.variant.totalFeedbackQuantity
            const percentage = Math.min((totalQty / this.product.min_variant_order) * 100, 100)
            return percentage ? percentage.toFixed(0) : 0
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.variant-list-item-wrapper {
    margin-bottom: 8px;
    &:not(:last-child) {
        margin-right: 8px;
    }
    &.active {
        .img-wrapper {
            border-color: $primary;
        }
    }
}
.variant .img-wrapper {
    position: relative;
    overflow: hidden;
    .quantity-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 8px;
        background: $bluegrey800;
        border-radius: 0 4px 4px 0;
        &.full {
            background: $green;
        }
    }
    .your-action {
        position: absolute;
        top: 4px;
        left: 4px;
        .pill {
            background: white;
            box-shadow: $shadowXs;
        }
        // span {
        //     margin-left: 4px;
        //     margin-right: 7px
        // }
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
    display: inline-block;
    cursor: pointer;
    // &:not(:last-child) {
    //     margin-right: 16px;
    // }
    .img-wrapper {
        height: 124px;
        width: 94px;
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
            line-height: 1;
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