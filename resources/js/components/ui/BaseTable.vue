<template>
    <div class="table-wrapper" ref="tableWrapper">
        <table class="base-table" ref="table" 
        :class="[{'sticky': sticky}, {'has-tabs': $slots.tabs}]">
            <div ref="stickyHeader" class="sticky-header">
                <div ref="stickyBg" class="sticky-bg" :style="{width: tableWidth + 32+'px'}"></div>
                <div ref="stickyInner" class="inner">
                    <div class="tabs-wrapper" v-if="$slots.tabs">
                        <slot name="tabs"/>
                    </div>
                    <div class="rounded-top">
                        <slot name="topBar"/>
                        <tr class="header">
                            <BaseTableHeader class="select" v-if="showSelect">
                                <BaseCheckbox :value="selected.length > 0" :modelValue="true" 
                                @change="(checked) => checked ? $emit('update:selected', items) :  $emit('update:selected', [])"/>
                            </BaseTableHeader>
                            <slot name="header"/>
                        </tr>
                    </div>
                </div>
            </div>
            <div ref="stickyPlaceholder" class="sticky-placeholder"></div>
            <div class="body">
                <!-- Content -->
                <template v-if="isReady">
                    <BaseTableRow v-for="(item, index) in items" 
                        :key="itemKey ? item[itemKey] : index"
                        :item="item" :index="index"
                        :showSelect="showSelect"
                        :selected.sync="localSelected"
                        :items="items"
                        @select-range="selectRange(index, items, selected)"
                    >
                        <slot name="row" :item="item" :index="index"/>
                    </BaseTableRow>
                </template>
                <!-- End content -->

                <!-- Loading / Error -->
                <tr class="load-wrapper" v-else>
                    <!-- Loading -->
                    <BaseLoader v-if="contentStatus != 'error'" :msg="loadingMsg || 'loading content'"/>

                    <!-- Error  -->
                    <BaseContentLoadError v-else :msg="errorMsg || 'error loading content'" :callback="errorCallback"/>
                </tr>
                <!-- End Loading / Error -->
            </div>
            <tr class="footer">
                <td class="select"></td>
                <slot name="footer"/>
            </tr>
        </table>
    </div>
</template>

<script>
import selectRange from '../../mixins/selectRange'

export default {
    name: 'baseTable',
    mixins: [
        selectRange,
    ],
    props: [
        'stickyHeader',
        'contentStatus',
        'loadingMsg',
        'errorCallback',
        'errorMsg',
        'hideSelect',
        'items',
        'selected',
        'itemKey',
    ],
    data: function() { return {
        sticky: false,
        distToTop: null,
        scrollParent: null,
        scrollTable: null,
        scrollHeaderInitialized: false,
        tableWidth: null,
        statusTimeout: null,
        isReady: true,
    }},
    watch: {
        contentStatus: function(newVal, oldVal) {
            if (newVal == 'loading') {
                // Wait before setting the current folder status as loading
                this.statusTimeout = setTimeout(() => this.isReady = false, 100)
            } 
            else if (this.statusTimeout) {
                clearTimeout(this.statusTimeout)
            }

            if (newVal == 'error') {
                this.isReady = false
            }

            if (newVal == 'success') {
                this.isReady = true
            }
        }
    },
    computed: {
        showSelect() {
            return !this.hideSelect && this.items != null && this.selected != null
        },
        localSelected: {
            get() { return this.selected },
            set(localSelected) {this.$emit('update:selected', localSelected)}
        }
    },
    methods: {
        getYPos(element) {
            var yPosition = 0;

            while(element) {
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }

            return yPosition;
        },
        getScrollParent(element, includeHidden) {
            // Helper function to find the nearest parent that can be scrolled
            var style = getComputedStyle(element);
            var excludeStaticParent = style.position === "absolute";
            var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

            if (style.position === "fixed") return document.body;
            for (var parent = element; (parent = parent.parentElement);) {
                style = getComputedStyle(parent);
                if (excludeStaticParent && style.position === "static") {
                    continue;
                }
                if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
            }

            return document.body;
        },
        handleScroll (event) {
            // Fix table header to screen
            // Initialize the header
            this.initScrollHeader()
            const stickyThis = this.$refs.stickyHeader
            const desiredOffset = 16
            // Get scrollparent offset from top
            const scrollParent = this.scrollParent
            // const parentTopDist = this.getYPos(scrollParent)
            const parentTopDist = scrollParent.getBoundingClientRect().top
            const tabsHeight = this.$slots.tabs ? 40 : 0
            let scrollDist = scrollParent.scrollTop
            const threshold = this.distToTop - parentTopDist - desiredOffset - tabsHeight
            if (scrollDist > threshold) {
                // // Set width of sticky elements
                if (this.sticky == false) {
                    stickyThis.style.top = `${desiredOffset + parentTopDist + tabsHeight}px`
                    this.$refs.stickyPlaceholder.style.height = `${this.$refs.stickyInner.scrollHeight}px`
                    // Set the position and size of the scroll bg
                    this.$refs.stickyBg.style.height = `${this.$refs.stickyInner.scrollHeight + desiredOffset + tabsHeight}px`
                    this.$refs.stickyBg.style.top = `${parentTopDist}px`

                    const tableWidth = this.scrollTable.getBoundingClientRect().width
                    stickyThis.style.width = tableWidth+'px'
                    this.tableWidth = tableWidth
                }
                this.sticky = true
            } else if (this.sticky == true) {
                stickyThis.style.width = ''
                this.sticky = false
            }
        },
        resizeHeader() {
            // Fix table header to screen
            // Initialize the header
            this.initScrollHeader()
            const desiredOffset = 16
            // Get scrollparent offset from top
            const scrollParent = this.scrollParent
            const parentTopDist = scrollParent.getBoundingClientRect().top
            let scrollDist = scrollParent.scrollTop
            const threshold = this.distToTop - parentTopDist - desiredOffset
            const tableWidth = this.scrollTable.getBoundingClientRect().width
            this.tableWidth = tableWidth
        },
        initScrollHeader() {
            if (this.stickyHeader && !this.scrollHeaderInitialized) {
                this.distToTop =  this.getYPos(this.$refs.stickyHeader)
                this.scrollHeaderInitialized = true
            }
        }
    },
    created () {
        if (this.stickyHeader) {
            window.addEventListener('resize', this.resizeHeader)
        }
        if (this.contentStatus && this.contentStatus != 'success') this.isReady = false
    },
    destroyed () {
        if (this.stickyHeader) {
            this.scrollParent.removeEventListener('scroll', this.handleScroll)
            window.removeEventListener('resize', this.handleScroll)
        }
    },
    mounted() {
        if (this.stickyHeader) {
            this.scrollParent = this.getScrollParent(this.$el, false)
            this.scrollTable = this.$refs.table
            this.scrollParent.addEventListener('scroll', this.handleScroll)
        }
    }
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
    border: $borderModule;
    border-radius: $borderRadiusModule;
    box-shadow: $shadowModule;
    position: relative;
    &.has-tabs {
        margin-top: $heightTableTab;
    }
    .tabs-wrapper {
        display: flex;
        margin-bottom: -$borderRadiusModule;
        position: absolute;
        top: -$heightTableTab;
        left: -1px;
        width: 100%;
    }
    .sticky-bg {
        display: none;
    }
    &.sticky {
        .sticky-bg {
            background: $bg;
            position: fixed;
            z-index: -1;
            display: block;
            margin-left: -16px;
        }
        .sticky-header {
            position: fixed;
            z-index: 1;
            margin-left: -1px;
            .inner {
                box-shadow: $shadowModule;
                border: $borderModule;
                border-radius: $borderRadiusModule $borderRadiusModule 0 0;
            }
        }
        .sticky-placeholder {
            display: block;
        }
        .tabs-wrapper {
            display: flex;
            margin-bottom: -$borderRadiusModule;
            position: absolute;
            top: -$heightTableTab;
            left: 0;
        }
    }
    .sticky-placeholder {
        display: none;
    }
    .rounded-top {
        > :first-child {
            border-radius: $borderRadiusModule $borderRadiusModule 0 0;
        }
    }
    tr {
        background: $bgModule;
        min-height: 48px;
        display: flex;
        align-items: center;
        padding: 8px;
        position: relative;
        &.active {
            outline: solid 1px $primary;
            outline-offset: -1px;
            background: $bgModuleActive;
        }
        &:not(.table-top-bar) {
            border-bottom: $borderModule;
            // margin-bottom: 2px;
            th, td {
                flex: 1;
            }
        }
        &:not(.header):not(.footer):not(.table-top-bar) {
            &:hover {
                background: $bgModuleHover;
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
        &.header, &.footer {
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
    td {
        // overflow: hidden;
    }
    th, td {
        padding: 0 4px;
        &:first-child:not(.select) {
            margin-left: 8px;
        }
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
            >*:not(:last-child) {
                margin-right: 4px;
            }
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