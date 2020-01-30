<template>
    <table class="flex-table" ref="table" :class="{'sticky': sticky}">
        <div ref="stickyHeader" class="sticky-header">
            <div ref="stickyBg" class="sticky-bg"></div>
            <div ref="stickyInner" class="inner">
                <slot name="tabs"/>
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
            <slot name="body"/>
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
        distToTop: null
    }},
    methods: {
        getYPos(element) {
            var yPosition = 0;

            while(element) {
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }

            return yPosition;
        },
        handleScroll (event) {
            // Fix table header to screen
            const theWindow = document.getElementById('main')
            const stickyThis = this.$refs.stickyHeader
            let scrollDist = theWindow.scrollTop
            const desiredOffset = 20
            const navHeight = 72
            const threshold = this.distToTop - navHeight - desiredOffset
            if (scrollDist >= threshold) {
                // // Set width of sticky elements
                if (this.sticky == false) {
                    stickyThis.style.top = `${desiredOffset + navHeight}px`
                    stickyThis.style.width = `${this.$refs.table.scrollWidth}px`
                    this.$refs.stickyBg.style.width = `${this.$refs.table.scrollWidth}px`
                    this.$refs.stickyPlaceholder.style.height = `${this.$refs.stickyInner.scrollHeight}px`
                }
                this.sticky = true
            } else if (this.sticky == true) {
                this.sticky = false
            }
        },
    },
    created () {
        document.getElementById('main').addEventListener('scroll', this.handleScroll)
    },
    destroyed () {
        document.getElementById('main').removeEventListener('scroll', this.handleScroll)
    },
    mounted() {
        this.distToTop =  this.getYPos(this.$refs.stickyHeader)
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
        &.sticky {
            .sticky-bg {
                background: $bg;
                box-shadow: 0 10px 7px -6px rgba(0, 0, 0, 0.05) inset;
                top: 72px;
                height: 120px;
                position: fixed;
                z-index: -1;
            }
            .sticky-header {
                position: fixed;
                z-index: 1;
                .header {
                    box-shadow: 0px 2px 10px #0000001A;
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
            padding: 8px 0;
            position: relative;
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
            overflow: hidden;
        }
        th, td {
            padding: 0 12px;
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
                    margin-right: 8px;
                }
            }
            &.select {
                flex: 0 1 auto;
                min-width: 40px;
                max-width: 40px;
            }
        }
    }
</style>