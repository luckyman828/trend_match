<template>
    <div class="product-row flex-table-row">

            <!-- New comment Bullet  -->
            <span v-if="product.newComment" class="circle tiny primary"></span>
            <!-- END New comment Bullet  -->
            
            <td class="select" v-if="currentTaskPermissions.select">
                <label class="checkbox">
                    <input type="checkbox" @change="onSelect(index)" :ref="'checkbox-for-' + index"/>
                    <span class="checkmark"></span>
                </label>
            </td>
            <td class="id clickable bind-view-single" @click="onViewSingle(product.id)">{{product.datasource_id}}</td>
            <td class="image clickable" @click="onViewSingle(product.id)"><img v-if="product.color_variants[0] != null" :src="productImg(product.color_variants[0])"></td>
            <td class="title clickable" @click="onViewSingle(product.id)"><span>{{product.title}}</span></td>
            
            <template v-if="currentTaskPermissions.feedback">
                <tooltipAlt2 class="square-wrapper" :disabled="product.focus.length <= 0 || userPermissionLevel <= 1" :header="'focus'" :array="product.focus.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user && x.user.name != null) ? x.user.name : x.title : (x.user && x.user.name != null) ? x.user.name : x.title )">
                    <td class="square-wrapper focus"><span class="square light icon-left"><i class="far fa-star hide-screen-sm"></i>{{product.focus.length}}</span></td>
                </tooltipAlt2>
                <tooltipAlt2 class="square-wrapper" :disabled="(product.ins.length <= 0 && product.focus.length <= 0) || userPermissionLevel <= 1" :header="'in'" :array="product.ins.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user && x.user.name != null) ? x.user.name : x.title : (x.user && x.user.name != null) ? x.user.name : x.title ).concat(product.focus.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user && x.user.name != null) ? x.user.name : x.title : (x.user && x.user.name != null) ? x.user.name : x.title ))">
                    <td class="square-wrapper"><span class="square light icon-left"><i class="far fa-heart hide-screen-sm"></i>{{product.ins.length + product.focus.length}}</span></td>
                </tooltipAlt2>
                <tooltipAlt2 class="square-wrapper" :disabled="product.outs.length <= 0 || userPermissionLevel <= 1" :header="'out'" :array="product.outs.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user && x.user.name != null) ? x.user.name : x.title : (x.user && x.user.name != null) ? x.user.name : x.title )">
                    <td class="square-wrapper"><span class="square light icon-left"><i class="far fa-times-circle hide-screen-sm"></i>{{product.outs.length}}</span></td>
                </tooltipAlt2>
                <tooltipAlt2 v-if="currentTask.type != 'decision'" class="square-wrapper" :disabled="product.nds.length <= 0 || userPermissionLevel <= 1" :header="'not decided'" :array="product.nds.map(x => (x.name != null) ? x.name : x.title)">
                    <td class="square-wrapper nds"><span class="square light icon-left"><i class="far fa-question-circle hide-screen-sm"></i>{{product.nds.length}} /{{product.ndsTotal}}</span></td>
                </tooltipAlt2>
            </template>
            <template v-else-if="currentTaskPermissions.focus">
                <tooltipAlt2 class="square-wrapper" :disabled="product.focus.length <= 0 || userPermissionLevel <= 1" :header="'focus'" :array="product.focus.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user && x.user.name != null) ? x.user.name : x.title : (x.user && x.user.name != null) ? x.user.name : x.title )">
                    <td class="square-wrapper focus"><span class="square light icon-left"><i class="far fa-star hide-screen-sm"></i>{{product.focus.length}}</span></td>
                </tooltipAlt2>
            </template>

            <td v-if="currentTask.type == 'decision'" class="square-wrapper comments"><span class="square light icon-left clickable bind-view-single" @click="onViewSingle(product.id)"><i class="far fa-comment"></i>{{product.commentsInherited.length}}</span></td>
            <td v-else-if="currentTaskPermissions.comments && !currentTask.parentTasks.find(x => x.type == 'alignment')" class="square-wrapper comments"><span class="square light icon-left clickable bind-view-single" @click="onViewSingle(product.id)"><i class="far fa-comment"></i>{{product.commentsScoped.length}}</span></td>
            <td v-if="currentTaskPermissions.requests" class="square-wrapper comments"><span class="square light icon-left clickable bind-view-single" @click="onViewSingle(product.id)"><i class="far fa-clipboard-check"></i>{{product.requests.length}}</span></td>

            <template v-if="currentTaskPermissions.actions">
                <td class="action">
                    <span v-if="currentTaskPermissions.focus && currentTask.type != 'approval' && currentTask.type != 'decision'" class="square light-2 true-square clickable focus-action" :class="[(product.currentAction) ? (product.currentAction.action == 2) ? 'active light' : 'ghost primary-hover' : 'ghost primary-hover']" @click="toggleInOut(product, 2)">
                    <i class="far fa-star"></i>
                    </span>

                    <template v-if="product.outInFilter">
                        <TooltipAlt2 :body="'Out by ' + product.outInFilter.user.name + ' in ' + product.outInFilter.task.title">
                            <span class="button icon-right ghost disabled">
                                In  <i class="far fa-heart"></i>
                            </span>
                            <span class="button icon-right active red disabled">
                                Out  <i class="far fa-times-circle"></i>
                            </span>
                        </TooltipAlt2>
                    </template>
                    <template v-else-if="currentTask.type == 'approval' && product.requests.length < 1">
                        <span class="button icon-right disabled" :class="[(product.inheritedAction && product.inheritedAction.action >= 1) || (product.currentAction && prouct.currentAction.action >= 1) ? 'active green' : 'ghost']">
                            In  <i class="far fa-heart"></i>
                        </span>
                        <span class="button icon-right disabled" :class="[(product.inheritedAction && product.inheritedAction.action < 1) || (product.currentAction && prouct.currentAction.action < 1) ? 'active red' : 'ghost']">
                            Out  <i class="far fa-times-circle"></i>
                        </span>
                    </template>
                    <template v-else>
                        <template v-if="currentTask.type == 'decision'">

                            <span class="button icon-right" :class="[(product.currentAction) ? (product.currentAction.action == 0) ? 'ghost green-hover' : 'active green' : (product.inheritedAction) ? (product.inheritedAction.action == 0) ? 'ghost green-hover' : 'active green' : 'active green']" @click="toggleInOut(product, 1)">
                            In  <i class="far fa-heart"></i>
                            </span>
                            <span class="button icon-right" :class="[(product.currentAction) ? (product.currentAction.action == 0) ? 'active red' : 'ghost red-hover' : (product.inheritedAction) ? (product.inheritedAction.action == 0) ? 'active red' : 'ghost red-hover' : 'ghost red-hover']"  @click="toggleInOut(product, 0)">
                            Out  <i class="far fa-times-circle"></i>
                            </span>

                        </template>
                        <template v-else-if="userPermissionLevel != 3">
                            <span class="button icon-right" :class="[(product.currentAction) ? (product.currentAction.action != 0) ? 'active green' : 'ghost green-hover' : 'ghost green-hover', {disabled: (product.currentAction) ? product.currentAction.user.role_id == 3 : false}]" @click="toggleInOut(product, 1)">
                            In  <i class="far fa-heart"></i>
                            </span>
                            <span class="button icon-right" :class="[(product.currentAction) ? (product.currentAction.action == 0) ? 'active red' : 'ghost red-hover' : 'ghost red-hover', {disabled: (product.currentAction) ? product.currentAction.user.role_id == 3 : false}]"  @click="toggleInOut(product, 0)">
                            Out  <i class="far fa-times-circle"></i>
                            </span>

                        </template>
                        <template v-else>
                            <TooltipAlt2 :body="'Open product to accept request'">
    
                                <span class="button icon-right disabled" :class="[(product.currentAction) ? (product.currentAction.action != 0) ? 'active green' : 'ghost green-hover' : 'ghost green-hover', {disabled: (product.currentAction) ? product.currentAction.user.role_id != 3 : false}]">
                                In  <i class="far fa-heart"></i>
                                </span>
                                <span class="button icon-right disabled" :class="[(product.currentAction) ? (product.currentAction.action == 0) ? 'active red' : 'ghost red-hover' : 'ghost red-hover', {disabled: (product.currentAction) ? product.currentAction.user.role_id != 3 : false}]">
                                Out  <i class="far fa-times-circle"></i>
                                </span>

                            </TooltipAlt2>
                        </template>

                    </template>
                    <span class="view-single button invisible" @click="onViewSingle(product.id)">View</span>
                </td>
            </template>
            <template v-else>
                <td class="action">
                    <span class="view-single button invisible" @click="onViewSingle(product.id)">View</span>
                </td>
            </template>

        </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'productsRow',
    props: [
        'product',
        'index'
    ],
    computed: {
        ...mapGetters('persist', ['currentTask', 'currentTaskPermissions', 'userPermissionLevel']),
    },
    methods: {
        onViewSingle(productId) {
            this.$emit('onViewSingle', productId)
        },
        onSelect(index) {
            this.$emit('onSelect', index)
        },
        toggleInOut(product, actionCode) {
            this.$emit('toggleInOut', product, actionCode)
        },
        productImg(variant) {
            if (variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .overlay {
        display: block;
        position: absolute;
        color: white;
        justify-content: center;
        text-align: center;
        padding-top: 100px;
        font-size: 20px;
        z-index: 1;
    }

    .dropdown-parent {
        position: relative;
        cursor: pointer;
        &:hover {
            color: $dark;
        }
    }
    .products {
        margin-top: 0;
        position: relative;
        padding: 0;
        .circle.tiny {
            position: absolute;
            left: -26px;
        }
        &.sticky {
            margin-top: 90px;
            .scroll-bg {
                display: block;
                z-index: 8;
                position: fixed;
                right: 20px;
                top: 70px;
                right: 0;
                background: $light;
                width: 100%;
                height: 60px;
                box-shadow: 0 3px 5px rgba(0,0,0,.05) inset;
            }
            .header-row {
                position: fixed;
                top: $navbarHeight + 20px + 40px - 2px;
                z-index: 9;
                background: white;
                // width: calc(100% - 120px - 200px - 16px);
                margin-left: 1px;
                border-radius: 0 6px 0 0;
                box-shadow: 0 6px 3px -2px rgba(0,0,0, .05);
            }
        }
    }
    .scroll-bg {
        display: none;
    }
    .clickable {
        cursor: pointer;
    }
    .products {
        padding-top: 0;
    }
    .flex-table {
        .card > & {
            margin-left: 0;
            margin-right: 0;
            width: 100%;
        }
        &.disabled {
            .product-row {
                opacity: .5;
            }
        }
    }
    .flex-table-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        > * {
            &.select {
                margin-left: 16px;
                min-width: 80px;
            }
            &.id {
                min-width: 75px;
                margin-left: 16px;
            }
            &.image {
                margin: 8px 0 8px 16px;
                min-width: 55px;
            }
            &.title {
                width: 300px;
                min-width: 120px;
                margin-left: 16px;
                // padding-right: 16px;
            }
            &.focus {
                margin-left: auto;
            }
            &.square-wrapper, &.tooltip-wrapper .square-wrapper {
                min-width: 56px;
                margin-left: 16px;
                box-sizing: content-box;
                .square {
                    min-width: 56px;
                    width: auto;
                    padding: 0 4px;
                }
            }
            // &.nds {
            //     min-width: 100px;
            // }
            &.comments {
                min-width: 82px;
            }
            &.action {
                margin-left: 16px;
                margin-right: 16px;
                flex: 1;
                min-width: 284px;
                justify-content: flex-end;
                &:not(th) {
                    display: flex;
                }
            }
        }
    }
    .header-row {
        font-weight: 700;
        font-size: 12px;
        height: 45px;
        border-bottom: solid 2px $light1;
    }
    .product-row {
        border-bottom: solid 1px $light1;
        &.in {
            box-shadow: 4px 0 $green inset
        }
        &.out {
            box-shadow: 4px 0 $red inset
        }
        &:hover {
            background: $light;
        }
        .image {
            border: solid 1px $light2;
            height: 75px;
            position: relative;
            img {
                width: 100%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                padding: 1px;
            }
        }
    }
    th {
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: $dark2;
        white-space: nowrap;
        &.id {
            padding-left: 20px;
        }
        i {
            color: $light2;
            margin: 0;
            margin-left: 4px;
        }
        &.active {
            i {
                color: $primary
            }
        }
        &.action {
            text-align: right;
        }
    }
    td {
        &.title {
            font-size: 13px;
            color: $dark;
        }
    }
    .show-more {
        width: 100%;
        margin: 16px auto 0;
        text-align: center;
        display: inline-block;
    }
    .loading {
        animation: loading 2s;
        animation-iteration-count: infinite;
    }
    @keyframes loading {
        0% {opacity: 0;}
        50% {opacity: 1;}
        100% {opacity: 0;}
    }
    .checkbox {
      display: block;
      position: relative;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      margin-bottom: 0;
      padding-top: 5px;
      padding-bottom: 5px;
      display: flex;
      align-items: center;
      &:hover {
          background: $light;
      }
    }

    .checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .square {
        // background: $light1;
        color: $dark;
        // // padding: 7px 10px;
        // border-radius: 4px;
        // font-size: 14px;
        &:not(.true-square) {
            min-width: 58px;
        }
        font-weight: 600;
        i {
            color: $dark2;
            // margin-right: 12px;
            // font-size: 16px;
        }
        &.focus-action.active {
            i {
                font-weight: 900;
                color: $primary;
            }
        }
    }
    .button {
        min-width: 72px;
        &:nth-child(1n+2) {
            margin-left: 12px;
        }
    }
    .load-more {
        position: absolute;
        width: 100%;
        margin-top: 12px;
        .button {
            width: 100%;
            margin-left: 0;
            margin: 12px 0;
            height: 44px;
        }
    }
    .view-single {
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
    }
    // Table totals
    .product-totals {
        position: absolute;
        right: 0;
        top: -40px;
        height: 40px;
        line-height: 40px;
        span {
            font-weight: 500;
            font-size: 14px;
            &:not(:last-child) {
                margin-right: 20px;
            }
        }
    }

    // SMALL SCREENS AND HIGH DPI
    @media screen and (max-width: $screenSmall) {

        @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
        only screen and (-o-min-device-pixel-ratio: 13/10),
        only screen and (min-resolution: 120dpi)
        {
            
        }
    }
</style>