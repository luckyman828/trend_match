<template>
    <div class="item-group" v-if="availableCustomFieldValues.length > 0">
        <v-popover trigger="click" :disabled="availableCustomFieldValues.length <= 0" placement="right">
            <BaseContextMenuItem
                iconClass="far fa-magic"
                :disabled="availableCustomFieldValues.length <= 0"
                disabledTooltip="No options available"
                @click="showAdvancedFilters = false"
            >
                <span>{{ field.display_name }}</span>
                <span v-if="filterCustomFieldValues.length > 0" class="filter-counter circle primary xs">
                    <span>{{ filterCustomFieldValues.length }}</span>
                </span>
            </BaseContextMenuItem>
            <template slot="popover">
                <BaseSelectButtons
                    submitOnChange="true"
                    :options="availableCustomFieldValues"
                    v-model="filterCustomFieldValues"
                />
            </template>
        </v-popover>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'customProductDataFilter',
    props: ['field'],
    computed: {
        ...mapGetters('products', {
            products: 'products',
        }),
        ...mapGetters('productFilters', {
            getFilterCustomFieldValues: 'getFilterCustomFieldValues',
        }),
        filterCustomFieldValues: {
            get() {
                return this.getFilterCustomFieldValues(this.field.name)
            },
            set(value) {
                this.onSetSelected(value)
            },
        },
        availableCustomFieldValues() {
            const unique = []
            const getUniqueValue = sourceObject => {
                const value = sourceObject.extra_data[this.field.name]
                if (!value) return
                if (Array.isArray(value)) {
                    value.map(arrayValue => {
                        const alreadyAdded = !!unique.find(x => x == arrayValue)
                        if (!alreadyAdded) unique.push(arrayValue)
                    })
                } else {
                    const alreadyAdded = !!unique.find(x => x == value)
                    if (!alreadyAdded) unique.push(value)
                }
            }

            this.products.map(product => {
                if (this.field.belong_to != 'Variant') {
                    getUniqueValue(product)
                } else {
                    product.variants.map(variant => {
                        getUniqueValue(variant)
                    })
                }
            })
            return unique
        },
    },
    methods: {
        ...mapMutations('productFilters', ['SET_FILTER_CUSTOM_FIELD_VALUES']),
        onSetSelected(value) {
            this.SET_FILTER_CUSTOM_FIELD_VALUES({ field: this.field.name, value })
        },
    },
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
