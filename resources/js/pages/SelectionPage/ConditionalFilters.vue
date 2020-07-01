<template>
    <div class="conditional-filters">
        <h3>Advanced filters</h3>

        <div class="key-filter" v-for="(keyFilter, index) in keyFilters" :key="index">
            <!-- <BaseInputField class="select-key" disabled=true inputClass="small"
            :value="keyFilter.key.name" type="select" 
            @click="showKeyContext($event, keyFilter)"/> -->

            <v-popover trigger="click">
                <BaseInputField class="select-key" disabled=true 
                :value="keyFilter.key.name" type="select" inputClass="small"/>
                <template slot="popover">
                    <BaseSelectButtons style="width: 200px; padding-top: 8px;" v-close-popover
                    type="radio" :submitOnChange="true" optionNameKey="name"
                    :options="availableKeys" v-model="keyFilter.key"/>
                </template>
            </v-popover>

            <v-popover trigger="click">
                <BaseInputField class="select-operator" disabled=true 
                :value="keyFilter.operator" type="select" inputClass="small"/>
                <template slot="popover">
                    <BaseSelectButtons style="width: 200px; padding-top: 8px;" v-close-popover
                    type="radio" :submitOnChange="true" 
                    :options="availableOperators" v-model="keyFilter.operator"/>
                </template>
            </v-popover>

            <BaseInputField class="value-input" inputClass="small"
            v-model.number="keyFilter.value" type="number"/>

            <button class="ghost remove"
            @click="onRemoveFilter(index)">
                <i class="far fa-trash"></i>
            </button>
        </div>

        <button class="ghost"
        @click="onAddFilter">
            <i class="fas fa-plus"></i>
            <span>Add filter</span>
        </button>

        <button class="primary full-width submit"
        @click="onSubmit" v-close-popover>
            <span>Apply filter ({{productsFiltered.length}} products)</span>
        </button>

        <!-- <BaseSelectButtonsContextMenu
            ref="selectKeyContext"
            header="Choose key"
            :submitOnChange="true" 
            type="radio"
            :options="availableKeys"
            optionNameKey="name"
            v-model="contextKeyFilter.key"
        /> -->
        <!-- <BaseSelectButtonsContextMenu
            ref="selectOperatorContext"
            header="Choose operator"
            :submitOnChange="true" 
            type="radio"
            :options="availableOperators"
            v-model="contextKeyFilter.operator"
        /> -->

    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'conditionalFilters',
    props: [
        'distributionScope'
    ],
    data: function() { return {
        availableKeys: [
            {
                name: 'Order minimum',
                value: 'min_order'
            },
            {
                name: 'Variant minimum',
                value: 'min_variant_order'
            },
            {
                name: 'Recommended retail price',
                value: 'recommended_retail_price'
            },
            {
                name: 'Wholesale price',
                value: 'wholesale_price'
            },
            {
                name: 'Mark up',
                value: 'mark_up'
            },
            {
                name: 'Num. Requests',
                value: 'requests'
            },
            {
                name: 'Num. Comments',
                value: 'comments'
            },
            {
                name: 'Num. In',
                value: 'ins'
            },
            {
                name: 'Num. Out',
                value: 'outs'
            },
            {
                name: 'Num. Focus',
                value: 'focus'
            },
            {
                name: 'Num. Not decided',
                value: 'nds'
            },
        ],
        defaultKeyFilterObject: {
            key: {
                name: 'Choose key'
            },
            operator: '>',
            value: 0,
        },
        availableOperators: ['>', '<', '=', '<=', '>='],
        keyFilters: [],
        contextKeyFilter: [],
    }},
    computed: {
        ...mapGetters('products', {
            products: 'products'
        }),
        productsFiltered() {
            return this.products.filter(product => {
                let include = true
                this.keyFilters.forEach(filter => {
                    const filterKey = filter.key.value
                    const keyValue = Array.isArray(product[filterKey]) ? product[filterKey].length : product[filterKey]
                    const operator = filter.operator
                    const value = filter.value
                    if (operator == '>' && keyValue <= value) include = false
                    if (operator == '>=' && keyValue < value) include = false
                    if (operator == '=' && keyValue != value) include = false
                    if (operator == '<=' && keyValue > value) include = false
                    if (operator == '<' && keyValue >= value) include = false
                })
                return include
            })
        },
    },
    methods: {
        ...mapMutations('products', ['SET_ADVANCED_FILTER']),
        onAddFilter() {
            this.keyFilters.push(JSON.parse(JSON.stringify(this.defaultKeyFilterObject)))
        },
        onRemoveFilter(index) {
            this.keyFilters.splice(index, 1)
        },
        showKeyContext(e, keyFilter) {
            this.contextKeyFilter = keyFilter
            this.$nextTick(() => {
                this.$refs.selectKeyContext.show(e)
            })
        },
        showOperatorContext(e, keyFilter) {
            this.contextKeyFilter = keyFilter
            this.$nextTick(() => {
                this.$refs.selectOperatorContext.show(e)
            })
        },
        onSubmit() {
            this.SET_ADVANCED_FILTER(this.keyFilters)
        }
    },
    created() {
        this.onAddFilter()
    }
}
</script>

<style lang="scss" scoped>
.conditional-filters {
    padding: 16px;
    .key-filter {
        display: flex;
        margin-bottom: 8px;
        .value-input {
            max-width: 100px;
        }
        .select-operator {
            max-width: 48px;
            ::v-deep {
                .input-wrapper {
                    padding-left: 0;
                    padding-right: 0;
                    input {
                        text-align: center;
                        font-weight: 700;
                    }
                }
            }
        }
        > *:not(:first-child) {
            margin-left: 4px;
        }
    }
    .submit {
        margin-top: 12px;
    }
}
</style>