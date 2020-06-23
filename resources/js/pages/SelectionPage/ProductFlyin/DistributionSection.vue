<template>
    <BaseFlyinColumn class="distribution">
        <template v-slot:header>
            <div class="tab-headers">
                <div :class="{active: currentTab == 'all'}" class="tab" 
                @click="currentTab = 'all'"> ALL
                    <span class="count">{{totalInputCount}}</span>
                </div>
                <div :class="{active: currentTab == 'ins'}" class="tab" 
                @click="currentTab = 'ins'"> IN
                    <span class="count">{{product.ins.length + product.focus.length + product.alignmentIns.length + product.alignmentFocus.length}}</span>
                </div>
                <div :class="{active: currentTab == 'outs'}" class="tab" 
                @click="currentTab = 'outs'"> OUT
                    <span class="count">{{product.outs.length + product.alignmentOuts.length}}</span>
                </div>
                <div :class="{active: currentTab == 'nds'}" class="tab" 
                @click="currentTab = 'nds'"> ND
                    <span class="count">{{product.nds.length + product.alignmentNds.length}}</span>
                </div>
            </div>
        </template>
        <template v-slot>
            <div class="tab-body">
                <!-- Totals -->
                <!-- <template v-if="totalFeedbackInputCount > 0 && totalActionInputCount > 0">
                    <div class="list-item list-header">
                        <h4>Total</h4>
                    </div>
                    <div class="distribution-bar list-item">
                        <svg>
                            <rect class="bg" height="8px" width="100%"/>
                            <rect class="focus" height="8px" :style="totalFocusStyle"/>
                            <rect class="in" height="8px" :style="totalInStyle"/>
                            <rect class="out" height="8px" :style="totalOutStyle"/>
                        </svg>
                    </div>
                </template> -->

                <!-- Quantity / Minimum -->
                 <template v-if="showQty">
                    <div class="list-item list-header">
                        <h4>Minimum</h4>
                    </div>
                    <div class="distribution-bar list-item" v-tooltip="`
                        <strong>Quantity: </strong> ${product.quantity}
                        <br><strong>Minimum: </strong> ${product.min_order}
                    `">
                        <svg>
                            <rect class="bg" height="8px" width="100%"/>
                            <rect :class="minimumPercentage >= 100 ? 'in' : 'progress'" height="8px" :style="{width: `${minimumPercentage}%`}"/>
                        </svg>
                    </div>
                </template>

                <!-- Alignment -->
                <template v-if="totalActionInputCount > 0">
                    <div class="list-item list-header">
                        <h4>Alignment</h4>
                    </div>
                    <div class="distribution-bar list-item">
                        <svg>
                            <rect class="bg" height="8px" width="100%"/>
                            <rect class="focus" height="8px" :style="alignmentFocusStyle"/>
                            <rect class="in" height="8px" :style="alignmentInStyle"/>
                            <rect class="out" height="8px" :style="alignmentOutStyle"/>
                        </svg>
                    </div>
                    <!-- Focus users -->
                    <template v-if="currentTab == 'all' || currentTab == 'ins'">
                        <div class="list-item" v-for="action in product.alignmentFocus" :key="`alignment-${action.selection_id}-${action.user_id}`">
                            <div class="focus inner">
                                <div>
                                    <span class="selection">{{action.selection.name}}</span>
                                    <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                    <span v-if="action.user" class="email">{{action.user.email}}</span>
                                </div>
                                <span class="quantity" v-if="showQty"><i class="fas fa-box"></i> {{action.variants.reduce((total, variant) => { return total + variant.quantity}, 0)}}</span>
                                <span class="focus">Focus <i class="fas fa-star"></i></span>
                            </div>
                        </div>
                    </template>
                    <!-- In users -->
                    <template v-if="currentTab == 'all' || currentTab == 'ins'">
                        <div class="list-item" v-for="action in product.alignmentIns" :key="`alignment-${action.selection_id}-${action.user_id}`">
                            <div class="in inner">
                                <div>
                                    <span class="selection">{{action.selection.name}}</span>
                                    <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                    <span v-if="action.user" class="email">{{action.user.email}}</span>
                                    <span class="quantity" v-if="showQty"><i class="fas fa-box"></i> {{action.variants.reduce((total, variant) => { return total + variant.quantity}, 0)}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- Out users -->
                    <template v-if="currentTab == 'all' || currentTab == 'outs'">
                        <div class="list-item" v-for="action in product.alignmentOuts" :key="`alignment-${action.selection_id}-${action.user_id}`">
                            <div class="out inner">
                                <div>
                                    <span class="selection">{{action.selection.name}}</span>
                                    <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                    <span v-if="action.user" class="email">{{action.user.email}}</span>
                                    <span class="quantity" v-if="showQty"><i class="fas fa-box"></i> {{action.variants.reduce((total, variant) => { return total + variant.quantity}, 0)}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- Nds -->
                    <template v-if="currentTab == 'all' || currentTab == 'nds'">
                        <div class="list-item" v-for="action in product.alignmentNds" :key="`alignment-${action.selection_id}`">
                            <div class="nd inner">
                                <div>
                                    <span class="selection">{{action.selection.name}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>

                <!-- Feedback -->
                <template v-if="totalFeedbackInputCount > 0">
                    <div class="list-item list-header">
                        <h4>Feedback</h4>
                    </div>
                    <div class="distribution-bar list-item">
                        <svg>
                            <rect class="bg" height="8px" width="100%"/>
                            <rect class="focus" height="8px" :style="focusStyle"/>
                            <rect class="in" height="8px" :style="inStyle"/>
                            <rect class="out" height="8px" :style="outStyle"/>
                        </svg>
                    </div>
                    <!-- Focus users -->
                    <template v-if="currentTab == 'all' || currentTab == 'ins'">
                        <div class="list-item" v-for="action in product.focus" :key="`${action.selection_id}-${action.user_id}`">
                            <div class="focus inner">
                                <div>
                                    <span class="selection">{{action.selection.name}}</span>
                                    <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                    <span v-if="action.user" class="email">{{action.user.email}}</span>
                                </div>
                                <span class="focus">Focus <i class="fas fa-star"></i></span>
                            </div>
                        </div>
                    </template>
                    <!-- In users -->
                    <template v-if="currentTab == 'all' || currentTab == 'ins'">
                        <div class="list-item" v-for="action in product.ins" :key="`${action.selection_id}-${action.user_id}`">
                            <div class="in inner">
                                <div>
                                    <span class="selection">{{action.selection.name}}</span>
                                    <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                    <span v-if="action.user" class="email">{{action.user.email}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- Out users -->
                    <template v-if="currentTab == 'all' || currentTab == 'outs'">
                        <div class="list-item" v-for="action in product.outs" :key="`${action.selection_id}-${action.user_id}`">
                            <div class="out inner">
                                <div>
                                    <span class="selection">{{action.selection.name}}</span>
                                    <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                    <span v-if="action.user" class="email">{{action.user.email}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- Nds -->
                    <template v-if="currentTab == 'all' || currentTab == 'nds'">
                        <div class="list-item" v-for="action in product.nds" :key="`${action.selection_id}-${action.user_id}`">
                            <div class="nd inner">
                                <div>
                                    <span class="selection">{{action.selection.name}}</span>
                                    <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                    <span v-if="action.user" class="email">{{action.user.email}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
            </div>
        </template>
    </BaseFlyinColumn>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'distibutionSection',
    props: [
        'product'
    ],
    data: function () { return {
            currentTab: 'all',
            currentImgIndex: 0,
            // includeNdsInTotalBar: true,
            // includeNdsInAlignmentBar: true,
            // includeNdsInFeedbackBar: true,
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', ['currentSelection']),
        ...mapGetters('selections', {
            showQty: 'getQuantityModeActive'
        }),
        totalFeedbackInputCount() {
            return this.product.feedbacks.length
        },
        totalActionInputCount() {
            return this.product.actions.length
        },
        totalInputCount() {
            return this.totalFeedbackInputCount + this.totalActionInputCount
        },
        focusStyle() {
            const width = this.totalFeedbackInputCount ? this.product.focus.length / this.totalFeedbackInputCount : 0
            return {
                calcX: 0,
                calcWidth: width,
                x: 0,
                width: `${width * 100}%`,
            }
        },
        inStyle() {
            const x = this.focusStyle.calcX + this.focusStyle.calcWidth
            const width = this.totalFeedbackInputCount ? this.product.ins.length / this.totalFeedbackInputCount : 0
            return {
                calcX: x,
                calcWidth: width,
                x: `${x * 100}%`,
                width: `${width * 100}%`,
            }
        },
        outStyle() {
            const x = this.inStyle.calcX + this.inStyle.calcWidth
            const width = this.totalFeedbackInputCount ? this.product.outs.length / this.totalFeedbackInputCount : 0
            return {
                calcX: x,
                calcWidth: width,
                x: `${x * 100}%`,
                width: `${width * 100}%`,
            }
        },
        alignmentFocusStyle() {
            const width = this.totalActionInputCount ? this.product.alignmentFocus.length / this.totalActionInputCount : 0
            return {
                calcX: 0,
                calcWidth: width,
                x: 0,
                width: `${width * 100}%`,
            }
        },
        alignmentInStyle() {
            const x = this.alignmentFocusStyle.calcX + this.alignmentFocusStyle.calcWidth
            const width = this.totalActionInputCount ? this.product.alignmentIns.length / this.totalActionInputCount : 0
            return {
                calcX: x,
                calcWidth: width,
                x: `${x * 100}%`,
                width: `${width * 100}%`,
            }
        },
        alignmentOutStyle() {
            const x = this.alignmentInStyle.calcX + this.alignmentInStyle.calcWidth
            const width = this.totalActionInputCount ? this.product.alignmentOuts.length / this.totalActionInputCount : 0
            return {
                calcX: x,
                calcWidth: width,
                x: `${x * 100}%`,
                width: `${width * 100}%`,
            }
        },
        totalFocusStyle() {
            const width = this.totalInputCount ? (this.product.alignmentFocus.length + this.product.focus.length) / this.totalInputCount : 0
            return {
                calcX: 0,
                calcWidth: width,
                x: 0,
                width: `${width * 100}%`,
            }
        },
        totalInStyle() {
            const x = this.totalFocusStyle.calcX + this.totalFocusStyle.calcWidth
            const width = this.totalInputCount ? (this.product.alignmentIns.length + this.product.ins.length) / this.totalInputCount : 0
            return {
                calcX: x,
                calcWidth: width,
                x: `${x * 100}%`,
                width: `${width * 100}%`,
            }
        },
        totalOutStyle() {
            const x = this.totalInStyle.calcX + this.totalInStyle.calcWidth
            const width = this.totalInputCount ? (this.product.alignmentOuts.length + this.product.outs.length) / this.totalInputCount : 0
            return {
                calcX: x,
                calcWidth: width,
                x: `${x * 100}%`,
                width: `${width * 100}%`,
            }
        },
        minimumPercentage() {
            return this.product.min_order ? Math.min((this.product.quantity / this.product.min_order * 100), 100).toFixed(0) : 100

        }
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.distribution {
    background: $bg;
    .tab-headers {
        display: flex;
        height: 100%;
        border-radius: $borderRadiusEl;
        border: $borderElSoft;
    }
    .tab {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        background: $bg;
        height: 100%;
        text-align: center;
        font-weight: 700;
        color: $fontSoft;
        cursor: pointer;
        padding: 2px 1px 2px 2px;
        user-select: none;
        &:first-child {
            border-radius: $borderRadiusEl 0 0 $borderRadiusEl;
        }
        &:last-child {
            border-radius: 0 $borderRadiusEl $borderRadiusEl 0;
            padding: 2px;
        }
        &:not(:last-child) {
            border-right: $borderEl;
        }
        &:hover {
            padding: 0;
            color: $primary;
            border: $borderElHover;
            box-shadow: $shadowEl;
        }
        &:active {
            transform: $transformElActive;
        }
        .count {
            color: $font;
            font-size: 12px;
            font-weight: 500;
            margin-left: 8px;
        }
        &.active {
            background: white;
            color: $primary;
        }
    }
    .tab-body {
        .list-item {
            margin-bottom: 4px;
            background: white;
            border: $borderEl;
            box-shadow: $shadowEl;
            border-radius: $borderRadiusEl;
            position: relative;
            &.list-header {
                padding: 8px 12px 4px;
                &:not(:first-child) {
                    margin-top: 20px;
                }
                h4 {
                    margin: 0;
                }
            }
            .inner {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px 4px;
            }
            span {
                display: block;
            }
            .quantity {
                position: absolute;
                right: 14px;
                top: 4px;
                font-size: 12px;
                i {
                    margin-right: 2px;
                    font-size: 11px;
                }
            }
            > .focus {
                box-shadow: -8px 0 inset $primary;
                .focus {
                    font-size: 10px;
                    font-weight: 500;
                    color: $dark2;
                    display: flex;
                    margin-top: 2px;
                    i {
                        color: $primary;
                        margin-left: 4px;
                        font-size: 16px;
                        margin-top: -2px;
                    }
                }
            }
            .in {
                box-shadow: -8px 0 inset $green;
            }
            .out {
                box-shadow: -8px 0 inset $red;
            }
            .nd {
                box-shadow: -8px 0 inset $grey600;
            }
            &.distribution-bar {
                padding: 12px;
                display: flex;
                svg {
                    height: 8px;
                    border-radius: 4px;
                    .bg {
                        fill: $grey600;
                    }
                    .focus {
                        fill: $primary;
                    }
                    .in {
                        fill: $green;
                    }
                    .out {
                        fill: $red;
                    }
                    .progress {
                        fill: $bluegrey800;
                    }
                }
            }
        }
        .selection {
            font-size: 12px;
            font-weight: 500;
            color: $font;
        }
        .email {
            font-size: 12px;
        }
    }
    // .impact {
    //     display: inline-flex;
    //     align-items: center;
    //     float: right;
    //     // margin-right: 8px;
    //     font-size: 10px;
    //     font-weight: 500;
    //     color: $dark2;
    //     margin-top: 2px;
    //     .circle {
    //         margin-bottom: 2px;
    //         margin-left: 4px;
    //     }
    //     &.impact-1 {
    //         .circle {
    //             background: $red;
    //         }
    //     }
    //     &.impact-2 {
    //         .circle {
    //             background: $orange;
    //         }
    //     }
    //     &.impact-3 {
    //         .circle {
    //             background: $green;
    //         }
    //     }
    // }
}
</style>