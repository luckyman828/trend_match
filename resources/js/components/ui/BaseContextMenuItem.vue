<template>
    <div class="item context-menu-item" ref="contextMenuItem" :id="id"
    :class="disabled && 'disabled no-close'" tabindex="0"
    v-tooltip="{content: disabled && disabledTooltip, container: `#${id}`}"
    @click="onClick"
    @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">

        <!-- Item content -->
        <div class="item-content">
            <div class="icon-wrapper"><i :class="iconClass"></i></div>
            <slot/>
        </div>

        <!-- Submenu -->
        <div class="submenu" v-if="submenuVisible">
            <slot name="submenu"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseContextMenuItem',
    props: [
        'iconClass',
        'disabled',
        'disabledTooltip',
        'hotkey',
    ],
    data: function() { return {
        submenuVisible: false,
        id: 'id-'+this.$uuid.v4(),
        contextMenuParent: null
    }},
    computed: {
        hasSubmenu() {
            return !!this.$scopedSlots.submenu
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
        onFireAction(e) {
            if (this.disabled) return
            this.$emit('click', e)
            this.$emit('action', e)
            this.closeContextMenu()
        },
        closeContextMenu() {
            const contextMenu = this.contextMenuParent.hide()
        },
        showSubmenu() {
            this.submenuVisible = true
            const el = this.$refs.contextMenuItem
            el.focus()
            el.closest('.context-menu').classList.add('submenu-open')
        },
        hideSubmenu() {
            this.submenuVisible = false
            const el = this.$refs.contextMenuItem
            el.blur()
            this.$emit('update:submenuVisible', false)
            el.closest('.context-menu').classList.remove('submenu-open')
        },
        onClick() {
            if (this.hasSubmenu) return
            this.onFireAction()
        },
        hotkeyHandler(e) {
            if (e.code == this.hotkey) {
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
        document.addEventListener('keyup', this.hotkeyHandler)
        this.findParentContextMenu(this)
    },
    destroyed() {
        document.removeEventListener('keyup', this.hotkeyHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.item {
    padding: 8px 16px;
    color: $dark05;
    display: flex;
    align-items: center;
    .item-content {
        display: flex;
        align-items: center;
    }
    &:not(.item-wrapper) {
        cursor: pointer;
        &:hover, &:focus {
            background: $light1;
            outline: none;
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
    &.disabled {
        cursor: default;
        pointer-events: all;
        .item-content {
            opacity: .7;
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
    }
}
</style>