<template>
    <div class="products card" :class="[{sticky: sticky}]">
        <div class="scroll-bg"></div>
        <BaseFlyin :visibleOverwrite="singleVisible" @close="onCloseSingle">
            <ProductFlyin :visible="singleVisible" @closeSingle="onCloseSingle"/>
        </BaseFlyin>
        <div class="flex-table">
            <div class="header-row flex-table-row">
                <div class="product-totals">
                    <span>{{selectedIds.length}} selected</span>
                    <span v-if="products.length != totalProductCount">{{products.length}}/{{totalProductCount}} showing</span>
                    <span v-else>{{totalProductCount}} records</span>
                </div>

                <th class="select">
                    <span>Select</span>
                </th>
                <th class="clickable id" :class="{active: this.sortBy == 'datasource_id'}" @click="onSortBy('datasource_id', true)">
                    Id <i class="fas" :class="[(this.sortBy == 'datasource_id' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th class="image"></th>
                <th :class="{active: this.sortBy == 'title'}" class="clickable title" @click="onSortBy('title', true)">
                   Product name <i class="fas" :class="[(this.sortBy == 'title' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th class="action"></th>
            </div>
            <div class="product-row flex-table-row"
            v-for="(product, index) in products" :key="product.id">
                
                <td class="select">
                    <label class="checkbox">
                        <input type="checkbox" @change="onSelect(index)" :ref="'checkbox-for-' + index"/>
                        <span class="checkmark"></span>
                    </label>
                </td>
                <td class="id clickable" @click="onViewSingle(product.id)">{{product.datasource_id}}</td>
                <td class="image clickable" @click="onViewSingle(product.id)"><img :src="product.color_variants.length > 0 ? productImg(product.color_variants[0]) : null"></td>
                <td class="title clickable" @click="onViewSingle(product.id)"><span>{{product.title}}</span></td>

                <td class="action">
                    <span class="button invisible ghost dark-hover" @click="onViewSingle(product.id)">View / Edit</span>
                    <BaseDropdown v-if="userPermissionLevel >= 3" :ref="'moreOptions-' + product.id">
                        <template v-slot:button>
                            <span class="button invisible ghost dark-hover true-square" @click="$refs['moreOptions-' + product.id][0].toggle()">
                                <i class="fas fa-ellipsis-v"></i>
                            </span>
                        </template>
                        <template v-slot:body>
                            <div class="option-buttons">
                                <span class="option icon-left" @click="onDeleteProduct(product.id); $refs['moreOptions-' + product.id][0].toggle()">
                                    <i class="fas fa-trash-alt red"></i> Delete
                                </span>
                            </div>
                        </template>
                    </BaseDropdown>
                </td>

            </div>
            <div v-if="products.length <= 0">
                <p style="padding: 60px 0 100px; text-align: center;">No products to show. Try changing your filters.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProductFlyin from './ProductFlyin'

export default {
    name: 'editProductsTable',
    props: [
        'products',
        'collection',
        'totalProductCount',
        'sortAsc',
        'sortBy',
        'selectedIds',
    ],
    components: {
        ProductFlyin,
    },
    data: function() { return {
        sticky: false,
    }},
    computed: {
        ...mapGetters('entities/collections', ['currentFile']),
        ...mapGetters('entities/products', ['singleVisible']),
        ...mapGetters('persist', ['userPermissionLevel', 'currentWorkspaceId']),
    },
    methods: {
        ...mapActions('entities/products', ['setCurrentProductId', 'setAvailableProductIds', 'deleteProduct']),
        ...mapMutations('entities/products', ['setSingleVisisble']),
        productImg(variant) {
            if (variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        onViewSingle(id) {
            this.setCurrentProductId(id)
            this.setAvailableProductIds(this.products.map(x => x.id)) // Save array of available products
            this.setSingleVisisble(true)
        },
        onSelect(index) {
            this.$emit('onSelect', index)
        },
        onSortBy(key, method) {
            this.$emit('onSortBy', key, method)
        },
        onCloseSingle() {
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
            const scrollBg = document.querySelector('.scroll-bg')
            const tableHeader = document.querySelector('.flex-table .header-row')
            const headerParent = tableHeader.parentElement
            if (scrollDist >= 130) {
                this.sticky = true
                scrollBg.style.cssText = `width: ${theWindow.scrollWidth}px;`
                tableHeader.style.cssText = `width: ${headerParent.scrollWidth}px; left: ${this.getPosition(headerParent).x - 1}px`
            } else {
                this.sticky = false
            }
        },
        onDeleteProduct(id) {
            window.confirm(
                'Are you sure you want to permanently delete this product?'
            )
                ? this.deleteProduct(id)
                : false
        }
    },
    created () {
        document.getElementById('main').addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        document.getElementById('main').removeEventListener('scroll', this.handleScroll);
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
