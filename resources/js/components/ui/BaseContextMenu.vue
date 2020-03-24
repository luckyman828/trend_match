<template>
    <div v-if="visible" v-click-outside="hide" class="context-menu" ref="contextMenu" :style="menuWidth">
        <div class="item-group header" v-if="hasHeader">
            <strong>
                <slot name="header" :item="item" :mouseEvent="mouseEvent"/>
            </strong>
            <button class="circle close" @click="hide"><i class="fal fa-times"></i></button>
        </div>

        <div class="body">
            <slot :item="item" :mouseEvent="mouseEvent" :hide="hide"/>
        </div>
        

        <div class="item-group footer" v-if="hasFooter">
            <slot name="footer" :item="item" :mouseEvent="mouseEvent" :hide="hide"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'contextMenu',
    props: [
        'columns'
    ],
    data: function() {
        return {
            visible: false,
            item: null,
            mouseEvent: null
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
                return {width: `${baseWidth * columnCount}px`}
            // }
        }
    },
    methods: {
        show(e) {
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
                const offset = 20
                // menuRect = contextMenu.getBoundingClientRect()
                const menuHeight = contextMenu.scrollHeight
                const menuWidth = contextMenu.scrollWidth
                const windowWidth = window.innerWidth
                const windowHeight = window.innerHeight
                const maxHeight = this.columns > 1 ? windowHeight-2*offset : 500
                if (mouseX + menuWidth > windowWidth) {
                    contextMenu.style.right=offset+'px'
                    contextMenu.style.left='auto'
                } else {
                    contextMenu.style.left=mouseX+'px'
                    contextMenu.style.right='auto'
                }

                // If there is not enough space below the mouseY
                if (mouseY + menuHeight + offset > windowHeight && mouseY + maxHeight + offset > windowHeight) {
                    // Test if we have space to display the entire menu
                    if (menuHeight + offset*2 < windowHeight) { // Offset * 2 to have space above and below
                        contextMenu.style.maxHeight=`${maxHeight}px`
                        contextMenu.style.top=`${windowHeight - menuHeight - offset*2}px`
                        // contextMenu.style.top=`${windowHeight - menuHeight - offset*2}px`
                    } else {
                        const finalHeight = windowHeight - offset*2 < maxHeight ? windowHeight - offset*2 : maxHeight
                        contextMenu.style.top=`${windowHeight - finalHeight - offset}px`
                        contextMenu.style.maxHeight=`${finalHeight}px`
                    }
                }
                // If there is enough space below mouseY
                else {
                    contextMenu.style.top=mouseY+'px'
                    contextMenu.style.maxHeight=maxHeight+'px'
                }

                // contextMenu.style.top=mouseY+'px'
            })
            // Add event listeners
            document.body.addEventListener('keyup', this.hotkeyHandler)
            document.body.addEventListener('click', this.clickHandler)

        },
        hide() {
            this.visible = false
            this.$nextTick(() => {
                this.$emit('hide')
            })
            // Remove event listeners
            document.body.removeEventListener('keyup', this.hotkeyHandler)
            document.body.removeEventListener('click', this.clickHandler)
        },
        hotkeyHandler(event) {
            // Only listen if the contextMenu is visible
            if(this.visible && event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT') {
                const key = event.code
                if (key != 'Tab' && key != 'ShiftKey') {
                    this.hide()
                    // Get the key name and emit it
                    this.$emit('keybind-'+event.key,event)
                }
            }
        },
        clickHandler(event) {
            // Hide the context menu on clicks inside it
            if (this.visible) {
                const el = event.target

                // Check if we have clicked an item
                if (el.classList.contains('item') 
                && !el.classList.contains('no-close') 
                // && !item.classList.contains('context-menu-item')
                && el.closest('.context-menu')) {
                    this.hide()
                    return
                } 
                // Or check if the parent of this element is a context Menu item
                else {
                    // find the item parent
                    const item = el.closest('.item')
                    if (item && !item.classList.contains('no-close') 
                    // && !item.classList.contains('context-menu-item')
                    && item.closest('.context-menu')) {
                        this.hide()
                        return
                    }
                }
            }
        }
    },
    destroyed() {
        // Remove event listeners
        document.body.removeEventListener('keyup', this.hotkeyHandler)
        document.body.removeEventListener('click', this.clickHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .context-menu, .context-menu:focus {
        background: white;
        border-radius: 4px;
        box-shadow: 0 3px 30px rgba(black, .3);
        z-index: 1;
        position: fixed;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .columns {
            display: flex;
            border-top: solid 1px $divider;
            max-height: calc(100vh - 160px);
            overflow: auto;
            > * {
                width: 240px;
                border-top: none;
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
        .item, .item-wrapper {
            padding: 8px 16px;
            color: $dark05;
            display: flex;
            align-items: center;
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
                    font-size: 16px;
                    i {
                        font-size: 9px;
                    }
                }
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