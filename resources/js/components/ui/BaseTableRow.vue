<template>
    <tr class="table-row" :class="{active: contextMenuIsActive}"
    @contextmenu.prevent="$emit('showContextMenu', $event, item)">
        <td class="select" v-if="showSelect">
            <BaseCheckbox ref="selectBox" :value="item" :modelValue="selected" 
            @change="$emit('update:selected', $event)"
            @checkRange="$emit('select-range')"
            />
        </td>
        <slot/>
    </tr>
</template>

<script>
export default {
    name: 'baseTableRow',
    props: [
        'selected',
        'tableContentList',
        'showSelect',
        'item',
        'contextMenuIsActive',
    ]
}
</script>

<style>

</style>