<template>
    <BaseFlyinColumn class="distribution">
        <template v-slot:header>
            <div class="tab-headers">
                <span :class="{active: currentTab == 'all'}" class="tab" 
                @click="currentTab = 'all'"> ALL
                    <span class="count">{{totalActionInputCount}}</span>
                </span>
                <span :class="{active: currentTab == 'ins'}" class="tab" 
                @click="currentTab = 'ins'"> IN
                    <span class="count">{{product.ins.length + product.focus.length}}</span>
                </span>
                <span :class="{active: currentTab == 'outs'}" class="tab" 
                @click="currentTab = 'outs'"> OUT
                    <span class="count">{{product.outs.length}}</span>
                </span>
                <span :class="{active: currentTab == 'nds'}" class="tab" 
                @click="currentTab = 'nds'"> ND
                    <span class="count">{{product.nds.length}}</span>
                </span>
            </div>
        </template>
        <template v-slot>
            <div class="tab-body">
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
                    <div class="focus" v-for="action in product.focus" :key="action.user.id">
                        <div>
                            <span class="user">{{action.user.name}}</span>
                            <span class="email">{{action.user.email}}</span>
                        </div>
                        <span class="focus">Focus <i class="fas fa-star"></i></span>
                    </div>
                </template>
                <!-- In users -->
                <template v-if="currentTab == 'all' || currentTab == 'ins'">
                    <div class="in" v-for="action in product.ins" :key="action.user.id">
                        <div>
                            <span class="user">{{action.user.name}}</span>
                            <span class="email">{{action.user.email}}</span>
                        </div>
                    </div>
                </template>
                <!-- Out users -->
                <template v-if="currentTab == 'all' || currentTab == 'outs'">
                    <div class="out" v-for="action in product.outs" :key="action.user.id">
                        <div>
                            <span class="user">{{action.user.name}}</span>
                            <span class="email">{{action.user.email}}</span>
                        </div>
                    </div>
                </template>
                <!-- Nds -->
                <template v-if="currentTab == 'all' || currentTab == 'nds'">
                    <div class="nd" v-for="user in product.nds" :key="user.id">
                        <div>
                            <span class="user">{{user.name}}</span>
                            <span class="email">{{user.email}}</span>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </BaseFlyinColumn>
</template>

<script>
export default {
    name: 'distibutionSection',
    props: [
        'product'
    ],
    data: function () { return {
            currentTab: 'all',
            currentImgIndex: 0,
    }},
    computed: {
        totalActionInputCount() {
            return this.product.feedbacks.length + this.product.nds.length
        },
        focusStyle() {
            const width = this.totalActionInputCount ? this.product.focus.length / this.totalActionInputCount : 0
            return {
                calcX: 0,
                calcWidth: width,
                x: 0,
                width: `${width * 100}%`,
            }
        },
        inStyle() {
            const x = this.focusStyle.calcX + this.focusStyle.calcWidth
            const width = this.totalActionInputCount ? this.product.ins.length / this.totalActionInputCount : 0
            return {
                calcX: x,
                calcWidth: width,
                x: `${x * 100}%`,
                width: `${width * 100}%`,
            }
        },
        outStyle() {
            const x = this.inStyle.calcX + this.inStyle.calcWidth
            const width = this.totalActionInputCount ? this.product.outs.length / this.totalActionInputCount : 0
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
    background: $bgContentAlt;
    .tab-headers {
        display: flex;
        height: 100%;
    }
    .tab {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        background: $bgContentAlt;
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
            margin-bottom: 8px;
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