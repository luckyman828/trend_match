<template>
    <tr class="base-table-v2-row">
        <td class="select" v-if="selectedItems">
            <BaseCheckbox
                ref="selectBox"
                :value="item"
                :modelValue="selectedItems"
                @change="$emit('update:selectedItems', $event)"
                @checkRange="$emit('select-range')"
            />
        </td>
        <slot />
    </tr>
</template>

<script>
export default {
    name: 'baseTableV2Row',
    props: ['selectedItems', 'item'],
}
</script>

<style lang="scss" scoped></style>
