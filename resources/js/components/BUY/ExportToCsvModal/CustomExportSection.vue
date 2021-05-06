<template>
    <div class="custom-export-section">
        <h3>Custom export</h3>

        <div class="form-element">
            <label>Export template</label>
            <BaseDropdownInputField
                type="radio"
                @input="$emit('update:exportTemplate', $event)"
                :value="exportTemplate"
                :options="availableTemplates"
                placeholder="Choose template"
            />
        </div>

        <div class="form-element" v-if="$route.name == 'selection' && exportTemplate">
            <label>Filter variants</label>
            <BaseCheckboxInputField v-model="inVariantsOnly">
                <span>IN-variants only</span>
            </BaseCheckboxInputField>
        </div>

        <div class="csv-headers-section form-section" v-if="exportTemplate">
            <h4>Template headers</h4>
            <div class="flex-list xs flex-v form-element">
                <Draggable v-model="exportTemplate.headers">
                    <div
                        class="header-item flex-list sm"
                        v-for="(header, index) in exportTemplate.headers"
                        :key="index"
                    >
                        <button class="ghost handle" v-tooltip="'Drag to re-position'">
                            <i class="far fa-grip-vertical"></i>
                        </button>
                        <BaseInputField
                            v-if="header.key && editIndex == index"
                            v-model="header.name"
                            inputClass="sm"
                            placeholder="Write custom name"
                            :focusOnMount="true"
                            :selectOnFocus="true"
                            @submit="editIndex = null"
                        />
                        <BaseDropdownInputField
                            v-else
                            type="radio"
                            :value="header"
                            @input="
                                ({ key, name }) => {
                                    header.key = key
                                    header.name = name
                                }
                            "
                            :options="availableCsvHeaders"
                            :cloneOptionOnSubmit="true"
                            placeholder="Choose header"
                            :search="true"
                            inputClass="sm"
                            :actionOnBlur="'Submit'"
                            class="header-dropdown"
                        />
                        <BaseButton
                            buttonClass="invisible ghost-hover"
                            v-tooltip="'Edit column header displayed in CSV'"
                            @click="editIndex = index"
                            :disabled="!header.key"
                            disabledTooltip="You must first choose a header from the list."
                        >
                            <i class="far fa-pen"></i>
                        </BaseButton>
                        <button class="invisible ghost-hover" @click="onRemoveHeader(index)">
                            <i class="far fa-trash"></i>
                        </button>
                    </div>
                </Draggable>
                <button style="margin-top: 8px" class="header-item primary ghost" @click="onAddHeader">
                    <i class="far fa-plus"></i><span>Add header</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
export default {
    name: 'customExportSection',
    components: {
        Draggable,
    },
    props: ['exportTemplate'],
    data: function() {
        return {
            editIndex: null,
            availableTemplates: [
                {
                    name: 'Custom',
                    rowKeys: [
                        {
                            key: 'variants',
                            children: [],
                            rowFilters: [],
                        },
                    ],
                    headers: [],
                },
                {
                    name: 'Assortment Export',
                    rowKeys: [
                        {
                            key: 'variants',
                            rowFilters: [],
                            children: [
                                {
                                    key: 'assortments',
                                    rowFilters: [],
                                    children: [{ key: 'quantityInputs' }],
                                },
                            ],
                        },
                    ],
                    headers: [
                        { name: 'Brand', key: 'brand' },
                        { name: 'Season', key: 'extra_data.season' },
                        { name: 'Style Number', key: 'datasource_id' },
                        { name: 'Style Name', key: 'name' },
                        { name: 'Color Name', key: 'variants.color' },
                        { name: 'Color Code', key: 'variants.variant' },
                        { name: 'Labels', key: 'variants.labels' },
                        { name: 'Comments', key: 'comments.content' },
                        { name: 'Variant Name', key: 'variants.name' },
                        { name: 'Assortment', key: 'variants.assortments.quantityInputs.assortment' },
                        { name: 'Assortment Delivery', key: 'variants.assortments.quantityInputs.delivery_date' },
                        {
                            name: 'Assortment Quantity',
                            key: 'variants.assortments.quantityInputs.quantity',
                            filters: [{ values: ['', 0], type: 'exclude' }],
                        },
                        { name: 'Variant Total', key: 'variants.quantity' },
                    ],
                },
                {
                    name: 'Delivery Export',
                    rowKeys: [
                        {
                            key: 'variants',
                            rowFilters: [],
                            children: [
                                {
                                    key: 'deliveries',
                                    rowFilters: [],
                                    children: [{ key: 'quantityInputs' }],
                                },
                            ],
                        },
                    ],
                    headers: [
                        { name: 'Brand', key: 'brand' },
                        { name: 'Season', key: 'extra_data.season' },
                        { name: 'Style Number', key: 'datasource_id' },
                        { name: 'Style Name', key: 'name' },
                        { name: 'Color Name', key: 'variants.color' },
                        { name: 'Color Code', key: 'variants.variant' },
                        { name: 'Labels', key: 'variants.labels' },
                        { name: 'Comments', key: 'comments.content' },
                        { name: 'Variant Name', key: 'variants.name' },
                        { name: 'Delivery', key: 'variants.deliveries.delivery_date' },
                        { name: 'Delivery Total', key: 'variants.deliveries.quantity' },
                        { name: 'Size', key: 'variants.deliveries.quantityInputs.variant_size' },
                        {
                            name: 'Size Quantity',
                            key: 'variants.deliveries.quantityInputs.quantity',
                            filters: [{ values: ['', 0], type: 'exclude' }],
                        },
                        { name: 'Variant Total', key: 'variants.quantity' },
                    ],
                },
            ],
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            customFields: 'getCustomProductFields',
        }),
        inVariantsOnly: {
            get() {
                return (
                    !!this.exportTemplate.rowKeys &&
                    this.exportTemplate.rowKeys.find(
                        rowKey =>
                            rowKey.key == 'Variants' &&
                            rowKey.filters.find(filter => filter.key == 'YourAction' && filter.values.includes('In'))
                    )
                )
                // rowFilters: [{ key: 'yourAction', values: ['In', 'Focus'], type: 'include' }]
            },
            set(shouldBeAdded) {
                const filterObj = { key: 'yourAction', values: ['In', 'Focus'], type: 'include' }
                const keyObj = { key: 'variants', rowFilters: [filterObj] }
                const templateRowKeys = this.exportTemplate.rowKeys
                if (shouldBeAdded) {
                    if (!templateRowKeys || templateRowKeys.length <= 0) {
                        Vue.set(this.exportTemplate, 'rowKeys', [keyObj])
                        return
                    }
                    const variantKey = templateRowKeys.find(rowKey => rowKey.key == 'variants')
                    if (!variantKey) {
                        templateRowKeys.push(keyObj)
                        return
                    } else {
                        if (!variantKey.rowFilters || variantKey.rowFilters.length <= 0) {
                            Vue.set(variantKey, 'rowFilters', [filterObj])
                        } else {
                            variantKey.rowFilters.push(filterObj)
                        }
                    }
                } else {
                    const variantKey = templateRowKeys.find(rowKey => rowKey.key == 'variants')
                    variantKey.rowFilters = variantKey.rowFilters.filter(
                        filter => !(filter.key == 'YourAction' && filter.values.includes('In'))
                    )
                }
            },
        },
        availableCsvHeaders() {
            const baseHeaders = [
                { name: 'ID', key: 'datasource_id' },
                { name: 'Name', key: 'title' },
                { name: 'Category', key: 'category' },
                { name: 'Brand', key: 'brand' },
                { name: 'Buying Gruop', key: 'buying_group' },
                { name: 'Composition', key: 'composition' },
                { name: 'Description', key: 'sale_description' },
                { name: 'Product Minimum', key: 'min_order' },
                { name: 'Variant Minimum', key: 'min_variant_order' },
                { name: 'Deliveries', key: 'delivery_dates' },
                { name: 'Currency', key: 'prices.currency' },
                { name: 'WHS', key: 'prices.wholesale_price' },
                { name: 'RRP', key: 'prices.recommended_retail_price' },
                { name: 'MU', key: 'prices.mark_up' },
                { name: 'EANs', key: 'eans' },
                { name: 'Variant Color', key: 'variants.color' },
                { name: 'Variant Variant', key: 'variants.variant' },
                { name: 'Variant Sizes', key: 'variants.sizes' },
                { name: 'Variant EAN', key: 'variants.eans' },
                { name: 'Image URL', key: 'image_url' },
                { name: 'Assortment Name', key: 'assortments.name' },
                { name: 'Labels', key: 'labels' },
            ]

            const customHeaders = this.customFields
                ? this.customFields.map(field => {
                      return {
                          name: field.display_name,
                          key:
                              field.belong_to == 'Variant'
                                  ? `variants.extra_data.${field.name}`
                                  : `extra_data.${field.name}`,
                      }
                  })
                : []
            return baseHeaders.concat(customHeaders)
        },
    },
    methods: {
        onAddHeader() {
            this.exportTemplate.headers.push({
                key: null,
                name: null,
            })
        },
        onRemoveHeader(index) {
            this.exportTemplate.headers.splice(index, 1)
        },
    },
    created() {
        // Preset the selected template to the first
        if (!this.exportTemplate) {
            this.$emit('update:exportTemplate', this.availableTemplates[0])
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.header-item {
    padding: 8px;
    transition: 0.1s ease-out;
    border: solid 1px transparent;
    &:hover {
        border: $borderEl;
        border-radius: $borderRadiusEl;
        background: white;
        box-shadow: $shadowEl;
    }
    .header-dropdown,
    .input-field {
        flex: 1;
    }
    .handle {
        cursor: grab;
    }
}
</style>
