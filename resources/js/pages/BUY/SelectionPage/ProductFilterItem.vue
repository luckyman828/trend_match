<template>
    <v-popover trigger="click" :disabled="filter.options.length <= 0" placement="right">
        <BaseContextMenuItem
            class="product-filter-item"
            :iconClass="filter.icon"
            :disabled="filter.options.length <= 0"
            disabledTooltip="No options available"
        >
            <span>{{ filter.displayName }}</span>
            <span v-if="filter.selected.length > 0" class="filter-counter circle primary xs">
                <span>{{ filter.selected.length }}</span>
            </span>
        </BaseContextMenuItem>
        <template slot="popover">
            <BaseSelectButtons
                :header="filter.displayName"
                style="width: 200px; padding-top: 8px;"
                submitOnChange="true"
                :options="filter.options"
                :optionNameKey="filter.optionNameKey"
                :optionValueKey="filter.optionValueKey"
                v-model="filter.selected"
            />
        </template>
    </v-popover>
</template>

<script>
export default {
    name: 'productFilterItem',
    props: ['filter'],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.filter-counter {
    margin-left: auto;
}
button.trigger {
    position: relative;
    .circle {
        margin-top: -24px;
        margin-right: -12px;
        margin-left: 4px;
        z-index: 1;
    }
}
</style>
