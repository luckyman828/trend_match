<template>
    <div class="conditional-filters">
        <div class="overlay" v-close-popover></div>
        <h3>Advanced filters</h3>

        <template></template>
        <div class="key-filter" v-for="(keyFilter, index) in keyFilters.filter(x => x.type == 'key')" :key="'key-'+index">

            <v-popover trigger="click"
                placement="left"
                offset="0, -60px"
            >
                <BaseInputField class="select-key" disabled=true 
                :value="keyFilter.key.name" type="select" inputClass="small"/>
                <template slot="popover">
                    <BaseSelectButtons style="width: 200px; padding-top: 8px;" v-close-popover
                    type="radio" :submitOnChange="true" optionNameKey="name"
                    :options="availableKeys" v-model="keyFilter.key"/>
                </template>
            </v-popover>

            <v-popover trigger="click"
                placement="left"
                offset="0, -20px"
            >
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
            @click="onRemoveFilter(index, 'key')">
                <i class="far fa-trash"></i>
            </button>
        </div>

        <button class="ghost"
        @click="onAddFilter">
            <i class="fas fa-plus"></i>
            <span>Add filter</span>
        </button>

        <h3>User / Selection filters</h3>
        <div class="user-filter key-filter" v-for="(authorFilter, index) in keyFilters.filter(x => x.type == 'author')" :key="'author-'+index">

            <v-popover trigger="click" 
                placement="left"
                offset="0, -60px"
            >
                <BaseInputField class="select-key" disabled=true
                :value="authorFilter.filter.name" type="select" inputClass="small"/>
                <template slot="popover">
                    <BaseSelectButtons style="width: 200px; padding-top: 8px;" v-close-popover
                    :multipleOptionArrays="true"
                    type="radio" 
                    :submitOnChange="true"
                    :options="availableFilters"
                    optionGroupOptionsKey="options"
                    optionGroupNameKey="name"
                    optionNameKey="name"
                    v-model="authorFilter.filter"/>
                </template>
            </v-popover>

            <v-popover trigger="click">
                <BaseInputField class="select-operator" disabled=true 
                :value="authorFilter.operator" type="select" inputClass="small"/>
                <template slot="popover">
                    <BaseSelectButtons style="width: 200px; padding-top: 8px;" v-close-popover
                    type="radio" :submitOnChange="true" optionNameKey="name" optionValueKey="value"
                    :options="availableUserOperators" v-model="authorFilter.operator"/>
                </template>
            </v-popover>

            <v-popover trigger="click">
                <BaseInputField class="select-action-type" disabled=true 
                :value="authorFilter.key" type="select" inputClass="small"/>
                <template slot="popover">
                    <BaseSelectButtons style="width: 200px; padding-top: 8px;" v-close-popover
                    type="radio" :submitOnChange="true" optionNameKey="name" optionValueKey="value"
                    :options="availableActionTypes" v-model="authorFilter.key"/>
                </template>
            </v-popover>

            <button class="ghost remove"
            @click="onRemoveFilter(index, 'author')">
                <i class="far fa-trash"></i>
            </button>
        </div>

        <button class="ghost"
        @click="onAddAuthorFilter">
            <i class="fas fa-plus"></i>
            <span>Add user/selection filter</span>
        </button>

        <button class="primary full-width submit"
        @click="onSubmit" v-close-popover>
            <span>Apply filter ({{productsFiltered.length}} products)</span>
        </button>

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
                value: 'min_order',
                scope: 'product',
            },
            {
                name: 'Variant minimum',
                value: 'min_variant_order',
                scope: 'product',
            },
            {
                name: 'Recommended retail price',
                value: 'recommended_retail_price',
                scope: 'product',
            },
            {
                name: 'Wholesale price',
                value: 'wholesale_price',
                scope: 'product',
            },
            {
                name: 'Mark up',
                value: 'mark_up',
                scope: 'product',
            },
            {
                name: 'Num. Requests',
                value: 'requests',
                scope: 'user',
            },
            {
                name: 'Num. Comments',
                value: 'comments',
                scope: 'user',
            },
            {
                name: 'Num. In',
                value: 'ins',
                scope: 'user',
            },
            {
                name: 'Num. Out',
                value: 'outs',
                scope: 'user',
            },
            {
                name: 'Num. Focus',
                value: 'focus',
                scope: 'user',
            },
            {
                name: 'Num. Not decided',
                value: 'nds',
                scope: 'user',
            },
        ],
        defaultKeyFilterObject: {
            type: 'key',
            key: {
                name: 'Choose key'
            },
            operator: '>',
            value: 0,
            filter: {name: 'Add filter'},
        },
        defaultAuthorFilterObject: {
            type: 'author',
            key: 'Choose key',
            operator: '=',
            filter: {
                name: 'Choose filter'
            },
        },
        availableOperators: [
            {name: '> Greater than', value: '>'}, {name: '< Less than', value: '<'}, {name: '= Equal to', value: '='}, {name: '!= Not equal to', value: '!='}
        ],
        availableUserOperators: [
            {name: '= Equal to', value: '='}, {name: '!= Not equal to', value: '!='}
        ],
        availableActionTypes: [
            {name: 'Action: In', value: 'In'}, 
            {name: 'Action: Out', value: 'Out'}, 
            {name: 'Action: Focus', value: 'Focus'}, 
            {name: 'Action: None', value: 'None'}, 
            {name: 'Has Comment', value: 'Comment'}, 
            {name: 'Has Request', value: 'Request'}
            ],
        keyFilters: [],
        contextKeyFilter: [],
    }},
    computed: {
        ...mapGetters('products', {
            products: 'products',
            getActiveSelectionInput: 'getActiveSelectionInput'
        }),
        ...mapGetters('auth', ['authUser']),
        availableFeedbackUsers() {
            // Every product should include every feedback user, so we should be able to simple do this:
            const selectionInput = this.getActiveSelectionInput(this.products[0])
            const usersToReturn = [{
                name: 'You',
                user_id: this.authUser.id,
            }]
            usersToReturn.concat(selectionInput.actions.map(action => {
                if (usersToReturn.find(x => x.user_id == action.user_id)) return
                return {
                    name: action.user ? action.user.name : 'Anonymous',
                    user_id: action.user_id,
                }
            }))
            usersToReturn.concat(selectionInput.feedbacks.map(feedback => {
                if (usersToReturn.find(x => x.user_id == feedback.user_id)) return
                return {
                    name: feedback.user ? feedback.user.name : 'Anonymous',
                    user_id: feedback.user_id,
                }
            }))
            return usersToReturn
        },
        availableSelections() {
            // Every product should include every feedback user, so we should be able to simple do this:
            const selectionInput = this.getActiveSelectionInput(this.products[0])
            return selectionInput.actions.map(action => {
                return action.selection
            })
        },
        availableFilters() {
            return [
                {
                    name: 'Selection',
                    options: this.availableSelections.map(x => {
                        x.filterType = 'selection'
                        return x
                    })
                },
                {
                    name: 'User',
                    options: this.availableFeedbackUsers.map(x => {
                        x.filterType = 'user'
                        return x
                    })
                }
            ]
        },
        productsFiltered() {
            return this.products.filter(product => {
                let include = true
                this.keyFilters.forEach(filter => {

                    // FILTER BY USER / SELECTION INPUT
                    if (filter.type == 'author') {
                        if (!filter.filter.filterType) return

                        const operator = filter.operator
                        const type = filter.filter.filterType
                        const selectionInput = this.getActiveSelectionInput(product)

                        if (type == 'user') {
                            const userId = filter.filter.user_id

                            if (filter.key == 'Comment') {
                                if (operator == '=' && !selectionInput.comments.find(x => x.user_id == userId)) include = false
                                if (operator == '!=' && !!selectionInput.comments.find(x => x.user_id == userId)) include = false
                            }
                            else if (filter.key == 'Request') {
                                if (operator == '=' && !selectionInput.requests.find(x => x.author_id == userId)) include = false
                                if (operator == '!=' && !!selectionInput.requests.find(x => x.author_id == userId)) include = false
                            }
                            else {
                                const actionArray = this.distributionScope == 'Alignment' ? 'actions' : 'feedbacks'
                                const userFeedback = selectionInput[actionArray].find(action => action.user_id == userId)
                                if (operator == '=' && (!userFeedback || userFeedback.action != filter.actionType)) include = false
                                if (operator == '!=' && (!!userFeedback && userFeedback.action == filter.actionType)) include = false
                            }
                        }

                        if (type == 'selection') {
                            const selectionId = filter.filter.id

                            if (filter.key == 'Comment') {
                                if (operator == '=' && !selectionInput.comments.find(x => x.selection_id == selectionId)) include = false
                                if (operator == '!=' && !!selectionInput.comments.find(x => x.selection_id == selectionId)) include = false
                            }
                            else if (filter.key == 'Request') {
                                if (operator == '=' && !selectionInput.requests.find(x => x.selection_id == selectionId)) include = false
                                if (operator == '!=' && !!selectionInput.requests.find(x => x.selection_id == selectionId)) include = false
                            }
                            else {
                                const selectionAction = selectionInput.actions.find(action => action.selection_id == selectionId)
                                if (operator == '=' && (!selectionAction || selectionAction.action != filter.actionType)) include = false
                                if (operator == '!=' && (!!selectionAction && selectionAction.action == filter.actionType)) include = false
                            }
                        }
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
        onAddSelectionFilter() {
            this.keyFilters.push(JSON.parse(JSON.stringify(this.defaultSelectionFilterObject)))
        },
        onAddAuthorFilter() {
            this.keyFilters.push(JSON.parse(JSON.stringify(this.defaultAuthorFilterObject)))
        },
        onRemoveFilter(index, type) {
            let keyIndex = -1
            let theIndex = 0
            let foundMatch = false
            this.keyFilters.forEach(key => {
                if (foundMatch) return

                if (key.type == type) keyIndex++

                if (index == keyIndex) {
                    foundMatch = true
                } else {
                    theIndex++
                }

            })
            this.keyFilters.splice(theIndex, 1)
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
            // Remove unset filters
            const filtersToSet = this.keyFilters.filter(x => !(x.type == 'author' && !x.filter || x.type == 'key' && !x.key.value))
            this.SET_ADVANCED_FILTER(JSON.parse(JSON.stringify(filtersToSet)))
        }
    },
    created() {
        this.onAddFilter()
        this.onAddAuthorFilter()
    }
}
</script>

<style lang="scss">
.tooltip.advanced-filter {
    max-width: none;
}

</style>

<style lang="scss" scoped>
.conditional-filters {
    padding: 16px;
    // width: 298px;
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
            max-width: 36px;
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