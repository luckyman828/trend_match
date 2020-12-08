<template>
    <div class="item-group">
        <v-popover trigger="click" :disabled="availableCustomFieldValues.length <= 0" placement="right">
            <BaseContextMenuItem
                iconClass="far fa-magic"
                :disabled="availableCustomFieldValues.length <= 0"
                disabledTooltip="No buyer groups available"
                @click="showAdvancedFilters = false"
            >
                <span>{{ field }}</span>
                <span v-if="selectedCustomFieldValues.length > 0" class="filter-counter circle primary xs">
                    <span>{{ selectedCustomFieldValues.length }}</span>
                </span>
            </BaseContextMenuItem>
            <template slot="popover">
                <BaseSelectButtons
                    submitOnChange="true"
                    :options="availableCustomFieldValues"
                    v-model="selectedCustomFieldValues"
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
            getSelectedCustomFieldValues: 'getSelectedCustomFieldValues',
        }),
        selectedCustomFieldValues: {
            get() {
                return this.getSelectedCustomFieldValues(this.field)
            },
            set(value) {
                this.onSetSelected(value)
            },
        },
        availableCustomFieldValues() {
            const unique = []
            this.products.map(product => {
                const value = product.extra_data[this.field]
                if (!value) return
                const alreadyAdded = !!unique.find(x => x == value)
                if (!alreadyAdded) unique.push(value)
            })
            return unique
        },
    },
    methods: {
        ...mapMutations('products', ['SET_SELECTED_CUSTOM_FIELD_VALUES']),
        onSetSelected(value) {
            this.SET_SELECTED_CUSTOM_FIELD_VALUES({ field: this.field, value })
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
