<template>
    <BaseModal
        class="chapter-filter-modal"
        :show="show"
        @close="$emit('close')"
        :header="selection ? selection.name : 'Unnamed'"
        subHeader="Chapter settings"
    >
        <h3>Show products...</h3>
        <div class="rule-item-list flex-list flex-v" v-if="show && !isLoading">
            <div class="rule-item flex-list center-v md" v-for="(filterRule, index) in chapterFilterRules" :key="index">
                <BaseDropdownInputField
                    v-if="index == 0"
                    type="radio"
                    innerLabel="Combinator"
                    value="WHERE"
                    :readOnly="true"
                />
                <BaseDropdownInputField
                    v-else
                    type="radio"
                    innerLabel="Combinator"
                    :options="availableCombinators"
                    v-model="filterCombinator"
                />
                <BaseDropdownInputField
                    innerLabel="Field"
                    v-model="filterRule.ruleName"
                    type="radio"
                    :options="availableRules"
                    nameKey="displayName"
                    valueKey="ruleName"
                    @input="onRuleChange(filterRule)"
                />
                <BaseDropdownInputField
                    type="radio"
                    innerLabel="Operator"
                    v-model="filterRule.operator"
                    :options="
                        availableOperators.filter(operator =>
                            getValidOperators(filterRule).includes(operator.operatorName)
                        )
                    "
                    nameKey="displayName"
                    valueKey="operatorName"
                />
                <BaseDropdownInputField
                    v-model="filterRule.value"
                    :options="getAvailableValues(filterRule)"
                    nameKey="displayName"
                    valueKey="ruleName"
                />
                <BaseButton buttonClass="invisible ghost-hover dark" :disabled="index == 0" @click="onRemoveRule(index)"
                    ><i class="far fa-trash"></i
                ></BaseButton>
            </div>
            <button class="ghost-item invisible primary ghost-hover" @click="onAddRule">
                <i class="far fa-plus"></i>
                <span>Add Filter</span>
            </button>
        </div>
        <BaseLoader v-else />
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'chapterFilterModal',
    props: ['show', 'selection'],
    data: function() {
        return {
            isLoading: true,
            fileProductsAreFetchedFromId: null,
            filterCombinator: 'AND',
            chapterFilterRules: [],
        }
    },
    computed: {
        ...mapGetters('files', {
            file: 'getCurrentFile',
        }),
        ...mapGetters('products', {
            products: 'products',
        }),
        ...mapGetters('workspaces', {
            customFields: 'getCustomProductFields',
        }),
        availableCombinators() {
            return ['AND', 'OR']
        },
        availableOperators() {
            return [
                { displayName: 'Is', operatorName: 'Equal' },
                { displayName: 'Is Not', operatorName: 'NotEqual' },
                { displayName: 'Is Any of', operatorName: 'AnyInArray' },
                { displayName: 'Is Not Any of', operatorName: 'NotInArray' },
                { displayName: 'Is undefined', operatorName: 'IsNullOrEmpty' },
                { displayName: 'Greater than', operatorName: 'Greater' },
                { displayName: 'Less than', operatorName: 'LessThan' },
            ]
        },
        availableRules() {
            // Get custom fields and add them
            const baseHeaders = [
                {
                    displayName: 'Category',
                    ruleName: 'Category',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                },
                {
                    displayName: 'Buying Gruop',
                    ruleName: 'BuyingGroup',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                },
                {
                    displayName: 'Delivery Date',
                    ruleName: 'DeliveryDate',
                    validOperators: [
                        'Equal',
                        'AnyInArray',
                        'Greater',
                        'LessThan',
                        'GreaterOrEqual',
                        'IsNullOrEmpty',
                        'LessThanOrEqual',
                    ],
                },
                {
                    displayName: 'Product Minimum',
                    ruleName: 'MinOrder',
                    validOperators: [
                        'Equal',
                        'Greater',
                        'LessThan',
                        'GreaterOrEqual',
                        'IsNullOrEmpty',
                        'LessThanOrEqual',
                    ],
                },
                {
                    displayName: 'Variant Minimum',
                    ruleName: 'MinVariantOrder',
                    validOperators: [
                        'Equal',
                        'Greater',
                        'LessThan',
                        'GreaterOrEqual',
                        'IsNullOrEmpty',
                        'LessThanOrEqual',
                    ],
                },
                {
                    displayName: 'Parent IN/OUT',
                    ruleName: 'ParentSelectionAlignment',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                },
            ]
            // baseHeaders.push(
            //     ...this.customFields.map(field => {
            //         return {
            //             displayName: field,
            //             ruleName: field,
            //             validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
            //         }
            //     })
            // )
            return baseHeaders
        },
    },
    watch: {
        show(newVal) {
            if (newVal && this.file.id != this.fileProductsAreFetchedFromId) {
                this.init()
            }
        },
    },
    methods: {
        ...mapActions('products', ['fetchProducts']),
        async init() {
            this.isLoading = true
            // Check if we have any products fetched, else fetch them
            this.fileProductsAreFetchedFromId = this.file.id
            await this.fetchProducts({ fileId: this.file.id })
            this.isLoading = false
        },
        getDefaultRule() {
            return {
                ruleName: this.availableRules[0].ruleName,
                operator: this.availableOperators[0].operatorName,
                value: '',
            }
        },
        onAddRule() {
            this.chapterFilterRules.push(this.getDefaultRule())
        },
        onRemoveRule(index) {
            this.chapterFilterRules.splice(index, 1)
        },
        getValidOperators(filterRule) {
            if (!filterRule.ruleName) return []
            const mappedRule = this.availableRules.find(rule => rule.ruleName == filterRule.ruleName)
            const validOperators = mappedRule.validOperators
            return validOperators
        },
        checkOperatorIsValid(filterRule, operator) {
            if (!filterRule.ruleName || !operator) return false
            const validOperators = this.getValidOperators(filterRule)
            return validOperators.includes(operator)
        },
        onRuleChange(filterRule) {
            // Make sure the operator is valid for the rule
            const operatorIsValid = this.checkOperatorIsValid(filterRule, filterRule.operator)
            if (!operatorIsValid) {
                const validOperators = this.getValidOperators(filterRule)
                filterRule.operator = validOperators[0]
            }
        },
        getAvailableValues(filterRule) {
            return ['a', 'b', 'c']
        },
    },
    created() {
        this.init()
        this.chapterFilterRules.push(this.getDefaultRule())
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
// width: 616px
// ::v-deep {
//     width: 616px;
//     .modal {
//         width: 616px;
//     }
// }
// .chapter-filter-modal {
//     width: 616px;
//     ::v-deep {
//         .modal {
//             width: 616px;
//         }
//     }
//     &::v-deep {
//         .modal {
//             width: 616px;
//         }
//     }
// }
.rule-item {
    padding: 16px;
    border: $borderModule;
    &:hover {
        background: $bgElHover;
    }
}
.ghost-item {
    width: 100%;
    height: 72px;
    border: $borderGhostItem;
}
</style>
