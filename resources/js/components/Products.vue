<template>
    <div class="products card" :class="[{sticky: sticky}]">
        <div class="overlay" v-if="currentTask.completed.find(x => x.file_id == currentFile.id)">Task done</div>
        <div class="overlay" v-else-if="!currentTask.isActive">Task not started yet</div>
        <div class="scroll-bg"></div>
        <FlyIn ref="singleFlyIn" :visibleOverwrite="singleVisible" @close="onCloseSingle">
            <product-single :loading="loadingSingle" :authUser="authUser" :visible="singleVisible" @closeSingle="onCloseSingle" @onToggleInOut="toggleInOut" @nextProduct="nextSingle"/>
        </FlyIn>
        <div class="flex-table">
            <div class="header-row flex-table-row">
                <div class="product-totals">
                    <span>{{selectedCount}} selected</span>
                    <span v-if="products.length != totalProductCount">{{products.length}}/{{totalProductCount}} showing</span>
                    <span v-else>{{totalProductCount}} records</span>
                </div>

                <th class="select" v-if="currentTaskPermissions.select">
                    <span>Select</span>
                </th>
                <th class="clickable id" :class="{active: this.sortBy == 'datasource_id'}" @click="onSortBy('datasource_id', true)">
                    Id <i class="fas" :class="[(this.sortBy == 'datasource_id' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th class="image"></th>
                <th :class="{active: this.sortBy == 'title'}" class="clickable title" @click="onSortBy('title', true)">
                   Product name <i class="fas" :class="[(this.sortBy == 'title' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>

                <template v-if="currentTaskPermissions.feedback">
                    <th :class="{active: this.sortBy == 'focus'}" class="clickable square-wrapper focus" @click="onSortBy('focus', false)">
                        Focus <i class="fas" :class="[(this.sortBy == 'focus' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                    <th :class="{active: this.sortBy == 'ins'}" class="clickable square-wrapper" @click="onSortBy('ins', false)">
                        In <i class="fas" :class="[(this.sortBy == 'ins' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                    <th :class="{active: this.sortBy == 'outs'}" class="clickable square-wrapper" @click="onSortBy('outs', false)">
                        Out <i class="fas" :class="[(this.sortBy == 'outs' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                    <th v-if="currentTask.type != 'decision'" :class="{active: this.sortBy == 'nds'}" class="clickable square-wrapper nds" @click="onSortBy('nds', false)">
                        ND <i class="fas" :class="[(this.sortBy == 'nds' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                </template>

                <th v-else-if="currentTaskPermissions.focus" :class="{active: this.sortBy == 'focus'}" class="clickable square-wrapper focus" @click="onSortBy('focus', false)">
                    Focus <i class="fas" :class="[(this.sortBy == 'focus' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>

                <th v-if="currentTaskPermissions.comments && !currentTask.parentTasks.find(x => x.type == 'alignment')" :class="{active: this.sortBy == 'commentsScoped'}" class="clickable square-wrapper comments" @click="onSortBy('commentsScoped', false)">
                    Comments <i class="fas" :class="[(this.sortBy == 'commentsScoped' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th v-if="currentTaskPermissions.requests" :class="{active: this.sortBy == 'requests'}" class="clickable square-wrapper comments" @click="onSortBy('requests', false)">
                    Requests <i class="fas" :class="[(this.sortBy == 'requests' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>

                <template v-if="currentTaskPermissions.actions">
                    <th :class="{active: this.sortBy == 'action'}" class="clickable action" @click="onSortBy('action', false)">
                        Action <i class="fas" :class="[(this.sortBy == 'action' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                </template>
                <template v-else>
                    <th class="action"></th>
                </template>

            </div>
            <template v-if="!loading">
                <div class="product-row flex-table-row"
                v-for="(product, index) in productsToShow" :key="product.id">
                
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
                    <td class="image clickable" @click="onViewSingle(product.id)"><img v-if="product.color_variants[0] != null" :src="productImg(product.color_variants[0])" @error="imgError(product.color_variants[0])"></td>
                    <td class="title clickable" @click="onViewSingle(product.id)"><span>{{product.title}}</span></td>
                    
                    <template v-if="currentTaskPermissions.feedback">
                        <tooltipAlt2 class="square-wrapper" :disabled="product.focus.length <= 0 || userPermissionLevel <= 1" :header="'focus'" :array="product.focus.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user.name != null) ? x.user.name : x.title : (x.user.name != null) ? x.user.name : x.title )">
                            <td class="square-wrapper focus"><span class="square light icon-left"><i class="far fa-star hide-screen-sm"></i>{{product.focus.length}}</span></td>
                        </tooltipAlt2>
                        <tooltipAlt2 class="square-wrapper" :disabled="product.ins.length <= 0 || userPermissionLevel <= 1" :header="'in'" :array="product.ins.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user.name != null) ? x.user.name : x.title : (x.user.name != null) ? x.user.name : x.title ).concat(product.focus.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user.name != null) ? x.user.name : x.title : (x.user.name != null) ? x.user.name : x.title ))">
                            <td class="square-wrapper"><span class="square light icon-left"><i class="far fa-heart hide-screen-sm"></i>{{product.ins.length + product.focus.length}}</span></td>
                        </tooltipAlt2>
                        <tooltipAlt2 class="square-wrapper" :disabled="product.outs.length <= 0 || userPermissionLevel <= 1" :header="'out'" :array="product.outs.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user.name != null) ? x.user.name : x.title : (x.user.name != null) ? x.user.name : x.title )">
                            <td class="square-wrapper"><span class="square light icon-left"><i class="far fa-times-circle hide-screen-sm"></i>{{product.outs.length}}</span></td>
                        </tooltipAlt2>
                        <tooltipAlt2 v-if="currentTask.type != 'decision'" class="square-wrapper" :disabled="product.nds.length <= 0 || userPermissionLevel <= 1" :header="'not decided'" :array="product.nds.map(x => (x.name != null) ? x.name : x.title)">
                            <td class="square-wrapper nds"><span class="square light icon-left"><i class="far fa-question-circle hide-screen-sm"></i>{{product.nds.length}} /{{product.ndsTotal}}</span></td>
                        </tooltipAlt2>
                    </template>
                    <template v-else-if="currentTaskPermissions.focus">
                        <tooltipAlt2 class="square-wrapper" :disabled="product.focus.length <= 0 || userPermissionLevel <= 1" :header="'focus'" :array="product.focus.map(x => (x.task) ? (x.task.type != 'feedback') ? x.task.title : (x.user.name != null) ? x.user.name : x.title : (x.user.name != null) ? x.user.name : x.title )">
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
                                <span class="button icon-right active green disabled">
                                    In  <i class="far fa-heart"></i>
                                </span>
                                <span class="button icon-right ghost disabled">
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
                <div v-if="products.length <= 0">
                    <p style="padding: 60px 0 100px; text-align: center;">No products to show. Try changing your filters.</p>
                </div>
            </template>
        </div>
        <!-- <span class="load-more button primary wide" v-if="products.length > pageLimit" @click="loadMore">Loasd more</span> -->
        <template v-if="loading">
            <Loader/>
        </template>
    </div>
</template>

<script>
import Loader from './Loader'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProductTotals from './ProductTotals'
import ProductSingle from './ProductSingle'
import SelectDropdown from './SelectDropdown'
import RadioButtons from './RadioButtons'
import Dropdown from './Dropdown'
import FlyIn from './FlyIn'

import products from '../store/modules/products';

export default {
    name: 'products',
    props: [
        'products',
        'loading',
        'authUser',
        'collection',
        'selectedCount',
        'totalProductCount',
        'teams',
        'sortAsc',
        'sortBy',
        'selectedIds',
    ],
    components: {
        Loader,
        ProductTotals,
        ProductSingle,
        SelectDropdown,
        Dropdown,
        RadioButtons,
        FlyIn,
    },
    data: function() { return {
        tooltip: {
            active: false,
            position: {},
            type: 'none',
            header: '',
            data: {},
        },
        sticky: false,
        itemsPerPage: 5,
        pageLimit: 5,
    }},
    computed: {
        // ...mapGetters('entities/productFinalActions', ['loadingFinalActions']),
        ...mapGetters('entities/collections', ['currentFile', 'actionScope']),
        ...mapGetters('entities/products', ['singleVisible']),
        ...mapGetters('persist', ['currentTask', 'currentTaskPermissions', 'userPermissionLevel', 'currentWorkspaceId']),
        loadingSingle() {
            let loading = false
            return loading
        },
        hasAccess() {
            return (this.currentTask != null) ? true : false
        },
        productsToShow() {
            // const products = this.products.slice(0, this.pageLimit)
            return this.products
        }
    },
    methods: {
        ...mapActions('entities/actions', ['updateAction', 'updateTaskAction', 'deleteAction', 'deleteTaskAction', 'createTaskAction']),
        ...mapActions('entities/products', ['setCurrentProductId', 'setAvailableProductIds']),
        ...mapMutations('entities/products', ['setSingleVisisble']),
        ...mapMutations('entities/actions', ['setAction', 'setTaskAction', 'destroyAction', 'destroyTaskAction', 'setManyActions', 'setManyTaskActions']),
        ...mapMutations('entities/comments', ['setComment']),
        loadMore() {
            this.pageLimit += this.itemsPerPage
        },
        productImg(variant) {
            if (!variant.error && variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
                // return `https://devenviromentdiag.blob.core.windows.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        imgError (variant) {
             variant.error = true
        },
        toggleInOut(product, action) {
            if (this.currentTask.type == 'feedback') {
                // Check if we already have an action
                if (product.currentAction) {
                    // If we already have an action
                    if(product.currentAction.action != action) {
                        // UPDATE ACTION
                        this.updateAction({user_id: this.authUser.id, task_id: this.currentTask.id, productToUpdate: product.id, action_code: action, is_task_action: null})
                    }
                    else if(product.currentAction.action == 2 && action == 2) {
                        // TOGGLE FOCUS
                        this.updateAction({user_id: this.authUser.id, task_id: this.currentTask.id, productToUpdate: product.id, action_code: 1})
                    }
                    else {
                        // DELETE ACTION
                        this.deleteAction({user_id: this.authUser.id, task_id: this.currentTask.id, productToUpdate: product.id})
                    }
                } else {
                    // CREATE ACTION
                    this.updateAction({user_id: this.authUser.id, task_id: this.currentTask.id, productToUpdate: product.id, action_code: action, is_task_action: null})
                }
            } else {
                // Check if we already have an action
                if (product.currentAction) {
                    // If we already have an action
                    if(product.currentAction.action != action) {
                        // UPDATE ACTION
                        this.updateTaskAction({user_id: this.authUser.id, task_id: this.currentTask.id, productToUpdate: product.id, action_code: action, is_task_action: true})
                    }
                    else if(product.currentAction.action == 2 && action == 2) {
                        // TOGGLE FOCUS
                        this.updateTaskAction({user_id: this.authUser.id, task_id: this.currentTask.id, productToUpdate: product.id, action_code: 1})
                    }
                    else {
                        // DELETE ACTION
                        this.deleteTaskAction({task_id: this.currentTask.id, productToUpdate: product.id})
                    }
                } else {
                    // CREATE ACTION
                    this.createTaskAction({user_id: this.authUser.id, task_id: this.currentTask.id, productToUpdate: product.id, action_code: action, is_task_action: true})
                }
            }
        },
        onViewSingle(id) {
            this.setCurrentProductId(id)
            this.setAvailableProductIds(this.products.map(x => x.id)) // Save array of available products
            this.setSingleVisisble(true)
            // this.$refs.singleFlyIn.toggle()
        },
        onSelect(index) {
            this.$emit('onSelect', index)
        },
        onSortBy(key, method) {
            this.$emit('onSortBy', key, method)
        },
        onCloseSingle() {
            // this.$refs.singleFlyIn.close()
            this.setSingleVisisble(false)
        },
        resetSelected() {
            document.querySelectorAll('.product-row input[type=checkbox]').forEach(input => {
                input.checked = false
            })
        },
        getPosition(element) {
            var xPosition = 0;
            var yPosition = 0;

            while(element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }

            return { x: xPosition, y: yPosition };
        },
        handleScroll (event) {
            // Fix table header to screen
            const theWindow = document.getElementById('main')
            let scrollDist = theWindow.scrollTop
            const stickyThis = document.querySelector('.product-tabs')
            const scrollBg = document.querySelector('.scroll-bg')
            const tableHeader = document.querySelector('.flex-table .header-row')
            const headerParent = tableHeader.parentElement
            // console.log(stickyThis.parentElement)
            const stickyThisTop = stickyThis.getBoundingClientRect().top - 70
            // console.log(this.getPosition(headerParent).x)
            if (scrollDist >= 130) {
                this.sticky = true
                stickyThis.classList.add('sticky')

                // scrollBg.style.cssText = `width: ${theWindow.scrollWidth}px; left: ${theWindow.offsetLeft}px`
                scrollBg.style.cssText = `width: ${theWindow.scrollWidth}px;`
                tableHeader.style.cssText = `width: ${headerParent.scrollWidth}px; left: ${this.getPosition(headerParent).x - 1}px`
            } else {
                this.sticky = false
                stickyThis.classList.remove('sticky')
            }
        },
        toggleDropdown(event) {
            const target = event.target
            let dropdown
            // Find child with class 'dropdown-menu
            target.childNodes.forEach(child => {
                if (child.classList != null)
                    if (child.classList.contains('dropdown-menu'))
                        dropdown = child
            })
            if(dropdown != null) {
                dropdown.classList.toggle('show')
            }
        },
        nextSingle() {
            // console.log('next product')
            // this.$refs.singleFlyIn.reset()
        }
    },
    created () {
        document.getElementById('main').addEventListener('scroll', this.handleScroll);

        // Setup event broadcast listening

        Echo.private(`workspace.${this.currentWorkspaceId}`)
        .listen('.action.updated', (e) => {
            const action = e.action
            console.log('%cPusher: Action Updated', 'font-weight: 900')
            this.setAction({ 
                productToUpdate: action.product_id, 
                task_id: action.task_id, 
                user_id: action.user_id, 
                action_code: action.action, 
                is_task_action: action.is_task_action 
            })
        })
        .listen('.action.deleted', (e) => {
            const action = e.action
            // console.log('%cPusher: Action Deleted', 'font-weight: 900')
            if (action.is_task_action) {
                this.destroyTaskAction({ 
                    productToUpdate: action.product_id, 
                    task_id: action.task_id, 
                })
            } else {
                this.destroyAction({ 
                    productToUpdate: action.product_id, 
                    task_id: action.task_id, 
                    user_id: action.user_id, 
                })
            }
        })
        .listen('.actions.many.updated', (e) => {
            const request = e.request
            // console.log('%cPusher: Action Many Updated', 'font-weight: 900')
            // console.log(e)
            if (request.is_task_action) {
                this.setManyTaskActions({ 
                    productIds: request.product_ids, 
                    task_id: request.task_id,
                    user_id: request.user_id,
                    action_code: request.action_code,
                    is_task_action: request.is_task_action,
                })
            } else {
                this.setManyActions({ 
                    productIds: request.product_ids, 
                    task_id: request.task_id,
                    user_id: request.user_id,
                    action_code: request.action_code,
                    is_task_action: request.is_task_action, 
                })
            }
        })
        .listen('.actions.many.created', (e) => {
            const actions = e.actions
            console.log('%cPusher: Action Many Created', 'font-weight: 900')
            console.log(e)
            if (actions[0].is_task_action) {
                this.setManyTaskActions({ 
                    productIds: actions.map(x => x.product_id), 
                    task_id: actions[0].task_id,
                    user_id: actions[0].user_id,
                    action_code: actions[0].action,
                    is_task_action: actions[0].is_task_action,
                })
            } else {
                this.setManyActions({
                    productIds: actions.map(x => x.product_id),
                    task_id: actions[0].task_id,
                    user_id: actions[0].user_id,
                    action_code: actions[0].action,
                    is_task_action: actions[0].is_task_action, 
                })
            }
        })
        .listen('.comment.updated', (e) => {
            const comment = e.comment
            console.log('%cPusher: Comment Updated', 'font-weight: 900')
            console.log(comment.comment)
            this.setComment({
                comment: comment.comment
            })
        })
        // .listen('.comment.deleted', (e) => {
        //     const comment = e.comment
        //     // console.log('%cPusher: Comment deleted', 'font-weight: 900')
        //     // console.log(e)
        // })
    },
    destroyed () {
        document.getElementById('main').removeEventListener('scroll', this.handleScroll);

        // Unsub from psuher broadcasting
        Echo.leaveChannel(`workspace.${this.currentWorkspaceId}`);
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
        &.load-more {
            position: absolute;
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
