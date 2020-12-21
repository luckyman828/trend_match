<template>
    <div class="rule-item flex-list center-v md">
        <BaseDropdownInputField
            class="combinator-field"
            v-if="index == 0"
            type="radio"
            innerLabel="Combinator"
            value="WHERE"
            :readOnly="true"
        />
        <BaseDropdownInputField
            class="combinator-field"
            v-else
            type="radio"
            innerLabel="Combinator"
            :options="availableCombinators"
            :value="filterCombinator"
            @input="$emit('update:filterCombinator', $event)"
        />
        <BaseDropdownInputField
            class="rule-name-field"
            innerLabel="Field"
            v-model="filterRule.ruleName"
            type="radio"
            :options="availableRules"
            nameKey="displayName"
            valueKey="ruleName"
            @input="onRuleChange"
        />
        <BaseDropdownInputField
            class="operator-field"
            type="radio"
            innerLabel="Operator"
            v-model="filterRule.operator"
            :options="validOperators"
            nameKey="displayName"
            valueKey="operatorName"
        />

        <!-- Arrays -->
        <BaseDropdownInputField
            v-if="mappedRule.type == 'array'"
            class="value-field"
            :type="['AnyInArray', 'NotInArray'].includes(filterRule.operator) ? 'select' : 'radio'"
            v-model="filterRule.value"
            :options="availableValues"
        />
        <BaseInputField
            type="number"
            v-else-if="filterRule.type == 'number'"
            class="value-field"
            v-model="filterRule.value"
        />

        <BaseButton buttonClass="invisible ghost-hover dark" :disabled="index == 0" @click="$emit('remove')"
            ><i class="far fa-trash"></i
        ></BaseButton>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'chapterRuleItem',
    props: ['filterRule', 'index', 'availableCombinators', 'availableRules', 'availableOperators', 'filterCombinator'],
    computed: {
        ...mapGetters('products', {
            products: 'products',
        }),
        mappedRule() {
            return this.availableRules.find(rule => rule.ruleName == this.filterRule.ruleName)
        },
        validOperatorNames() {
            if (!this.filterRule.ruleName) return []
            return this.mappedRule.validOperators
        },
        validOperators() {
            return this.availableOperators.filter(operator => this.validOperatorNames.includes(operator.operatorName))
        },

        availableValues() {
            const ruleName = this.filterRule.ruleName
            if (!ruleName) return []
            if (ruleName == 'ParentSelectionAlignment') {
                return ['Focus', 'In', 'Out', 'None']
            }

            const productKey = ruleName
                .split(/(?=[A-Z])/)
                .join('_')
                .toLowerCase() // Convert rulename to product key

            const unique = []

            function addIfUnique(value) {
                if (value != null && !unique.find(x => x == value)) unique.push(value)
            }

            this.products.map(product => {
                const productValue = product[productKey]
                let alreadyAdded = false
                if (Array.isArray(productValue)) {
                    productValue.map(arrayValue => addIfUnique(arrayValue))
                } else {
                    addIfUnique(productValue)
                }
            })

            return unique
        },
    },
    methods: {
        onRuleChange() {
            // Make sure the operator is valid for the rule
            const operatorIsValid = this.validOperatorNames.includes(this.filterRule.operator)
            if (!operatorIsValid) {
                this.filterRule.operator = this.validOperatorNames[0]
            }
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.rule-item {
    padding: 16px;
    border: $borderModule;
    &:hover {
        background: $bgElHover;
    }
}
.combinator-field {
    width: 88px;
}
.operator-field {
    width: 106px;
}
</style>
