<template>
    <div class="conditional-filters">
        <div class="overlay" v-close-popover></div>
        <h3>Advanced filters</h3>

        <template></template>
        <div class="key-filter" v-for="(keyFilter, index) in keyFilters.filter(x => x.type == 'key')" :key="'key-'+index">

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
                    :options="availableOperators" optionNameKey="name" optionValueKey="value"
                    v-model="keyFilter.operator"/>
                </template>
            </v-popover>

            <BaseInputField class="value-input" inputClass="small"
            v-model.number="keyFilter.value" type="number"/>

            <button class="ghost remove"
            @click="onRemoveFilter(index)">
                <i class="far fa-trash"></i>
            </button>
        </div>

        <template v-if="!!keyFilters.find(x => x.type == 'user')">
            <h3>User feedback filters</h3>
            <div class="user-filter key-filter" v-for="(userFilter, index) in keyFilters.filter(x => x.type == 'user')" :key="'user-'+index">

                <v-popover trigger="click">
                    <BaseInputField class="select-key" disabled=true 
                    :value="userFilter.user.name" type="select" inputClass="small"/>
                    <template slot="popover">
                        <BaseSelectButtons style="width: 200px; padding-top: 8px;" v-close-popover
                        type="radio" :submitOnChange="true" optionNameKey="name" optionDescriptionKey="selectionName"
                        :options="availableFeedbackUsers" v-model="userFilter.user"/>
                    </template>
                </v-popover>

                <v-popover trigger="click">
                    <BaseInputField class="select-operator" disabled=true 
                    :value="userFilter.operator" type="select" inputClass="small"/>
                    <template slot="popover">
                        <BaseSelectButtons style="width: 200px; padding-top: 8px;" v-close-popover
                        type="radio" :submitOnChange="true" optionNameKey="name" optionValueKey="value"
                        :options="availableUserOperators" v-model="userFilter.operator"/>
                    </template>
                </v-popover>

                <v-popover trigger="click">
                    <BaseInputField class="select-action-type" disabled=true 
                    :value="userFilter.actionType" type="select" inputClass="small"/>
                    <template slot="popover">
                        <BaseSelectButtons style="width: 200px; padding-top: 8px;" v-close-popover
                        type="radio" :submitOnChange="true" 
                        :options="availableActionTypes" v-model="userFilter.actionType"/>
                    </template>
                </v-popover>

                <button class="ghost remove"
                @click="onRemoveFilter(index)">
                    <i class="far fa-trash"></i>
                </button>
            </div>
        </template>



        <div class="action-list">
            <button class="ghost"
            @click="onAddFilter">
                <i class="fas fa-plus"></i>
                <span>Add filter</span>
            </button>

            <button class="ghost"
            @click="onAddUserFilter">
                <i class="fas fa-plus"></i>
                <span>Add user filter</span>
            </button>
        </div>

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
            type: 'key',
            key: {
                name: 'Choose key'
            },
            operator: '>',
            value: 0,
        },
        defaultUserFilterObject: {
            type: 'user',
            actionType: 'In',
            operator: '=',
            user: {name: 'Choose user'},
        },
        availableOperators: [
            {name: '> Greater than', value: '>'}, {name: '< Less than', value: '<'}, {name: '= Equal to', value: '='}, {name: '!= Not equal to', value: '!='}
        ],
        availableUserOperators: [
            {name: '= Equal to', value: '='}, {name: '!= Not equal to', value: '!='}
        ],
        availableActionTypes: ['In', 'Out', 'Focus', 'None'],
        keyFilters: [],
        contextKeyFilter: [],
    }},
    computed: {
        ...mapGetters('products', {
            products: 'products',
            getActiveSelectionInput: 'getActiveSelectionInput'
        }),
        availableFeedbackUsers() {
            // Every product should include every feedback user, so we should be able to simple do this:
            const selectionInput = this.getActiveSelectionInput(this.products[0])
            return selectionInput.feedbacks.map(feedback => {
                return {
                    name: feedback.user ? feedback.user.name : 'Anonymous',
                    user_id: feedback.user_id,
                    selection: feedback.selection,
                    selection_id: feedback.selection_id,
                    selectionName: feedback.selection.name
                }
            })
        },
        productsFiltered() {
            return this.products.filter(product => {
                let include = true
                this.keyFilters.forEach(filter => {

                    // FILTER BY USER FEEDBACK
                    if (filter.type == 'user') {
                        if (!filter.user.user_id) return
                        const operator = filter.operator
                        const userId = filter.user.user_id
                        const selectionId = filter.user.selection_id
                        const selectionInput = this.getActiveSelectionInput(product)
                        const userFeedback = selectionInput.feedbacks.find(feedback => feedback.user_id == userId && feedback.selection_id == selectionId)
                        if (operator == '=' && (!userFeedback || userFeedback.action != filter.actionType)) include = false
                        if (operator == '!=' && (!!userFeedback && userFeedback.action == filter.actionType)) include = false
                    }

                    // FILTER BY KEY
                    else {
                        if (filter.key.value == null) return
                        let filterKey = filter.key.value
                        if (this.distributionScope == 'Alignment' && filterKey == 'ins') filterKey = 'alignmentIns'
                        if (this.distributionScope == 'Alignment' && filterKey == 'outs') filterKey = 'alignmentOuts'
                        if (this.distributionScope == 'Alignment' && filterKey == 'focus') filterKey = 'alignmentFocus'
                        if (this.distributionScope == 'Alignment' && filterKey == 'nds') filterKey = 'alignmentNds'
                        const keyValue = Array.isArray(product[filterKey]) ? product[filterKey].length : product[filterKey]
                        const operator = filter.operator
                        const value = filter.value
                        if (operator == '>' && keyValue <= value) include = false
                        if (operator == '>=' && keyValue < value) include = false
                        if (operator == '=' && keyValue != value) include = false
                        if (operator == '!=' && keyValue == value) include = false
                        if (operator == '<=' && keyValue > value) include = false
                        if (operator == '<' && keyValue >= value) include = false
                    }
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
        onAddUserFilter() {
            this.keyFilters.push(JSON.parse(JSON.stringify(this.defaultUserFilterObject)))
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
            this.SET_ADVANCED_FILTER(JSON.parse(JSON.stringify(this.keyFilters)))
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
    width: 298px;
    .overlay {
        display: block;
        height: 200vh;
        width: 200vw;
        top: -100vh;
        left: -100vw;
        z-index: -1;
        background: none;
    }
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
        .select-action-type {
            // max-width: 72px;
            max-width: 100px;
            // ::v-deep {
            //     .input-wrapper {
            //         padding-left: 6px;
            //         padding-right: 6px;
            //     }
            // }
        }
        > *:not(:first-child) {
            margin-left: 4px;
        }
    }
    h3:not(:first-child) {
        margin-top: 20px;
    }
    .action-list {
        margin-top: 20px;
    }
    .submit {
        margin-top: 12px;
    }
}
</style>