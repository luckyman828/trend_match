<template>
    <BaseFlyinColumn class="distribution">
        <template v-slot:header>
            <div class="tab-headers">
                <span :class="{active: currentTab == 'all'}" class="tab" 
                @click="currentTab = 'all'"> ALL
                    <span class="count">{{totalInputCount}}</span>
                </span>
                <span :class="{active: currentTab == 'ins'}" class="tab" 
                @click="currentTab = 'ins'"> IN
                    <span class="count">{{product.ins.length + product.focus.length + product.alignmentIns.length + product.alignmentFocus.length}}</span>
                </span>
                <span :class="{active: currentTab == 'outs'}" class="tab" 
                @click="currentTab = 'outs'"> OUT
                    <span class="count">{{product.outs.length + product.alignmentOuts.length}}</span>
                </span>
                <span :class="{active: currentTab == 'nds'}" class="tab" 
                @click="currentTab = 'nds'"> ND
                    <span class="count">{{product.nds.length + product.alignmentNds.length}}</span>
                </span>
            </div>
        </template>
        <template v-slot>
            <div class="tab-body">
                <!-- Totals -->
                <template v-if="totalFeedbackInputCount > 0 && totalActionInputCount > 0">
                    <h4 style="margin-top: 0;">Total</h4>
                    <div class="distribution-bar">
                        <svg>
                            <rect class="bg" height="8px" width="100%"/>
                            <rect class="focus" height="8px" :style="totalFocusStyle"/>
                            <rect class="in" height="8px" :style="totalInStyle"/>
                            <rect class="out" height="8px" :style="totalOutStyle"/>
                        </svg>
                    </div>
                </template>

                <!-- Alignment -->
                <template v-if="totalActionInputCount > 0">
                    <h4>Alignment</h4>
                    <div class="distribution-bar">
                        <svg>
                            <rect class="bg" height="8px" width="100%"/>
                            <rect class="focus" height="8px" :style="alignmentFocusStyle"/>
                            <rect class="in" height="8px" :style="alignmentInStyle"/>
                            <rect class="out" height="8px" :style="alignmentOutStyle"/>
                        </svg>
                    </div>
                    <!-- Focus users -->
                    <template v-if="currentTab == 'all' || currentTab == 'ins'">
                        <div class="focus" v-for="action in product.alignmentFocus" :key="`alignment-${action.selection_id}-${action.user_id}`">
                            <div>
                                <span class="selection">{{action.selection.name}}</span>
                                <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                <span v-if="action.user" class="email">{{action.user.email}}</span>
                            </div>
                            <span class="focus">Focus <i class="fas fa-star"></i></span>
                        </div>
                    </template>
                    <!-- In users -->
                    <template v-if="currentTab == 'all' || currentTab == 'ins'">
                        <div class="in" v-for="action in product.alignmentIns" :key="`alignment-${action.selection_id}-${action.user_id}`">
                            <div>
                                <span class="selection">{{action.selection.name}}</span>
                                <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                <span v-if="action.user" class="email">{{action.user.email}}</span>
                            </div>
                        </div>
                    </template>
                    <!-- Out users -->
                    <template v-if="currentTab == 'all' || currentTab == 'outs'">
                        <div class="out" v-for="action in product.alignmentOuts" :key="`alignment-${action.selection_id}-${action.user_id}`">
                            <div>
                                <span class="selection">{{action.selection.name}}</span>
                                <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                <span v-if="action.user" class="email">{{action.user.email}}</span>
                            </div>
                        </div>
                    </template>
                    <!-- Nds -->
                    <template v-if="currentTab == 'all' || currentTab == 'nds'">
                        <div class="nd" v-for="action in product.alignmentNds" :key="`alignment-${action.selection_id}`">
                            <div>
                                <span class="selection">{{action.selection.name}}</span>
                            </div>
                        </div>
                    </template>
                </template>

                <!-- Feedback -->
                <template v-if="totalFeedbackInputCount > 0">
                    <h4>Feedback</h4>
                    <div class="distribution-bar">
                        <svg>
                            <rect class="bg" height="8px" width="100%"/>
                            <rect class="focus" height="8px" :style="focusStyle"/>
                            <rect class="in" height="8px" :style="inStyle"/>
                            <rect class="out" height="8px" :style="outStyle"/>
                        </svg>
                    </div>
                    <!-- Focus users -->
                    <template v-if="currentTab == 'all' || currentTab == 'ins'">
                        <div class="focus" v-for="action in product.focus" :key="`${action.selection_id}-${action.user_id}`">
                            <div>
                                <span class="selection">{{action.selection.name}}</span>
                                <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                <span v-if="action.user" class="email">{{action.user.email}}</span>
                            </div>
                            <span class="focus">Focus <i class="fas fa-star"></i></span>
                        </div>
                    </template>
                    <!-- In users -->
                    <template v-if="currentTab == 'all' || currentTab == 'ins'">
                        <div class="in" v-for="action in product.ins" :key="`${action.selection_id}-${action.user_id}`">
                            <div>
                                <span class="selection">{{action.selection.name}}</span>
                                <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                <span v-if="action.user" class="email">{{action.user.email}}</span>
                            </div>
                        </div>
                    </template>
                    <!-- Out users -->
                    <template v-if="currentTab == 'all' || currentTab == 'outs'">
                        <div class="out" v-for="action in product.outs" :key="`${action.selection_id}-${action.user_id}`">
                            <div>
                                <span class="selection">{{action.selection.name}}</span>
                                <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                <span v-if="action.user" class="email">{{action.user.email}}</span>
                            </div>
                        </div>
                    </template>
                    <!-- Nds -->
                    <template v-if="currentTab == 'all' || currentTab == 'nds'">
                        <div class="nd" v-for="action in product.nds" :key="`${action.selection_id}-${action.user_id}`">
                            <div>
                                <span class="selection">{{action.selection.name}}</span>
                                <span class="user">{{action.user_id == authUser.id ? 'You' : action.user ? action.user.name : 'Anonymous'}}</span>
                                <span v-if="action.user" class="email">{{action.user.email}}</span>
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
        color: $dark2;
        cursor: pointer;
        border-radius: 4px 4px 0 0;
        &:not(:last-child) {
            margin-right: 4px;
        }
        &:hover {
            color: $primary;
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
        .distribution-bar {
            padding: 12px;
            // margin-bottom: 8px;
            svg {
                height: 8px;
                border-radius: 4px;
                .bg {
                    fill: $grey;
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
            }
        }
        > * {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px 4px;
            margin-bottom: 4px;
            background: white;
            span {
                display: block;
            }
            &.focus {
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
            &.in {
                box-shadow: -8px 0 inset $green;
            }
            &.out {
                box-shadow: -8px 0 inset $red;
            }
            &.nd {
                box-shadow: -8px 0 inset $grey2;
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