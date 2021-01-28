<template>
    <div class="item-group">
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
            this.products.map(product => {
                const value = product.extra_data[this.field.name]
                if (!value) return
                const alreadyAdded = !!unique.find(x => x == value)
                if (!alreadyAdded) unique.push(value)
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
