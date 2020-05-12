<template>
    <table class="flex-table" ref="table" :class="{'sticky': sticky}">
        <div ref="stickyHeader" class="sticky-header" :style="tableWidth">
            <div ref="stickyBg" class="sticky-bg" :style="tableWidth"></div>
            <div ref="stickyInner" class="inner">
                <div class="tabs" v-if="$slots.tabs">
                    <slot name="tabs"/>
                </div>
                <div class="rounded-top">
                    <slot name="topBar"/>
                    <tr class="header">
                        <slot name="header"/>
                    </tr>
                </div>
            </div>
        </div>
        <div ref="stickyPlaceholder" class="sticky-placeholder"></div>
        <div class="body">
            <!-- Content -->
            <slot v-if="isReady" name="body"/>
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
</template>

<script>
export default {
    name: 'flexTable',
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
    props: [
        'stickyHeader',
        'contentStatus',
        'loadingMsg',
        'errorCallback',
        'errorMsg',
    ],
    watch: {
        contentStatus: function(newVal, oldVal) {
            if (newVal == 'loading') {
                console.log('set timeout')
                // Wait 300 ms before setting the current folder status as loading
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
        // isReady() {
        //     return this.contentStatus != 'loading' && this.contentStatus != 'error'
        // }
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
            let scrollDist = scrollParent.scrollTop
            const threshold = this.distToTop - parentTopDist - desiredOffset
            if (scrollDist > threshold) {
                // // Set width of sticky elements
                if (this.sticky == false) {
                    stickyThis.style.top = `${desiredOffset + parentTopDist}px`
                    this.$refs.stickyPlaceholder.style.height = `${this.$refs.stickyInner.scrollHeight}px`
                    // Set the position and size of the scroll bg
                    this.$refs.stickyBg.style.height = `${this.$refs.stickyInner.scrollHeight + desiredOffset}px`
                    this.$refs.stickyBg.style.top = `${parentTopDist}px`

                    const tableWidth = this.scrollTable.getBoundingClientRect().width
                    this.tableWidth = `width: ${tableWidth}px`
                }
                this.sticky = true
            } else if (this.sticky == true) {
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
            this.tableWidth = `width: ${tableWidth}px`
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
$rowRadius: 4px;

.flex-table {
    white-space: nowrap;
    border-spacing: 0 2px;
    display: flex;
    flex-direction: column;
    .tabs {
        display: flex;
        margin-bottom: -$rowRadius;
    }
    .sticky-bg {
        display: none;
    }
    &.sticky {
        .sticky-bg {
            background: $bg;
            box-shadow: 0 10px 7px -6px rgba(0, 0, 0, 0.05) inset;
            position: fixed;
            z-index: -1;
            display: block;
        }
        .sticky-header {
            position: fixed;
            z-index: 1;
            .header {
                box-shadow: 0px 4px 10px #0000002A;
                position: static;
            }
        }
        .sticky-placeholder {
            display: block;
        }
    }
    .sticky-placeholder {
        display: none;
    }
    .rounded-top {
        > :first-child {
            border-radius: $rowRadius $rowRadius 0 0;
        }
    }
    tr {
        background: white;
        min-height: 48px;
        display: flex;
        align-items: center;
        padding: 8px;
        position: relative;
        &.active {
            outline: solid 1px $primary;
            outline-offset: -1px;
            background: $bgContentActive;
        }
        &:not(.table-top-bar) {
            margin-bottom: 2px;
            > * {
                flex: 1;
            }
        }
        &:not(.header):not(.footer):not(.table-top-bar) {
            &:hover {
                background: $light1;
                td {
                    &.title {
                        i {
                            color: $dark05;
                            transition: 0;
                        }
                    }
                }
            }
        }
        &.header, &.footer {
            color: $tableHeader;
        }
        &.header {
            height: 32px;
        }
        &.footer {
            border-radius: 0 0 $rowRadius $rowRadius;
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
        min-height: 200px;
    }
}

</style>