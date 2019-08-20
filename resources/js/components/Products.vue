<template>
    <div class="products card" :class="{sticky: sticky}">
        <div class="scroll-bg"></div>
        <product-totals :totalProductCount="totalProductCount" :selectedCount="selectedCount" :products="products"/>
        <product-single :sticky="sticky" :product="singleProductToShow" :nextProductID="nextSingleProductID" :prevProductID="prevSingleProductID" :authUser="authUser" @closeSingle="onCloseSingle" @nextSingle="onNextSingle" @prevSingle="onPrevSingle" @onToggleInOut="toggleInOut"/>
        <div class="flex-table" :class="{disabled: singleProductToShow.id != null}">
            <div class="header-row flex-table-row">
                <th class="select dropdown-parent" @click="toggleDropdown($event)" v-if="authUser.role_id >= 2">
                    Select <i class="fas fa-chevron-down"></i>
                    <select-dropdown @onSelectByCondition="selectByCondition"/>
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

                <th v-if="authUser.role_id >= 2" :class="{active: this.sortBy == 'productFinalAction'}" class="clickable action" @click="onSortBy('productFinalAction', false)">
                    Action <i class="fas" :class="[(this.sortBy == 'productFinalAction' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th v-else :class="{active: this.sortBy == 'productFinalAction'}" class="clickable action">Action</th>
            </div>
            <template v-if="!loading">
                <div class="product-row flex-table-row"
                v-for="(product, index) in products" :key="product.id"
                :class="[ (product.productFinalAction != null) ? (product.productFinalAction.action == 1) ? 'in' : 'out' : '' ]">
                    <td class="select" v-if="authUser.role_id >= 2">
                        <label class="checkbox">
                            <input type="checkbox" @change="onSelect(index)" :ref="'checkbox-for-' + index"/>
                            <span class="checkmark"></span>
                        </label>
                    </td>
                    <td class="id clickable bind-view-single" @click="onViewSingle(product.id)">{{product.datasource_id}}</td>
                    <td class="image clickable" @click="onViewSingle(product.id)"><img class="bind-view-single" :src="product.color_variants[0].image"></td>
                    <td class="title clickable" @click="onViewSingle(product.id)"><span class="bind-view-single">{{product.title}}</span></td>
                    <td class="square-wrapper focus"><span class="square clickable" @mouseover="showTooltip($event, 'users', 'Focus', product.focus)" @mouseleave="hideTooltip"><i class="far fa-star"></i>{{product.focus.length}}</span></td>
                    <td class="square-wrapper"><span class="square clickable" @mouseover="showTooltip($event, 'users', 'In', product.focus.concat(product.ins))" @mouseleave="hideTooltip"><i class="far fa-heart"></i>{{product.ins.length + product.focus.length}}</span></td>
                    <td class="square-wrapper"><span class="square clickable" @mouseover="showTooltip($event, 'users', 'Out', product.outs)" @mouseleave="hideTooltip"><i class="far fa-times-circle"></i>{{product.outs.length}}</span></td>
                    <td class="square-wrapper nds"><span class="square clickable" @mouseover="showTooltip($event, 'users', 'Not decided', product.nds)" @mouseleave="hideTooltip"><i class="far fa-question-circle"></i>{{product.nds.length}} / {{teamUsers.length}}</span></td>
                    <td class="square-wrapper comments"><span class="square clickable bind-view-single" @click="onViewSingle(product.id)"><i class="far fa-comment"></i>{{product.comments.length}}</span></td>
                    <template v-if="!loadingFinalActions">
                        <template v-if="authUser.role_id >= 2">
                            <template v-if="!product.productFinalAction">
                                <td class="action">
                                    <span class="button green" @click="toggleInOut(product, 1)">In <i class="far fa-heart"></i></span>
                                    <span class="button red" @click="toggleInOut(product, 0)">Out <i class="far fa-times-circle"></i></span>
                                    <span class="view-single bind-view-single button invisible-button" @click="onViewSingle(product.id)">View</span>
                                </td>
                            </template>
                            <template v-else>
                                <td class="action">
                                    <span class="button green" :class="[{ active: product.productFinalAction.action == 1}]" @click="toggleInOut(product, 1)">
                                    In  <i class="far fa-heart"></i>
                                    </span>
                                    <span class="button red" :class="[{ active: product.productFinalAction.action == 0}]"  @click="toggleInOut(product, 0)">
                                    Out  <i class="far fa-times-circle"></i>
                                    </span>
                                    <span class="view-single bind-view-single button invisible-button" @click="onViewSingle(product.id)">View</span>
                                </td>
                            </template>
                        </template>
                        <template v-else>
                            <td class="action">
                                <span class="view-single bind-view-single button invisible-button" @click="onViewSingle(product.id)">View</span>
                            </td>
                        </template>
                    </template>
                    <template v-else>
                        <td><span><Loader/></span></td>
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
    },
    methods: {
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/productFinalActions', ['updateFinalAction', 'deleteFinalAction']),
        // ...mapActions('entities/productFinalActions', ['deleteFinalAction']),
        toggleInOut(product, actionType) {
            if (product.productFinalAction != null) {
                // If the product has a final action
                if(product.productFinalAction.action == actionType) {
                    // If the products final action is the same as the requested
                    this.deleteFinalAction({phase: this.collection.phase, productToUpdate: product.id})
                } else {
                    // Update action
                    this.updateFinalAction({phase: this.collection.phase, productToUpdate: product.id, action_code: actionType})
                }
            } else {
                // Create action
                this.updateFinalAction({phase: this.collection.phase, productToUpdate: product.id, action_code: actionType})
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

                if (condition == 'no_in') {
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
                if (condition == 'no_comment_no_out') {
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
        }
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
                min-width: 80px;
            }
            &.action {
                margin-left: auto;
                padding-left: 16px;
                min-width: 300px;
                display: flex;
                justify-content: flex-end;
                padding-right: 16px;
            }
        }
    }
    i {
        margin-right: 12px;
        font-size: 11px;
        &.fa-arrow-up {
            color: $green;
        }
        &.fa-arrow-down {
            color: $red;
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

    .checkmark {
      content: "";
      display: inline-block;
      vertical-align: text-top;
      width: 24px;
      height: 24px;
      background: white;
      border: 1px solid #dfdfdf;
    }

    .checkbox input:checked ~ .checkmark {
      background: linear-gradient(#3b86ff, #3b86ff) no-repeat;
      background-position: center;
      background-size: 16px 16px;
    }

    .checkmark::after {
      content: "";
      position: absolute;
      display: none;
    }

    .checkbox input:checked ~ .checkmark:after {
      display: block;
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
        display: inline-block;
        width: 86px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        border-radius: 4px;
        padding: 0;
        line-height: 28px;
        position: relative;
        font-weight: 700;
        color: $dark2;
        border-color: $light2;
        margin: 0;
        &:not(.invisible-button) {
            margin-right: 24px;
            padding-right: 22px;
        }
        i {
            font-size: 16px;
            position: absolute;
            right: 10px;
            top: 5px;
            margin: 0;
        }
        &.active {
            i {
                font-weight: 900;
            }
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
