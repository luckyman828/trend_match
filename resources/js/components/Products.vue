<template>
    <div class="products card" :class="{sticky: sticky}">
        <div class="scroll-bg"></div>
        <product-totals :totalProductCount="totalProductCount" :selectedCount="selectedCount" :products="products"/>
        <product-single :loading="loadingSingle" :catalogue="collection" :sticky="sticky" :product="singleProductToShow" :nextProductID="nextSingleProductID" :prevProductID="prevSingleProductID" :authUser="authUser" @closeSingle="onCloseSingle" @nextSingle="onNextSingle" @prevSingle="onPrevSingle" @onToggleInOut="toggleInOut"/>
        <div class="flex-table" :class="{disabled: singleProductToShow.id != null}">
            <div class="header-row flex-table-row">
                <th class="select dropdown-parent" @click="toggleDropdown($event)" v-if="authUser.role_id >= 2">
                    <!-- <DropdownCheckbox :title="'Select matching:'" :options="['No IN', 'No COMMENT & no OUT']" @submit="selectByCondition">
                        <template v-slot:button="slotProps">
                            <span @click="slotProps.toggle">Select <i class="fas fa-chevron-down"></i></span>
                        </template>
                    </DropdownCheckbox> -->
                    <DropdownRadio class="dropdown-parent left" :title="'Select by condition'" :currentOptionId="currentTeamId" :options="[{title: 'No IN', id: 'No IN'}, {title: 'No COMMENT & no OUT', id: 'No COMMENT & no OUT'}]" @submit="selectByCondition">
                        <template v-slot:button="slotProps">
                            <span @click="slotProps.toggle">Select <i class="fas fa-chevron-down"></i></span>
                        </template>
                    </DropdownRadio>
                    <!-- <DropdownRadio :options="teams" :currentOptionId="currentTeamId" class="dropdown-parent right">
                        <template v-slot:button="slotProps">
                            <div class="dropdown-button" @click="slotProps.toggle">
                                <img src="/assets/Path5699.svg">
                                <span>{{slotProps.currentOption.title}}</span>
                                <i class="far fa-chevron-down"></i>
                            </div>
                        </template>
                    </DropdownRadio> -->
                </th>
                <th class="clickable id" :class="{active: this.sortBy == 'datasource_id'}" @click="onSortBy('datasource_id', true)">
                    Id <i class="fas" :class="[(this.sortBy == 'datasource_id' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th class="image"></th>
                <th :class="{active: this.sortBy == 'title'}" class="clickable title" @click="onSortBy('title', true)">
                   Product name <i class="fas" :class="[(this.sortBy == 'title' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'focus'}" class="clickable square-wrapper focus" @click="onSortBy('focus', false)">
                    Focus <i class="fas" :class="[(this.sortBy == 'focus' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'ins'}" class="clickable square-wrapper" @click="onSortBy('ins', false)">
                    In <i class="fas" :class="[(this.sortBy == 'ins' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'outs'}" class="clickable square-wrapper" @click="onSortBy('outs', false)">
                    Out <i class="fas" :class="[(this.sortBy == 'outs' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'nds'}" class="clickable square-wrapper nds" @click="onSortBy('nds', false)">
                    ND <i class="fas" :class="[(this.sortBy == 'nds' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'comments'}" class="clickable square-wrapper comments" @click="onSortBy('comments', false)">
                    Comments <i class="fas" :class="[(this.sortBy == 'comments' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>

                <template v-if="userPermissionLevel >= 2">
                    <th :class="{active: this.sortBy == actionScope}" class="clickable action" @click="onSortBy(actionScope, false)">
                        {{actionScopeName}} <i class="fas" :class="[(this.sortBy == actionScope && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                </template>
                <template v-else>
                    <th class="action"></th>
                </template>

            </div>
            <template v-if="!loading">
                <div class="product-row flex-table-row"
                v-for="(product, index) in products" :key="product.id"
                :class="[(product[actionScope] != null) ? (product[actionScope].action == 0) ? 'out' : 'in' : '']">
                    <td class="select" v-if="authUser.role_id >= 2">
                        <label class="checkbox">
                            <input type="checkbox" @change="onSelect(index)" :ref="'checkbox-for-' + index"/>
                            <span class="checkmark"></span>
                        </label>
                    </td>
                    <td class="id clickable bind-view-single" @click="onViewSingle(product.id)">{{product.datasource_id}}</td>
                    <td class="image clickable" @click="onViewSingle(product.id)"><img class="bind-view-single" :src="`https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${product.color_variants[0].blob_id}_thumbnail.jpg`"></td>
                    <td class="title clickable" @click="onViewSingle(product.id)"><span class="bind-view-single">{{product.title}}</span></td>
                    <template v-if="currentTeamId == 0">
                        <td class="square-wrapper focus"><span class="square clickable" @mouseover="showTooltip($event, 'teams', 'Focus', product.focus)" @mouseleave="hideTooltip"><i class="far fa-star"></i>{{product.focus.length}}</span></td>
                        <td class="square-wrapper"><span class="square clickable" @mouseover="showTooltip($event, 'teams', 'In', product.focus.concat(product.ins))" @mouseleave="hideTooltip"><i class="far fa-heart"></i>{{product.ins.length + product.focus.length}}</span></td>
                        <td class="square-wrapper"><span class="square clickable" @mouseover="showTooltip($event, 'teams', 'Out', product.outs)" @mouseleave="hideTooltip"><i class="far fa-times-circle"></i>{{product.outs.length}}</span></td>
                        <td class="square-wrapper nds"><span class="square clickable" @mouseover="showTooltip($event, 'teams', 'Not decided', product.nds)" @mouseleave="hideTooltip"><i class="far fa-question-circle"></i>{{product.nds.length}} /{{teams.length}}</span></td>
                    </template>
                    <template v-else>
                        <td class="square-wrapper focus"><span class="square clickable" @mouseover="showTooltip($event, 'users', 'Focus', product.focus)" @mouseleave="hideTooltip"><i class="far fa-star"></i>{{product.focus.length}}</span></td>
                        <td class="square-wrapper"><span class="square clickable" @mouseover="showTooltip($event, 'users', 'In', product.focus.concat(product.ins))" @mouseleave="hideTooltip"><i class="far fa-heart"></i>{{product.ins.length + product.focus.length}}</span></td>
                        <td class="square-wrapper"><span class="square clickable" @mouseover="showTooltip($event, 'users', 'Out', product.outs)" @mouseleave="hideTooltip"><i class="far fa-times-circle"></i>{{product.outs.length}}</span></td>
                        <td class="square-wrapper nds"><span class="square clickable" @mouseover="showTooltip($event, 'users', 'Not decided', product.nds)" @mouseleave="hideTooltip"><i class="far fa-question-circle"></i>{{product.nds.length}} /{{teamUsers.length}}</span></td>
                    </template>
                    <td class="square-wrapper comments"><span class="square clickable bind-view-single" @click="onViewSingle(product.id)"><i class="far fa-comment bind-view-single"></i>{{product.commentsScoped.length}}</span></td>

                    <template v-if="authUser.role_id >= 2">
                            <td class="action">
                                <span class="button icon-right" :class="[(product[actionScope] != null) ? (product[actionScope].action != 0) ? 'active green' : 'ghost green-hover' : 'ghost green-hover']" @click="toggleInOut(product, 1)">
                                In  <i class="far fa-heart"></i>
                                </span>
                                <span class="button icon-right" :class="(product[actionScope] != null) ? (product[actionScope].action == 0) ? 'active red' : 'ghost red-hover' : 'ghost red-hover'"  @click="toggleInOut(product, 0)">
                                Out  <i class="far fa-times-circle"></i>
                                </span>
                                <span class="view-single bind-view-single button invisible-button" @click="onViewSingle(product.id)">View</span>
                            </td>
                    </template>
                    <template v-else>
                        <td class="action">
                            <span class="view-single bind-view-single button invisible-button" @click="onViewSingle(product.id)">View</span>
                        </td>
                    </template>

                </div>
            </template>
        </div>
        <template v-if="loading">
            <Loader/>
        </template>
        <Tooltip :tooltip="tooltip" :teamFilterId="teamFilterId"/>
    </div>
</template>

<script>
import Loader from './Loader'
import { mapActions, mapGetters } from 'vuex'
import ProductTotals from './ProductTotals'
import ProductSingle from './ProductSingle'
import Tooltip from './Tooltip'
import SelectDropdown from './SelectDropdown'
import DropdownCheckbox from './DropdownCheckbox'
import DropdownRadio from './DropdownRadio'
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
        'singleProductToShow',
        'nextSingleProductID',
        'prevSingleProductID',
        'teams',
        'sortAsc',
        'sortBy',
        'selectedIds',
        'teamUsers',
        'teamFilterId',
    ],
    components: {
        Loader,
        ProductTotals,
        ProductSingle,
        Tooltip,
        SelectDropdown,
        DropdownCheckbox,
        DropdownRadio,
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
    }},
    computed: {
        ...mapGetters('entities/productFinalActions', ['loadingFinalActions']),
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'actionScope', 'actionScopeName']),
        loadingSingle() {
            let loading = false
            // if (this.teamUsers == null) {
            //     loading = true
            // }
            // else {
            //     if (this.teamUsers[0] == null)
            //         loading = true
            //     else {
            //         if (this.teamUsers[0].teams == null)
            //             loading = true
            //     }
            // }
            return loading
        },
    },
    methods: {
        // ...mapActions('entities/productFinalActions', ['updateFinalAction', 'deleteFinalAction']),
        ...mapActions('entities/actions', ['updateAction', 'deleteAction']),
        ...mapActions('entities/teamProducts', ['deleteTeamProduct', 'updateTeamProduct']),
        ...mapActions('entities/phaseProducts', ['deletePhaseProduct', 'updatePhaseProduct']),
        // ...mapActions('entities/productFinalActions', ['deleteFinalAction']),
        toggleInOut(product, action) {
            if (product[this.actionScope] != null) {
                // If the product has an action
                if(product[this.actionScope].action == action) {
                    // DELETE ACTION
                    if (this.actionScope == 'userAction')
                        this.deleteAction({user_id: this.authUser.id, productToUpdate: product.id})
                    if (this.actionScope == 'teamAction')
                        this.deleteTeamProduct({team_id: this.currentTeamId, product_id: product.id, phase_id: 1})
                    if (this.actionScope == 'phaseAction')
                        this.deletePhaseProduct({product_id: product.id, phase_id: 1})
                } else {
                    // UPDATE ACTION
                    if (this.actionScope == 'userAction')
                        this.updateAction({user_id: this.authUser.id, productToUpdate: product.id, action_code: actionType})
                    if (this.actionScope == 'teamAction')
                        this.updateTeamProduct({team_id: this.currentTeamId, product_id: product.id, phase_id: 1, action: action})
                    if (this.actionScope == 'phaseAction')
                        this.updatePhaseProduct({product_id: product.id, phase_id: 1, action: action})
                }
            } else {
                // CREATE ACTION
                if (this.actionScope == 'userAction')
                    this.updateAction({user_id: this.authUser.id, productToUpdate: product.id, action_code: actionType})
                if (this.actionScope == 'teamAction')
                    this.updateTeamProduct({team_id: this.currentTeamId, product_id: product.id, phase_id: 1, action: action})
                if (this.actionScope == 'phaseAction')
                    this.updatePhaseProduct({product_id: product.id, phase_id: 1, action: action})
            }
        },
        onViewSingle(id) {
            // Emit event to parent
            this.$emit('viewAsSingle', id)
            if (document.getElementById('app-component').scrollTop < 130)
                document.getElementById('app-component').scrollTo(0, 130)
        },
        onSelect(index) {
            this.$emit('onSelect', index)
        },
        selectByCondition(condition) {
            const selected = this.selectedIds
            const products = this.products
            let index = 0
            products.forEach(product => {

                if (condition == 'No IN') {
                    if (product.ins.length < 1) {
                        // Get the index of the selected product
                        const found = selected.findIndex(el => el == index)
                        if (found < 0)
                            // Select
                            this.onSelect(index)
                            // mark checkbox
                            this.$refs['checkbox-for-' + index][0].checked = true
                        // console.log(this.$refs['checkbox-for-' + index][0].checked)
                    }
                }
                if (condition == 'No COMMENT & no OUT') {
                    if (product.comments.length < 1 && product.outs.length < 1) {
                        // Get the index of the selected product
                        const found = selected.findIndex(el => el == index)
                        if (found < 0)
                            // Select
                            this.onSelect(index)
                            // mark checkbox
                            this.$refs['checkbox-for-' + index][0].checked = true
                        // console.log(this.$refs['checkbox-for-' + index][0].checked)
                    }
                }
                index++

            })
            // if (condition == no_comment_no_out)
        },
        showTooltip(event, type, header, data) {
            const rect = event.target.getBoundingClientRect()

            // Set tooltip position
            this.tooltip.position.top = rect.top + rect.height + 10
            this.tooltip.position.center = rect.left + ( rect.width / 2 )

            // Set tooltip data
            this.tooltip.data = data
            this.tooltip.header = header
            this.tooltip.type = type


            // Add team data to the tooltip 
            if(type == 'users') {
                // Show users if we are filtering by a team
                if (this.teamFilterId > 0) {
                    this.tooltip.users = this.teamUsers
                }
                // Show teams if we are not filtering by team
                else  {
                    this.tooltip.type = 'teams'
                    this.tooltip.teams = this.teams
                }   
            }
            // Make tooltip active
            this.tooltip.active = true;
        },
            
        hideTooltip() {
            this.tooltip.active = false;
        },
        onSortBy(key, method) {
            this.$emit('onSortBy', key, method)
        },
        onCloseSingle() {
            this.$emit('closeSingle', -1)
        },
        onNextSingle() {
            this.$emit('nextSingle')
        },
        onPrevSingle() {
            this.$emit('prevSingle')
        },
        resetSelected() {
            document.querySelectorAll('.product-row input[type=checkbox]').forEach(input => {
                input.checked = false
            })
        },
        handleScroll (event) {
            // Fix table header to screen
            const theWindow = document.getElementById('app-component')
            let scrollDist = theWindow.scrollTop
            const stickyThis = document.querySelector('.product-tabs')
            const stickyThisTop = stickyThis.getBoundingClientRect().top - 70
            if (scrollDist >= 130) {
                this.sticky = true
                stickyThis.classList.add('sticky')
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
    },
    created () {
        document.getElementById('app-component').addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        document.getElementById('app-component').removeEventListener('scroll', this.handleScroll);
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

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
        &.sticky {
            margin-top: 90px;
            .scroll-bg {
                display: block;
                z-index: 8;
                position: fixed;
                right: 20px;
                top: 0;
                background: $light;
                width: 100%;
                height: 130px;
            }
            .header-row {
                position: fixed;
                top: $navbarHeight + 20px + 40px;
                z-index: 9;
                background: white;
                width: calc(100% - 120px - 200px - 16px);
                margin-left: 1px;
                border-radius: 0.25rem 0.25rem 0 0;
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
        margin-left: -16px;
        margin-right: -16px;
        width: calc(100% + 32px);
        &.disabled {
            opacity: .5;
        }
    }
    .flex-table-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        > * {
            &.select {
                padding-left: 16px;
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
                padding-left: 16px;
                // padding-right: 16px;
            }
            &.focus {
                margin-left: auto;
            }
            &.square-wrapper {
                min-width: 70px;
                padding-left: 16px;
                box-sizing: content-box;
            }
            &.nds {
                min-width: 100px;
            }
            &.comments {
                min-width: 86px;
            }
            &.action {
                margin-left: auto;
                padding-left: 16px;
                min-width: 320px;
                justify-content: flex-end;
                padding-right: 16px;
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
        background: $light1;
        color: $dark;
        padding: 7px 10px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        i {
            color: $dark2;
            margin-right: 12px;
            font-size: 16px;
        }
    }
    .button {
        &:nth-child(1n+2) {
            margin-left: 20px;
        }
    }
    .view-single {
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
    }
    .square-wrapper {
        min-width: 65px;
    }
</style>
