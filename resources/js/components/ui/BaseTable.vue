<template>
    <div class="table-wrapper" ref="tableWrapper">
        <table
            class="base-table"
            ref="table"
            :class="[
                { sticky: sticky },
                { 'has-tabs': $slots.tabs },
                { 'has-context-button': !hideContextButton },
                { fixed: headerFixed },
            ]"
        >
            <div ref="stickyHeader" class="sticky-header">
                <div ref="stickyBg" class="sticky-bg" :style="{ width: tableWidth + 32 + 'px' }"></div>
                <div ref="stickyInner" class="inner">
                    <div class="tabs-wrapper" v-if="$slots.tabs">
                        <slot name="tabs" />
                    </div>
                    <div class="over-table">
                        <slot name="overTable" />
                    </div>
                    <div class="rounded-top">
                        <BaseTableTopBar v-if="!hideTopBar">
                            <template v-slot:left>
                                <BaseSearchField
                                    v-if="searchEnabled && !isDraggable"
                                    ref="searchField"
                                    :searchKey="searchKey"
                                    :arrayToSearch="items"
                                    @input="$emit('update:searchResult', $event)"
                                    @keydown.enter.native="$emit('search-enter')"
                                />
                                <slot name="topBarLeft" />
                            </template>

                            <template v-slot:right>
                                <slot name="topBarRight" />
                                <div class="records" v-if="!!items">
                                    <span v-if="selected && selected.length > 0"
                                        ><strong>{{ selected.length }}</strong> selected</span
                                    >
                                    <span v-if="searchEnabled"
                                        >showing <strong>{{ searchResult.length }}</strong> of
                                        <strong>{{ itemsTotalCount != null ? itemsTotalCount : items.length }}</strong>
                                        records</span
                                    >
                                </div>
                            </template>
                        </BaseTableTopBar>

                        <tr class="header">
                            <BaseTableHeader class="select" v-if="showSelect">
                                <BaseCheckbox
                                    :value="selected.length > 0"
                                    :modelValue="true"
                                    @change="
                                        checked =>
                                            checked
                                                ? $emit('update:selected', itemsSorted)
                                                : $emit('update:selected', [])
                                    "
                                />
                            </BaseTableHeader>
                            <slot name="header" />
                            <BaseTableHeader v-if="!hideContextButton" class="context-button">Action</BaseTableHeader>
                        </tr>
                    </div>
                </div>
            </div>
            <div ref="stickyPlaceholder" class="sticky-placeholder"></div>
            <div class="body">
                <!-- Content -->

                <template v-if="isReady">
                    <Draggable
                        v-if="isDraggable"
                        v-model="localItemsReOrdered"
                        :forceFallback="true"
                        fallbackClass="sortable-drag"
                        :fallbackTolerance="10"
                    >
                        <BaseTableRow
                            v-for="(item, index) in localItemsReOrdered"
                            class="main-row"
                            ref="tableRow"
                            :key="itemKey ? item[itemKey] : index"
                            :item="item"
                            :index="index"
                            :showSelect="showSelect"
                            :selected.sync="localSelected"
                            :items="items"
                            :contextItem="contextItem"
                            :itemKey="itemKey"
                            :showContextButton="!hideContextButton"
                            :itemType="itemType"
                            :itemSize="itemSize"
                            :hasFocus="focusIndex == index"
                            @select-range="selectRange(index, items, selected)"
                            @show-contextmenu="onContextMenu($event, item)"
                        >
                            <slot name="row" :item="item" :index="index" :rowComponent="$refs.tableRow" />
                        </BaseTableRow>
                    </Draggable>

                    <RecycleScroller
                        v-else-if="useVirtualScroller"
                        :items="itemsSorted"
                        :item-size="itemSize"
                        :buffer="1000"
                        page-mode
                        :key-field="itemKey"
                        v-slot="{ item, index }"
                    >
                        <div class="row-wrapper" tabindex="0">
                            <BaseTableRow
                                class="main-row"
                                ref="tableRow"
                                :key="itemKey ? item[itemKey] : index"
                                :item="item"
                                :index="index"
                                :showSelect="showSelect"
                                :selected.sync="localSelected"
                                :items="items"
                                :contextItem="contextItem"
                                :itemKey="itemKey"
                                :showContextButton="!hideContextButton"
                                :itemType="itemType"
                                :itemSize="itemSize"
                                :hasFocus="focusIndex == index"
                                @select-range="selectRange(index, items, selected)"
                                @show-contextmenu="onContextMenu($event, item)"
                            >
                                <slot name="row" :item="item" :index="index" :rowComponent="$refs.tableRow" />
                            </BaseTableRow>
                            <template v-if="subItemsArrayKey && item.expanded">
                                <BaseTableRow
                                    v-for="(subItem, subItemIndex) in item[subItemsArrayKey]"
                                    class="sub-row"
                                    :key="subItemKey ? subItem[subItemKey] : subItemIndex"
                                    ref="tableSubRow"
                                    :item="subItem"
                                    :index="index"
                                    :showSelect="false"
                                    :selected.sync="localSelected"
                                    :items="item[subItemsArrayKey]"
                                    :contextItem="contextItem"
                                    :itemKey="itemKey"
                                    :showContextButton="!hideContextButton"
                                    :itemType="itemType"
                                    :itemSize="itemSize"
                                    :hasFocus="focusIndex == index"
                                    @select-range="selectRange(index, items, selected)"
                                    @show-contextmenu="onContextMenu($event, item)"
                                >
                                    <slot
                                        name="subRow"
                                        :item="subItem"
                                        :index="subItemIndex"
                                        :rowComponent="$refs.tableSubRow"
                                    />
                                </BaseTableRow>
                            </template>
                        </div>
                    </RecycleScroller>

                    <BaseTableRow
                        ref="tableRow"
                        v-else
                        v-for="(item, index) in itemsSorted"
                        :key="itemKey ? item[itemKey] : index"
                        :item="item"
                        :index="index"
                        :showSelect="showSelect"
                        :selected.sync="localSelected"
                        :items="items"
                        :contextItem="contextItem"
                        :itemKey="itemKey"
                        :showContextButton="!hideContextButton"
                        :itemType="itemType"
                        :itemSize="itemSize"
                        :hasFocus="focusIndex == index"
                        @select-range="selectRange(index, items, selected)"
                        @show-contextmenu="onContextMenu($event, item)"
                    >
                        <slot name="row" :item="item" :index="index" :rowComponent="$refs.tableRow" />
                    </BaseTableRow>

                    <BaseTableRow v-if="$scopedSlots.last" class="last">
                        <slot name="last" />
                    </BaseTableRow>
                </template>
                <!-- End content -->

                <!-- Loading / Error -->
                <tr class="load-wrapper" v-else>
                    <!-- Loading -->
                    <BaseLoader v-if="contentStatus != 'error'" :msg="loadingMsg || 'loading content'" />

                    <!-- Error  -->
                    <BaseContentLoadError v-else :msg="errorMsg || 'error loading content'" :callback="errorCallback" />
                </tr>
                <!-- End Loading / Error -->
            </div>

            <tr class="footer" v-if="$slots.footer || $scopedSlots.footer">
                <td class="select"></td>
                <slot name="footer" />
            </tr>
        </table>
    </div>
</template>

<script>
import selectRange from '../../mixins/selectRange'
import { mapGetters } from 'vuex'
import Draggable from 'vuedraggable'

export default {
    name: 'baseTable',
    components: {
        Draggable,
    },
    mixins: [selectRange],
    props: {
        stickyHeader: {},
        contentStatus: {},
        loadingMsg: {},
        errorCallback: {},
        errorMsg: {},
        hideSelect: {},
        items: {},
        selected: {},
        itemKey: {},
        contextItem: {},
        itemSize: {},
        hideContextButton: {},
        searchResult: {},
        searchKey: {},
        hideTopBar: {},
        itemType: {},
        focusIndex: {},
        itemsTotalCount: {},
        isDraggable: {},
        itemsReOrdered: {},
        useVirtualScroller: { default: true },
        subItemsArrayKey: {},
        subItemKey: {},
    },
    data: function() {
        return {
            sticky: false,
            headerFixed: false,
            distToTop: 0,
            desiredOffset: 16,
            scrollParent: null,
            scrollTable: null,
            scrollHeaderInitialized: false,
            tableWidth: null,
            statusTimeout: null,
            isReady: true,
            resizeHeaderTimeout: null,
        }
    },
    watch: {
        contentStatus: function(newVal, oldVal) {
            if (newVal == 'loading') {
                // Wait before setting the current folder status as loading
                this.statusTimeout = setTimeout(() => (this.isReady = false), 100)
            } else if (this.statusTimeout) {
                clearTimeout(this.statusTimeout)
            }

            if (newVal == 'error') {
                this.isReady = false
            }

            if (newVal == 'success') {
                this.isReady = true
            }
        },
        isDraggable: function(newVal) {
            if (newVal) {
                this.localItemsReOrdered = this.items
            }
        },
        items: function(newVal) {
            if (this.isDraggable) {
                this.localItemsReOrdered = newVal
            }
        },
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        showSelect() {
            return !this.hideSelect && this.items != null && this.selected != null
        },
        localSelected: {
            get() {
                return this.selected
            },
            set(localSelected) {
                this.$emit('update:selected', localSelected)
            },
        },
        localItemsReOrdered: {
            get() {
                return this.itemsReOrdered
            },
            set(localItemsReOrdered) {
                this.$emit('update:itemsReOrdered', localItemsReOrdered)
            },
        },
        searchEnabled() {
            return this.searchKey && this.searchResult && this.items
        },
        itemsSorted() {
            const items = this.searchEnabled ? this.searchResult : this.items
            if (this.itemType != 'user') {
                return items
            }
            return items.concat().sort((a, b) => (a.id == this.authUser.id ? -1 : 0))
        },
    },
    methods: {
        onContextMenu(e, item) {
            // If we have a selection set the context item to the first item in our selection
            this.$emit('update:contextItem', this.selected && this.selected.length > 0 ? this.selected[0] : item)
            this.$emit('update:contextMouseEvent', e, item)
            this.$emit('show-contextmenu', e, item)
        },
        focusSearch() {
            this.$refs.searchField.setFocus()
        },
        getYPos(element) {
            var yPosition = 0

            while (element) {
                yPosition += element.offsetTop - element.scrollTop + element.clientTop
                element = element.offsetParent
            }

            return yPosition
        },
        getScrollParent(element, includeHidden) {
            // Helper function to find the nearest parent that can be scrolled
            var style = getComputedStyle(element)
            var excludeStaticParent = style.position === 'absolute'
            var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/

            if (style.position === 'fixed') return document.body
            for (var parent = element; (parent = parent.parentElement); ) {
                style = getComputedStyle(parent)
                if (excludeStaticParent && style.position === 'static') {
                    continue
                }
                if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent
            }

            return document.body
        },
        handleScroll(event) {
            // Save a reference to the element we are scrolling in (the scroll parent)
            const scrollParent = this.scrollParent

            // Figure out how far it is to our scroll threshold
            // If we are not already sticky, save a reference to how far the sticky header is from the top of the page
            if (!this.sticky && !this.headerFixed) {
                // The threshold consists of 4 measures
                // The distance from the top of the parent to the top of the document
                const parentTop = scrollParent.getBoundingClientRect().top
                // The distance we have scrolled in the parent
                const parentScrollDist = scrollParent.scrollTop
                // The distance from the top of the element we want to make sticky when we meet and the top of the window
                const stickyElTopDist = this.$refs.stickyHeader.getBoundingClientRect().top
                // The offset we want to keep between the top and the sticky element
                const desiredOffset = this.desiredOffset

                this.distToTop = parentScrollDist + stickyElTopDist - parentTop - desiredOffset
            }
            const threshold = this.distToTop

            // Figure out if we have scrolled past out threshold
            const scrollDist = scrollParent.scrollTop
            if (scrollDist > threshold) {
                // The distance from the top of the parent to the top of the document
                const parentTop = scrollParent.getBoundingClientRect().top
                // Figure out if we have also scrolled past the bottom of the table
                const bottomOffset = 200
                const tableBottomDist = this.$refs.table.getBoundingClientRect().bottom - parentTop - bottomOffset
                if (tableBottomDist <= 0) {
                    this.makeHeaderFixed()
                    return
                }
                if (this.sticky) return
                // Make header sticky
                this.makeHeaderSticky()
            } else {
                if (!this.sticky) return
                this.makeHeaderUnsticky()
            }
        },
        makeHeaderSticky() {
            this.sticky = true
            this.headerFixed = false

            const stickyThis = this.$refs.stickyHeader
            const desiredOffset = this.desiredOffset // Offset from top of the window
            const parentTopDist = this.scrollParent.getBoundingClientRect().top // Distance from parent to top of page (take navbar into consideration)
            stickyThis.style.top = `${desiredOffset + parentTopDist}px`
            this.$refs.stickyPlaceholder.style.height = `${this.$refs.stickyInner.scrollHeight}px`
            // Set the position and size of the scroll bg
            this.$refs.stickyBg.style.height = `${this.$refs.stickyInner.scrollHeight + desiredOffset}px`
            // this.$refs.stickyBg.style.top = `${parentTopDist}px`

            const tableWidth = this.scrollTable.getBoundingClientRect().width
            stickyThis.style.width = tableWidth + 'px'
            this.tableWidth = tableWidth
        },
        makeHeaderFixed() {
            this.sticky = false
            this.headerFixed = true

            const stickyThis = this.$refs.stickyHeader
            const scrollParent = this.scrollParent
            const parentTop = scrollParent.getBoundingClientRect().top
            const parentScrollDist = scrollParent.scrollTop
            const bottomOffset = 200
            const desiredOffset = this.desiredOffset // Offset from top of the window
            const tableEl = this.$refs.table
            const tableBottomDist =
                parentScrollDist + tableEl.getBoundingClientRect().bottom - bottomOffset - this.getYPos(tableEl)
            // Set the absolute top
            stickyThis.style.top = `${tableBottomDist}px`
        },
        makeHeaderUnsticky() {
            this.sticky = false
            this.headerFixed = false

            const stickyThis = this.$refs.stickyHeader
            stickyThis.style.width = ''
        },
        resizeHeader() {
            if (this.sticky) {
                if (this.resizeHeaderTimeout) clearTimeout(this.resizeHeaderTimeout)
                this.resizeHeaderTimeout = setTimeout(() => {
                    // Fix table header to screen
                    const tableWidth = this.scrollTable.getBoundingClientRect().width
                    this.$refs.stickyHeader.style.width = tableWidth + 'px'
                    this.tableWidth = tableWidth
                }, 300)
            }
        },
    },
    created() {
        if (this.stickyHeader) {
            window.addEventListener('resize', this.resizeHeader, { passive: true })
        }
        if (this.contentStatus && this.contentStatus != 'success') this.isReady = false
    },
    destroyed() {
        if (this.stickyHeader) {
            this.scrollParent.removeEventListener('scroll', this.handleScroll)
            window.removeEventListener('resize', this.handleScroll)
        }
    },
    mounted() {
        if (this.stickyHeader) {
            this.scrollParent = this.getScrollParent(this.$el, false)
            this.scrollTable = this.$refs.table
            this.scrollParent.addEventListener('scroll', this.handleScroll, { passive: true })
        }
    },
}
</script>

<style lang="scss">
@import '~@/_variables.scss';
.table-wrapper {
    padding-top: 4px;
}
.base-table {
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    position: relative;
    &.has-context-button {
        th,
        td {
            &.action {
                margin-right: -4px;
            }
        }
    }
    .over-table {
        margin-bottom: 8px;
    }
    .body {
        border: $borderModule;
        border-radius: $borderRadiusModule;
        border-top: none;
        border-bottom: none;
        box-shadow: $shadowModule;
    }
    .footer {
        box-shadow: $shadowModule;
        border: $borderModule;
        border-radius: $borderRadiusModule;
        border-top: none;
    }
    .tabs-wrapper {
        display: flex;
        margin-bottom: -16px;
        width: 100%;
    }
    .sticky-bg {
        display: none;
    }
    &.sticky,
    &.fixed {
        .sticky-bg {
            background: $bg;
            position: absolute;
            top: -16px;
            z-index: -1;
            display: block;
            margin-left: -16px;
        }
        .sticky-header {
            position: fixed;
            z-index: 1;
        }
        .rounded-top {
            box-shadow: $shadowModule;
            border-bottom: $borderModule;
        }
        .sticky-placeholder {
            display: block;
        }
        .tabs-wrapper {
            display: flex;
            margin-bottom: -16px;
        }
    }
    &.fixed {
        .sticky-header {
            position: absolute;
        }
    }
    .sticky-placeholder {
        display: none;
    }
    .rounded-top {
        border: $borderModule;
        border-bottom: none;
        border-radius: $borderRadiusModule $borderRadiusModule 0 0;
        overflow: hidden;
        box-shadow: $shadowModule;
    }
    tr {
        background: $bgModule;
        min-height: 48px;
        display: flex;
        align-items: center;
        padding: 8px;
        position: relative;
        &:not(.table-top-bar) {
            border-bottom: $borderModule;
            th,
            td {
                flex: 1;
            }
        }
        &:not(.header):not(.footer):not(.table-top-bar):not(.last) {
            &:hover {
                td {
                    &.title {
                        i {
                            color: $primary;
                            transition: 0;
                        }
                    }
                }
            }
        }
        &.active {
            background: #d3daff !important;
            &:not(.table-top-bar) {
                border-color: $primary300;
            }
        }
        &.header,
        &.footer {
            color: $fontTableHeader;
        }
        &.header {
            height: 32px;
        }
        &.footer {
            border-radius: 0 0 $borderRadiusModule $borderRadiusModule;
            margin-bottom: 0;
            min-height: 16px;
            height: auto;
        }
    }
    th,
    td {
        padding: 0 4px;
        > i {
            &:last-child {
                margin-left: 12px;
            }
            &:first-child {
                margin-right: 12px;
            }
        }
        &.action {
            flex: 1;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            > *:not(:last-child) {
                margin-right: 4px;
            }
        }
        &.context-button {
            flex: 1;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            min-width: 40px;
            max-width: 40px;
        }
        &.select {
            flex: 0 1 auto;
            min-width: 40px;
            max-width: 40px;
            display: flex;
            align-items: center;
            height: 100%;
            padding-left: 8px;
            cursor: pointer;
        }
    }
    // Error
    .load-wrapper {
        display: flex;
        flex-direction: column;
        align-content: center;
        text-align: center;
        justify-content: center;
        min-height: 200px;
    }
}
</style>
