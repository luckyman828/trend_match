<template>
    <v-popover :disabled="!hasSubmenu" placement="right" ref="popover">
        <div
            class="item context-menu-item"
            :class="[disabled && 'disabled no-close', { 'has-submenu': hasSubmenu }]"
            tabindex="0"
            ref="contextMenuItem"
            :id="id"
            @click="onClick"
            v-tooltip="{ content: (disabled && disabledTooltip) || tooltip, container: `#${id}` }"
        >
            <!-- Item content -->

            <div class="item-content">
                <div class="icon-wrapper"><i :class="iconClass"></i></div>
                <slot />
                <i v-if="hasSubmenu" class="submenu-icon far fa-angle-right"></i>
            </div>
        </div>
        <div class="submenu" ref="submenu" slot="popover" v-if="hasSubmenu">
            <div class="item-group">
                <slot name="submenu" />
            </div>
        </div>
    </v-popover>
</template>

<script>
export default {
    name: 'BaseContextMenuItem',
    props: ['iconClass', 'disabled', 'disabledTooltip', 'tooltip', 'hotkey', 'hasSubmenu'],
    data: function() {
        return {
            id: 'id-' + this.$uuid.v4(),
            contextMenuParent: null,
        }
    },
    computed: {
        parentPopover() {
            return this.$el.closest('.popover')
        },
    },
    methods: {
        findParentContextMenu($vm) {
            const parent = $vm.$parent
            if (parent.$options.name == 'contextMenu') {
                this.contextMenuParent = parent
                return
            }
            this.findParentContextMenu(parent)
        },
        findParentContextMenu($vm) {
            const parent = $vm.$parent
            if (parent.$options.name == 'contextMenu') {
                this.contextMenuParent = parent
                return
            }
            this.findParentContextMenu(parent)
        },
        onFireAction(e) {
            if (this.disabled) return
            if (this.contextMenuParent && !this.contextMenuParent.visible && !this.contextMenuParent.inline) return
            if (this.parentPopover && !this.parentPopover.classList.contains('open')) return
            this.$emit('click', e)
            this.$emit('action', e)
            this.closeContextMenu()
        },
        closeContextMenu() {
            if (this.contextMenuParent) {
                this.contextMenuParent.hide()
            }
        },
        onClick(e) {
            if (this.hasSubmenu) return
            this.onFireAction(e)
        },
        hotkeyHandler(e) {
            if (e.code == this.hotkey || (Array.isArray(this.hotkey) && this.hotkey.includes(e.code))) {
                if (this.hasSubmenu) {
                    const popover = this.$refs.popover
                    console.log('hotkey', popover)
                    if (!popover.isOpen) {
                        popover.show()
                    } else {
                        console.log('hide popover')
                        popover.hide()
                    }
                } else {
                    // If the parent container has a submenu open, only listen for hotkeys of the items inside the submenu
                    let contextMenu = this.$el.closest('.context-menu')
                    let submenu = this.$el.closest('.submenu')
                    const parent = !!submenu ? submenu : contextMenu
                    if (parent.classList.contains('submenu-open')) return
                    this.onFireAction()
                }
            }
        },
    },
    created() {
        if (this.hotkey) document.addEventListener('keyup', this.hotkeyHandler)
        this.findParentContextMenu(this)
    },
    destroyed() {
        if (this.hotkey) document.removeEventListener('keyup', this.hotkeyHandler)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.item {
    padding: 8px 16px;
    color: $dark05;
    display: flex;
    align-items: center;
    font-size: 14px;
    .item-content {
        display: flex;
        align-items: center;
        width: 100%;
        position: relative;
    }
    &:not(.item-wrapper) {
        cursor: pointer;
        &:hover,
        &:focus {
            background: $light1;
            outline: none;
        }
    }
    .icon-wrapper {
        width: 32px;
        display: flex;
        color: $dark15;
        i {
            font-size: 14px;
            i {
                font-size: 7px;
            }
        }
    }
    &.disabled {
        cursor: default;
        pointer-events: all;
        .item-content {
            opacity: 0.7;
        }
    }
    .submenu-icon {
        position: absolute;
        right: 0;
    }
}
.submenu {
    .item-group {
        padding: 8px 0;
    }
}
</style>
