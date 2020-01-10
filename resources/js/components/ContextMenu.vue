<template>
    <div v-if="visible" v-click-outside="hide" class="context-menu" ref="contextMenu" @click.capture="hide">
        <slot :item="item"/>
    </div>
</template>

<script>
export default {
    name: 'contextMenu',
    props: [

    ],
    data: function() {
        return {
            visible: false,
            item: 0,
        }
    },
    methods: {
        show(e) {
            // e is expected to be a mouseclick event
            // Set the current context menu item
            const mouseX = e.clientX
            const mouseY = e.clientY
            // Make the context menu visisble
            this.visible = true
            // Wait for the DOM to update before we position the Context Menu
            this.$nextTick(() => {
                // Save a reference to the contextual menu
                const contextMenu = this.$refs.contextMenu
                // Position the contextual menu
                // Make sure the entire contextual menu is always visible
                // Define a minimum offset the context menu should keep from the windows edges
                const offset = 20
                // menuRect = contextMenu.getBoundingClientRect()
                const menuHeight = contextMenu.scrollHeight
                const menuWidth = contextMenu.scrollWidth
                const windowWidth = window.innerWidth
                const windowHeight = window.innerHeight
                if (mouseX + menuWidth > windowWidth) {
                    contextMenu.style.right=offset+'px'
                    contextMenu.style.left='auto'
                } else {
                    contextMenu.style.left=mouseX+'px'
                    contextMenu.style.right='auto'
                }

                if (mouseY + menuHeight > windowHeight) {
                    contextMenu.style.bottom=offset+'px'
                    contextMenu.style.top='auto'
                } else {
                    contextMenu.style.top=mouseY+'px'
                    contextMenu.style.bottom='auto'
                }

                // contextMenu.style.top=mouseY+'px'
            })
        },
        hide() {
            this.visible = false
        },
    },

}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .context-menu {
        background: white;
        border-radius: 4px;
        box-shadow: 0 3px 30px rgba(black, .3);
        z-index: 1;
        position: fixed;
        min-width: 200px;
        .item-group {
            padding: 8px 0;
            &:not(:first-child) {
                border-top: solid 1px $light2;
            }
        }
        .item {
            padding: 8px 16px;
            line-height: 1;
            color: $dark05;
            &:hover {
                background: $light1;
                cursor: pointer;
            }
            .icon-wrapper {
                width: 32px;
                display: inline-block;
                color: $dark15;
                i {
                    font-size: 16px;
                    i {
                        font-size: 9px;
                    }
                }
            }
        }
    }
</style>