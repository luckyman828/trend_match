<template>
    <div
        class="item context-menu-item"
        :class="[disabled && 'disabled no-close', { 'has-submenu': hasSubmenu }]"
        tabindex="0"
        ref="contextMenuItem"
        :id="id"
        v-tooltip="{ content: (disabled && disabledTooltip) || tooltip, container: `#${id}` }"
        @click="onClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <!-- Item content -->
        <div class="item-content">
            <div class="icon-wrapper"><i :class="iconClass"></i></div>
            <slot />
        </div>

        <!-- Submenu -->
        <div class="submenu" v-if="submenuVisible" ref="submenu">
            <slot name="submenu" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseContextMenuItem',
    props: ['iconClass', 'disabled', 'disabledTooltip', 'tooltip', 'hotkey'],
    data: function() {
        return {
            submenuVisible: false,
            id: 'id-' + this.$uuid.v4(),
            contextMenuParent: null,
        }
    },
    computed: {
        hasSubmenu() {
            return !!this.$scopedSlots.submenu
        },
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
        showSubmenu() {
            this.submenuVisible = true
            const el = this.$refs.contextMenuItem
            el.focus()
            el.closest('.context-menu').classList.add('submenu-open')
            this.$nextTick(() => {
                const submenu = this.$refs.submenu
                const submenuOffsetRight = submenu.getBoundingClientRect().right
                const windowWidth = window.innerWidth
                const offset = 12
                if (windowWidth - submenuOffsetRight < offset) submenu.classList.add('flip')
                else submenu.classList.remove('flip')
            })
        },
        hideSubmenu() {
            this.submenuVisible = false
            const el = this.$refs.contextMenuItem
            el.blur()
            this.$emit('update:submenuVisible', false)
            el.closest('.context-menu').classList.remove('submenu-open')
        },
        onClick(e) {
            if (this.hasSubmenu) return
            this.onFireAction(e)
        },
        hotkeyHandler(e) {
            if (e.code == this.hotkey || (Array.isArray(this.hotkey) && this.hotkey.includes(e.code))) {
                if (this.hasSubmenu) {
                    if (!this.submenuVisible) {
                        this.showSubmenu()
                    } else {
                        this.hideSubmenu()
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
        onMouseEnter(e) {
            if (!this.hasSubmenu) return
            this.showSubmenu()
        },
        onMouseLeave(e) {
            if (!this.hasSubmenu) return
            this.hideSubmenu()
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
            font-size: 16px;
            i {
                font-size: 9px;
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
    .submenu {
        display: flex;
        position: absolute;
        left: 100%;
        width: 100%;
        background: white;
        border-radius: $borderRadiusModule;
        border: $borderModule;
        box-shadow: $shadowModuleHard;
        flex-direction: column;
        .item-group {
            padding: 8px 0;
        }
        &.flip {
            left: auto;
            right: 100%;
        }
    }
}
</style>
