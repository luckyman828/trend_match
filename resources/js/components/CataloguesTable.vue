<template>
    <div class="catalogues-table card">
        <div class="catalogue-totals">
            <span>{{selectedCount}} selected</span>
            <span>{{catalogues.length}} records</span>
        </div>
        <table>
            <tr class="header-row">
                <th class="select">Select <i class="fas fa-chevron-down"></i></th>
                <th class="clickable id" :class="{active: this.sortBy == 'id'}" @click="onSortBy('id', true)">
                    ID <i class="fas" :class="[(this.sortBy == 'id' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'title'}" class="clickable title" @click="onSortBy('title', true)">
                   Catalogue <i class="fas" :class="[(this.sortBy == 'title' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'start_time'}" class="clickable" @click="onSortBy('start_time', false)">
                    Created <i class="fas" :class="[(this.sortBy == 'start_time' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'end_time'}" class="clickable" @click="onSortBy('end_time', false)">
                    Deadline <i class="fas" :class="[(this.sortBy == 'end_time' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'phase'}" class="clickable" @click="onSortBy('phase', false)">
                    Status <i class="fas" :class="[(this.sortBy == 'phase' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th></th>
                <th>Action</th>
                <th></th>
            </tr>
            <template v-if="!loading">
                <tr class="catalogue-row" v-for="(catalogue, index) in cataloguesSorted" :key="catalogue.id">
                    <td class="select">
                        <label class="checkbox">
                            <input type="checkbox" @change="onSelect(index)" />
                            <span class="checkmark"></span>
                        </label>
                    </td>
                    <td class="id clickable" @click="viewSingle(catalogue.id, catalogue.title)">{{catalogue.id}}></td>
                    <td class="title clickable" @click="viewSingle(catalogue.id, catalogue.title)">{{catalogue.title}}</td>

                    <td class="created"><span class="square">{{
                        (catalogue.start_time != null) ? catalogue.start_time.substr(0, catalogue.start_time.indexOf(" ")).replace(/\./g, "/") : 'Unset'
                    }}</span></td>
                    <td class="deadline"><span class="square">{{
                        (catalogue.end_time != null) ? catalogue.end_time.substr(0, catalogue.end_time.indexOf(" ")).replace(/\-/g, "/") : 'Unset'
                    }}</span></td>

                    <td class="stage"><span class="square">STAGE {{catalogue.phase}}</span></td>
                    <td class="status"><span class="square">tbd</span></td>
                    <td class="action">
                        <span class="button">Action</span>
                        <span class="button">Action</span>
                        <span class="clickable" @click="viewSingle(catalogue.id, catalogue.title)">View</span>
                    </td>
                </tr>
            </template>
        </table>
        <template v-if="loading">
            <Loader/>
        </template>
    </div>
</template>

<script>
import Loader from './Loader'
import { mapActions, mapGetters } from 'vuex'
import ProductTotals from './ProductTotals'
import ProductSingle from './ProductSingle'

export default {
    name: 'cataloguesTable',
    props: [
        'catalogues',
        'loading',
        'selectedCount',
    ],
    components: {
        Loader,
    },
    data: function() { return {
        sortBy: 'id',
        sortAsc: true
    }},
    computed: {
        cataloguesSorted() {
            const catalogues = this.catalogues
            let key = this.sortBy
            let sortAsc = this.sortAsc
            const dataSorted = catalogues.sort((a, b) => {

                // If the keys don't have length - sort by the key
                if (!catalogues[0][key].length) {

                    if (sortAsc)
                        return (a[key] > b[key]) ? 1 : -1
                        else return (a[key] < b[key]) ? 1 : -1

                // If the keys have lengths - sort by their length
                } else {

                    if (sortAsc)
                        return (a[key].length > b[key].length) ? 1 : -1
                        else return (a[key].length < b[key].length) ? 1 : -1

                }
            })
            return dataSorted
        },
        // startDate () {
        //     const date = this.catalogue.start_time
        //     const dateEnd = date.indexOf(" ")
        //     const newDate = date.substr(0, dateEnd)
        //     return newDate.replace('-', '/')
        // },
        // endDate () {
        //     const date = this.catalogue.end_time
        //     const dateEnd = date.indexOf(" ")
        //     const newDate = date.substr(0, dateEnd)
        //     return newDate.replace('-', '/')
        // },
    },
    methods: {
        onSelect(index) {
            this.$emit('onSelect', index)
        },
            
        hideTooltip() {
            this.tooltip.active = false;
        },
        onSortBy(key, method) {      
            // Check if the sorting key we are setting is already the key we are sorting by
            // If this is the case, toggle the sorting method (asc|desc)
            if (this.sortBy !== key) {
                this.sortAsc = method
                this.sortBy = key
            } else {
                this.sortAsc = !this.sortAsc
            }

        },
        viewSingle(catalogueId, catalogueTitle) {
            this.$router.push({name: 'catalogue', params: {catalogueId: catalogueId, catalogueTitle: catalogueTitle}})
        }
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .catalogues-table {
        margin-top: 52px;
        padding-top: 0;
    }
    .clickable {
        cursor: pointer;
    }
    table {
        margin-left: -16px;
        margin-right: -16px;
        width: calc(100% + 32px);
        &.disabled {
            opacity: .5;
        }
    }
    tr:hover {
        background: $light;
    }
    img {
        height: 88px;
        width: 66px;
        object-fit: cover;
        margin: 8px 0 8px 16px;
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
    tr.header-row {
        background: white;
        font-weight: 700;
        font-size: 12px;
        height: 45px;
        border-bottom: solid 2px $light1;
    }
    tr.catalogue-row {
        border-bottom: solid 1px $light2;
        &.in > :first-child {
            box-shadow: 4px 0 $green inset
        }
        &.out > :first-child {
            box-shadow: 4px 0 $red inset
        }
    }
    th {
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: $dark2;
        &:first-child {
            padding-left: 16px;
            width: 100px;
        }
        &.id {
            width: 75px;
        }
        &.title {
            width: 150px;
            padding-left: 40px;
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
        &.select {
            padding: 20px 0;
            padding-left: 20px;
        }
        &.id {
                white-space: nowrap;
                max-width: 50px;
                overflow: hidden;
        }
        &.title {
            padding: 0 40px;
            white-space: nowrap;
        }
        &.created, &.deadline {
            width: 120px;
        }
        &.stage {
            width: 84px;
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
        padding: 7px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 700;
        &.sales {
            background: $primary;
        }
        &.admin {
            background: $dark05;
        }
        i {
            color: $dark2;
            margin-right: 16px;
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
        padding: 0 12px;
        color: $dark2;
        cursor: pointer;
    }
    .catalogue-totals {
        position: absolute;
        right: 0;
        top: -40px;
        height: 40px;
        line-height: 40px;
        span {
            font-weight: 500;
            font-size: 14px;
            margin-right: 20px;
        }
    }
</style>
