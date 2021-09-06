<template>
    <tr
        class="table-row"
        :class="[{ active: contextMenuIsActive }, { self: isSelf }, { 'has-focus': hasFocus }]"
        :key="itemKey ? item[itemKey] : index"
        :style="rowHeight"
        @click.ctrl.exact.capture.stop.prevent="$refs.selectBox.check()"
        @click.ctrl.shift.capture.stop.prevent="onCtrlShiftClick"
        @contextmenu.prevent="$emit('show-contextmenu', $event)"
        :data-item-name="item && (item.name ? item.name : item.title ? item.title : null)"
    >
        <td class="select" v-if="showSelect">
            <BaseCheckbox
                ref="selectBox"
                :value="item"
                :modelValue="selected"
                @change="$emit('update:selected', $event)"
                @checkRange="$emit('select-range')"
            />
        </td>
        <slot />
        <td class="context-button" v-if="showContextButton">
            <button
                :class="contextButtonClass ? contextButtonClass : 'no-bg ghost-hover'"
                @click.stop="$emit('show-contextmenu', $event)"
            >
                <i class="far fa-ellipsis-h medium"></i>
            </button>
        </td>
    </tr>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'baseTableRow',
    props: [
        'selected',
        'tableContentList',
        'showSelect',
        'item',
        'contextItem',
        'itemKey',
        'index',
        'showContextButton',
        'itemType',
        'itemSize',
        'hasFocus',
        'contextButtonClass',
    ],
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('contextMenu', {
            contextMenuVisible: 'getContextMenuIsVisible',
        }),
        contextMenuIsActive() {
            if (!this.contextMenuVisible) return false
            if (this.selected && this.selected.length > 0) {
                return this.selected.find(x => x[this.itemKey] == this.item[this.itemKey])
            } else if (!!this.contextItem) {
                return this.contextItem[this.itemKey] == this.item[this.itemKey]
            }
        },
        isSelf() {
            return this.itemType == 'user' && this.authUser.id == this.item.id
        },
        rowHeight() {
            return this.itemSize ? { height: `${this.itemSize}px` } : null
        },
    },
    methods: {
        onCtrlShiftClick() {
            this.$emit('select-range')
            document.getSelection().empty()
        },
    },
}
</script>

<style lang="scss">
tr {
    &.self {
        .title {
            font-weight: 500;
            i {
                color: $primary;
            }
        }
    }
    &.has-focus {
        outline: solid 2px #2a46ff;
        outline-offset: -2px;
    }
}
</style>
