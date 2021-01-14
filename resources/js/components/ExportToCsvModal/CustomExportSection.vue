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

        <div class="csv-headers-section form-section" v-if="exportTemplate">
            <h4>Template headers</h4>
            <button class="primary ghost form-element" @click="onAddHeader">
                <i class="far fa-plus"></i><span>Add header</span>
            </button>
            <Draggable class="flex-list xs flex-v form-element" v-model="exportTemplate.headers">
                <div class="header-item flex-list sm" v-for="(header, index) in exportTemplate.headers" :key="index">
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
            <button class="primary ghost" @click="onAddHeader" v-if="exportTemplate.headers.length > 0">
                <i class="far fa-plus"></i><span>Add header</span>
            </button>
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
                    rowScope: 'Variant',
                    headers: [],
                },
                {
                    name: 'Gross list',
                    rowScope: 'Variant',
                    headers: [
                        { name: 'EAN_NO', key: 'variant.ean' },
                        { name: 'STYLE_NUMBER', key: 'datasource_id' },
                        { name: 'STYLE_NAME', key: 'title' },
                        { name: 'COLLECTION_NAME', key: 'extra_data.COLLECTION_NAME' },
                        { name: 'CATEGORY', key: 'category' },
                        { name: 'STYLE_VARIANT_NAME', key: 'variant.variant' },
                        { name: 'COLOUR_NAME', key: 'variant.color' },
                        { name: 'SAMPLE_LOCATION_NAME', key: 'extra_data.SAMPLE_LOCATION_NAME' },
                        { name: 'DESCRIPTION', key: 'sale_description' },
                        { name: 'BRAND_NAME', key: 'brand' },
                        { name: 'COUNTRY_OF_ORIGIN', key: 'extra_data.COUNTRY_OF_ORIGIN' },
                        { name: 'QUANTITY', key: 'extra_data.QUANTITY' },
                    ],
                },
                {
                    name: 'Full export',
                    rowScope: 'Variant',
                    headers: [
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
                        { name: 'Currency', key: 'price.currency' },
                        { name: 'WHS', key: 'price.wholesale_price' },
                        { name: 'RRP', key: 'price.recommended_retail_price' },
                        { name: 'MU', key: 'price.mark_up' },
                        { name: 'EANs', key: 'eans' },
                        { name: 'Variant Color', key: 'variant.color' },
                        { name: 'Variant Variant', key: 'variant.variant' },
                        { name: 'Variant Sizes', key: 'variant.sizes' },
                        { name: 'Variant EAN', key: 'variant.eans' },
                        { name: 'Image URL', key: 'image_url' },
                        { name: 'Assortment Name', key: 'assortments.name' },
                        // { name: 'Assortment EAN', key: 'assortments.ean' },
                        // { name: 'Assortment Size', key: 'assortments.size' },
                    ],
                },
            ],
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            customFields: 'getCustomProductFields',
        }),
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
                { name: 'Currency', key: 'price.currency' },
                { name: 'WHS', key: 'price.wholesale_price' },
                { name: 'RRP', key: 'price.recommended_retail_price' },
                { name: 'MU', key: 'price.mark_up' },
                { name: 'EANs', key: 'eans' },
                { name: 'Variant Color', key: 'variant.color' },
                { name: 'Variant Variant', key: 'variant.variant' },
                { name: 'Variant Sizes', key: 'variant.sizes' },
                { name: 'Variant EAN', key: 'variant.eans' },
                { name: 'Image URL', key: 'image_url' },
                { name: 'Assortment Name', key: 'assortments.name' },
            ]

            const customHeaders = this.customFields
                ? this.customFields.map(field => {
                      return {
                          name: field.display_name,
                          key: field.belong_to == 'Variant' ? `variant.extra_data.${field}` : `extra_data.${field}`,
                      }
                  })
                : []
            return baseHeaders.concat(customHeaders)
        },
    },
    // watch: {
    //     exportTemplate(newTemplate) {
    //         this.selectedHeaders
    //     }
    // },
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
