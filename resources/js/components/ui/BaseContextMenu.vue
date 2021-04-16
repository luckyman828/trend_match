<template>
    <div
        v-if="visible || inline"
        v-click-outside="onClickOutside"
        class="context-menu"
        ref="contextMenu"
        :style="menuWidth"
        :class="{ inline: inline }"
    >
        <div class="item-group header" v-if="hasHeader">
            <strong>
                <slot name="header" :item="item" :mouseEvent="mouseEvent" />
            </strong>
            <button v-if="!inline" class="circle close" @click="hide"><i class="far fa-times"></i></button>
        </div>

        <div class="body">
            <slot :item="item" :mouseEvent="mouseEvent" :hide="hide" />
        </div>

        <div class="item-group footer" v-if="hasFooter">
            <slot name="footer" :item="item" :mouseEvent="mouseEvent" :hide="hide" />
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    name: 'contextMenu',
    props: {
        columns: {},
        hotkeys: {
            default: () => [],
        },
        inline: { default: false },
    },
    data: function() {
        return {
            visible: false,
            item: null,
            mouseEvent: null,
        }
    },
    computed: {
        hasHeader() {
            // Check if the header slot has any content
            return !!this.$slots.header || !!this.$scopedSlots.header
        },
        hasFooter() {
            // Check if the footer slot has any content
            return !!this.$slots.footer || !!this.$scopedSlots.footer
        },
        menuWidth() {
            // if (this.columns) {
            const columnCount = this.columns ? this.columns : 1
            const baseWidth = 240
            return { width: `${baseWidth * columnCount}px` }
            // }
        },
    },
    methods: {
        ...mapMutations('contextMenu', ['INCREMENT_VISIBLE_AMOUNT', 'DECREMENT_VISIBLE_AMOUNT']),
        show(e) {
            // Increment the amount of visible context menus if this context menu is not already visible
            if (!this.visible) {
                this.INCREMENT_VISIBLE_AMOUNT()
            }
            // e is expected to be a mouseclick event
            // Stop progration to avoid triggering the clickOutside function by the click to show the context menu
            e.stopPropagation()
            // Save a reference to the mouseClick event
            this.mouseEvent = e
            // Set the current context menu item
            const mouseX = e.clientX
            const mouseY = e.clientY
            // Make the context menu visisble
            this.visible = true
            // Wait for the DOM to update before we position the Context Menu
            this.$nextTick(() => {
                // Save a reference to the contextual menu
                const contextMenu = this.$refs.contextMenu
                // Set focus on the context menu to allow keybinding
                // contextMenu.focus()

                // Position the contextual menu
                // Make sure the entire contextual menu is always visible
                // Define a minimum offset the context menu should keep from the windows edges
                const offset = 40
                // menuRect = contextMenu.getBoundingClientRect()
                const menuHeight = contextMenu.scrollHeight
                const menuWidth = contextMenu.scrollWidth
                const windowWidth = window.innerWidth
                const windowHeight = window.innerHeight
                const maxHeight = this.columns > 1 ? windowHeight - 2 * offset : 500
                if (mouseX + menuWidth > windowWidth) {
                    contextMenu.style.right = offset + 'px'
                    contextMenu.style.left = 'auto'
                } else {
                    contextMenu.style.left = mouseX + 'px'
                    contextMenu.style.right = 'auto'
                }

                // If there is not enough space below the mouseY
                if (mouseY + menuHeight + offset > windowHeight && mouseY + maxHeight + offset > windowHeight) {
                    // Test if we have space to display the entire menu
                    if (menuHeight + offset * 2 < windowHeight) {
                        // Offset * 2 to have space above and below
                        contextMenu.style.maxHeight = `${maxHeight}px`
                        contextMenu.style.top = `${windowHeight - menuHeight - offset * 2}px`
                        // contextMenu.style.top=`${windowHeight - menuHeight - offset*2}px`
                    } else {
                        const finalHeight =
                            windowHeight - offset * 2 < maxHeight ? windowHeight - offset * 2 : maxHeight
                        contextMenu.style.top = `${windowHeight - finalHeight - offset}px`
                        contextMenu.style.maxHeight = `${finalHeight}px`
                    }
                }
                // If there is enough space below mouseY
                else {
                    contextMenu.style.top = mouseY + 'px'
                    contextMenu.style.maxHeight = maxHeight + 'px'
                }

                // contextMenu.style.top=mouseY+'px'
            })
            // Add event listeners
            document.body.addEventListener('keyup', this.hotkeyHandler)
            document.body.addEventListener('click', this.clickHandler)
        },
        onClickOutside(e) {
            if (e.target.classList.contains('submenu') || e.target.closest('.submenu')) return
            this.hide()
        },
        hide() {
            if (this.visible) {
                this.DECREMENT_VISIBLE_AMOUNT()
            }
            this.visible = false
            this.$nextTick(() => {
                this.$emit('hide')
            })
            // Remove event listeners
            document.body.removeEventListener('keyup', this.hotkeyHandler)
            document.body.removeEventListener('click', this.clickHandler)
        },
        hotkeyHandler(event) {
            // Only listen if the contextMenu is visible & we are not typing in an input field
            if (this.visible && event.code == 'Escape') {
                this.hide()
            }
        },
        clickHandler(event) {
            // Hide the context menu on clicks inside it
            // if (this.visible) {
            //     const el = event.target
            //     // Check if we have clicked an item
            //     if (el.classList.contains('item')
            //     && !el.classList.contains('no-close')
            //     && !el.classList.contains('has-submenu')
            //     // && !item.classList.contains('context-menu-item')
            //     && el.closest('.context-menu')) {
            //         console.log('hide context menu 1')
            //         this.hide()
            //         return
            //     }
            //     // Or check if the parent of this element is a context Menu item
            //     else {
            //         // find the item parent
            //         const item = el.closest('.item')
            //         if (item && !item.classList.contains('no-close')
            //         && !item.classList.contains('has-submenu')
            //         // && !item.classList.contains('context-menu-item')
            //         && item.closest('.context-menu')) {
            //             console.log('hide context menu 2')
            //             this.hide()
            //             return
            //         }
            //     }
            // }
        },
    },
    destroyed() {
        if (this.visible) {
            this.DECREMENT_VISIBLE_AMOUNT()
        }
        // Remove event listeners
        document.body.removeEventListener('keyup', this.hotkeyHandler)
        document.body.removeEventListener('click', this.clickHandler)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.context-menu,
.context-menu:focus,
.context-menu .sub-menu {
    background: white;
    border-radius: $borderRadiusModule;
    border: $borderModule;
    box-shadow: $shadowModuleHard;
    z-index: 1;
    position: fixed;
    // overflow: hidden;
    display: flex;
    flex-direction: column;
    &.inline {
        position: relative;
    }
    .columns {
        display: flex;
        border-top: solid 1px $divider;
        max-height: calc(100vh - 180px);
        overflow: auto;
        > * {
            width: 240px;
            border-top: none;
            height: 100%;
            &.item-group:not(:first-child) {
                border-top: none;
            }
        }
        > .item-group {
            border-top: none;
            border-left: solid 2px $divider;
            &:first-child {
                border-left: none;
            }
            &:last-child {
                padding-bottom: 24px;
            }
        }
    }
    .item-group {
        > .header {
            padding: 8px 16px;
            line-height: 1;
        }
        padding: 8px 0;
        &:not(:first-child) {
            border-top: solid 1px $divider;
        }
    }
    .item,
    .item-wrapper {
        padding: 8px 16px;
        color: $dark05;
        display: flex;
        align-items: center;
        position: relative;
        font-size: 14px;
        &:not(.item-wrapper):not(.context-menu-item) {
            cursor: pointer;
            &:hover {
                background: $light1;
            }
        }
        .icon-wrapper {
            width: 32px;
            display: block;
            color: $dark15;
            i {
                font-size: 14px;
                i {
                    font-size: 8px;
                }
            }
        }
        &.has-submenu {
            position: relative;
            &::after {
                content: '\f054';
                font-family: 'Font Awesome 5 Pro';
                font-weight: 900;
                right: 16px;
                font-size: 12px;
                position: absolute;
            }
        }
        &:hover {
            .sub-menu {
                display: block;
            }
        }
        .sub-menu {
            display: none;
            position: absolute;
            left: 100%;
            width: 100%;
        }
        // &.disabled {
        //     // pointer-events: none;
        //     opacity: .7;
        // }
    }
    .header {
        padding-left: 16px;
        padding-right: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > .strong {
            margin-right: 8px;
        }
    }
}
</style>
