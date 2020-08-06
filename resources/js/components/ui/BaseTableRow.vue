<template>
    <tr class="table-row" :class="[{active: contextMenuIsActive}, {'self': isSelf}]"
    :key="itemKey ? item[itemKey] : index"
    @click.ctrl.exact.capture.stop.prevent="$refs.selectBox.check()"
    @click.ctrl.shift.capture.stop.prevent="onCtrlShiftClick"
    @contextmenu.prevent="$emit('show-contextmenu', $event)">
        <td class="select" v-if="showSelect">
            <BaseCheckbox ref="selectBox" :value="item" :modelValue="selected" 
            @change="$emit('update:selected', $event)"
            @checkRange="$emit('select-range')"
            />
        </td>
        <slot/>
        <td class="context-button" v-if="showContextButton">
            <button class="invisible ghost-hover" 
            @click.stop="$emit('show-contextmenu', $event)">
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
    ],
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('contextMenu', {
            contextMenuVisible: 'getContextMenuIsVisible'
        }),
        contextMenuIsActive() {
            if (!this.contextMenuVisible) return false
            if (this.selected && this.selected.length > 0) {
                return this.selected.find(x => x[this.itemKey] == this.item[this.itemKey])
            } else {
                return this.contextItem[this.itemKey] == this.item[this.itemKey]
            }
        },
        isSelf() {
            return this.itemType == 'user' && this.authUser.id == this.item.id
        },
    },
    methods: {
        onCtrlShiftClick() {
            this.$emit('select-range')
            document.getSelection().empty()
        }
    }
}
</script>

<style lang="scss">
@import '~@/_variables.scss';

tr {
    &.self {
        .title {
            font-weight: 500;
            i {
                color: $primary;
            }
        }
    }
}

</style>