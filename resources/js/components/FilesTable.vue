<template>
    <div class="catalogues-table card">
        <div class="catalogue-totals">
            <span>{{selectedCount}} selected</span>
            <span>{{files.length}} records</span>
        </div>
        <div class="flex-table">
            <div class="header-row flex-table-row">
                <div class="flex-group">
                    <th v-if="authUser.role_id >= 3" class="select">Select <i class="fas fa-chevron-down"></i></th>
                    <th class="clickable id" :class="{active: this.sortBy == 'id'}" @click="onSortBy('id', true)">
                        ID <i class="fas" :class="[(this.sortBy == 'id' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                    <th :class="{active: this.sortBy == 'title'}" class="clickable title" @click="onSortBy('title', true)">
                    File name <i class="fas" :class="[(this.sortBy == 'title' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                </div>
                <div class="flex-group">
                    <th :class="{active: this.sortBy == 'start_time'}" class="clickable" @click="onSortBy('start_time', false)">
                        Created <i class="fas" :class="[(this.sortBy == 'start_time' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                    <th :class="{active: this.sortBy == 'end_time'}" class="clickable" @click="onSortBy('end_time', false)">
                        Deadline <i class="fas" :class="[(this.sortBy == 'end_time' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                    <th :class="{active: this.sortBy == 'phase'}" class="clickable" @click="onSortBy('phase', false)">
                        Status <i class="fas" :class="[(this.sortBy == 'phase' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                    </th>
                </div>
                <div class="flex-group">
                    <th class="action">Action</th>
                </div>
            </div>

            <div v-if="cataloguesSorted.length <= 0" class="catalogue-row flex-table-row item-row">
                <span style="text-align: center">You don't have access to any catalogues</span>
            </div>

            <div class="catalogue-row flex-table-row item-row" v-for="(catalogue, index) in cataloguesSorted" :key="catalogue.id">
                <div class="flex-group">
                    <td v-if="authUser.role_id >= 3" class="select">
                        <label class="checkbox">
                            <input type="checkbox" @change="onSelect(index)" />
                            <span class="checkmark"></span>
                        </label>
                    </td>
                    <td class="id clickable" @click="viewSingle(catalogue.id, catalogue.title)">
                        <span :title="catalogue.id">{{ catalogue.id | truncate(10) }}</span>
                        
                    </td>
                    <td class="title clickable">
                        
                        <span v-if="fileToEdit.id != catalogue.id" @click="viewSingle(catalogue.id, catalogue.title)">{{catalogue.title}}</span>
                        <div :class="{hidden: fileToEdit.id != catalogue.id}" class="edit-title input-parent controls-right">
                            <input type="text" :ref="'editTitleField-'+catalogue.id" class="input-wrapper" v-model="fileToEdit.title" @keyup.enter="updateFile(fileToEdit); resetFileToEdit()" @keyup.esc="resetFileToEdit()">
                            <div class="controls">
                                <span class="button green true-square" @click="updateFile(fileToEdit); resetFileToEdit()"><i class="fas fa-check"></i></span>
                                <span class="button red true-square" @click="resetFileToEdit()"><i class="fas fa-times"></i></span>
                            </div>
                        </div>
                    </td>
                </div>
                <div class="flex-group">
                    <td class="created"><span class="square light">{{
                        (catalogue.start_date != null) ? new Date(catalogue.start_date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}) : 'Unset'
                    }}</span></td>
                    <td class="deadline"><span class="square light">{{
                        (catalogue.end_date != null) ? new Date(catalogue.end_date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}) : 'Unset'
                    }}</span></td>

                    <td class="stage">
                        <span class="square light stage">STAGE {{catalogue.phase}}</span>
                        <!-- <span class="square light status">tbd%</span> -->
                    </td>
                </div>
                <div class="flex-group">
                    <td class="action">
                        <span class="button invisible ghost light-1-hover " @click="viewSingle(catalogue.id, catalogue.title)">View</span>
                        <Dropdown :ref="'moreOptions-'+catalogue.id">
                            <template v-slot:button>
                                <!-- <span class="button invisible ghost light-1-hover true-square" @click="testCon(catalogue.id)">{{key}}</span> -->
                                <span class="button invisible ghost light-1-hover true-square" @click="$refs['moreOptions-'+catalogue.id][0].toggle()"><i class="fas fa-ellipsis-v"></i></span>
                            </template>
                            <template v-slot:body>
                                <div class="option-buttons">
                                    <span class="option icon-left" @click="onRenameFile(catalogue, index); $refs['moreOptions-'+catalogue.id][0].toggle()"><i class="fas fa-pencil primary"></i> Rename</span>
                                    <span class="option icon-left" @click="onDeleteFile(catalogue.id); $refs['moreOptions-'+catalogue.id][0].toggle()"><i class="fas fa-trash-alt red"></i> Delete</span>
                                </div>
                            </template>
                        </Dropdown>
                    </td>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProductTotals from './ProductTotals'
import ProductSingle from './ProductSingle'

export default {
    name: 'filesTable',
    props: [
        'files',
        'selected',
        'authUser',
    ],
    components: {
    },
    data: function() { return {
        sortBy: 'id',
        sortAsc: true,
        fileToEdit: {
            id: '',
            title: ''
        },
        defaultFileToEdit: {
            id: '',
            title: ''
        }
    }},
    computed: {
        selectedCount() {
            return this.selected.length
        },
        cataloguesSorted() {
            const catalogues = this.files
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
    },
    methods: {
        ...mapActions('entities/collections', ['deleteFile', 'updateFile']),
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
        viewSingle(fileId, fileTitle) {
            this.$router.push({name: 'file', params: {fileId: fileId, fileTitle: fileTitle}})
        },
        onDeleteFile(fileId) {
            (window.confirm(
                'Are you sure you want to delete this file?\nAll comments, requests and actions will be permanently deleted.'))
            ? this.deleteFile(fileId) : false
        },
        onRenameFile(file, index) {
            this.fileToEdit = JSON.parse(JSON.stringify(file))
            const el = this.$refs['editTitleField-'+file.id][0]
            this.$nextTick(() => el.focus())
            this.$nextTick(() => el.select())
        },
        resetFileToEdit() {
            this.fileToEdit = this.defaultFileToEdit
        },
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .catalogues-table {
        margin-top: 52px;
        padding-top: 0;
        position: relative;
    }
    .clickable {
        cursor: pointer;
    }
    // Table
    .flex-table {
        .flex-group {
            display: flex;
            flex: 1;
            margin: 0 16px;
            align-items: center;
            &:nth-child(1) {
                flex: 3;
            }
            &:nth-child(2) {
                flex: 3;
                justify-content: flex-start;
                > * {
                    flex: none;
                    flex-basis: 100px;
                    &.stage {
                        flex-basis: 132px;
                    }
                }
            }
            &:nth-child(3) {
                flex: 2;
                max-width: 300px;
                min-width: 300px;
            }
            > * {
                flex: 1;
                margin: 0 8px;
                &.select {
                    max-width: 80px;
                }
                &.id {
                    white-space: nowrap;
                    overflow: hidden;
                    max-width: 75px;
                }
                &.action {
                    display: flex;
                    justify-content: flex-end;
                    > * {
                        &:not(:last-child) {
                            margin-right: 8px;
                        }
                    }
                }
            }
            > td {
                &.action {
                    text-align: right;
                }
            }
        }
        .flex-table-row {
            height: 82px;
            > * {
                flex: 1;
                margin: 0 8px;
                &:first-child {
                    margin-left: 16px;
                }
                &:last-child {
                    margin-right: 16px;
                }
            }
            th {
                &.action {
                    text-align: right;
                    justify-content: flex-end;
                }
            }
        }
    }
    .show-more {
        width: 100%;
        margin: 16px auto 0;
        text-align: center;
        display: inline-block;
    }
    // .checkbox {
    //   display: block;
    //   position: relative;
    //   cursor: pointer;
    //   -webkit-user-select: none;
    //   -moz-user-select: none;
    //   -ms-user-select: none;
    //   user-select: none;
    //   margin-bottom: 0;
    //   padding-top: 5px;
    //   padding-bottom: 5px;
    //   &:hover {
    //       background: $light;
    //   }
    // }

    // .checkbox input {
    //   position: absolute;
    //   opacity: 0;
    //   cursor: pointer;
    //   height: 0;
    //   width: 0;
    // }

    // .checkmark {
    //   content: "";
    //   display: inline-block;
    //   vertical-align: text-top;
    //   width: 24px;
    //   height: 24px;
    //   background: white;
    //   border: 1px solid #dfdfdf;
    // }

    // .checkbox input:checked ~ .checkmark {
    //   background: linear-gradient(#3b86ff, #3b86ff) no-repeat;
    //   background-position: center;
    //   background-size: 16px 16px;
    // }

    // .checkmark::after {
    //   content: "";
    //   position: absolute;
    //   display: none;
    // }

    // .checkbox input:checked ~ .checkmark:after {
    //   display: block;
    // }
    // .button {
    //     display: inline-block;
    //     width: 86px;
    //     height: 32px;
    //     line-height: 32px;
    //     font-size: 12px;
    //     border-radius: 4px;
    //     padding: 0;
    //     line-height: 28px;
    //     position: relative;
    //     font-weight: 700;
    //     color: $dark2;
    //     border-color: $light2;
    //     margin: 0;
    //     i {
    //         font-size: 16px;
    //         position: absolute;
    //         right: 10px;
    //         top: 5px;
    //         margin: 0;
    //     }
    //     &.active {
    //         i {
    //             font-weight: 900;
    //         }
    //     }
    // }
    .view-single {
        font-size: 12px;
        font-weight: 700;
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
    .edit-title {
        &.hidden {
            display: none;
        }
    }
</style>
