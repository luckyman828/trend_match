<template>
    <div class="rule-item flex-list center-v md" :class="{ 'read-only': readOnly }">
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
            :readOnly="readOnly"
            @input="$emit('update:filterCombinator', $event)"
        />
        <BaseDropdownInputField
            class="rule-name-field"
            innerLabel="Field"
            v-model="chapterRule.name"
            type="radio"
            :options="availableRules"
            nameKey="displayName"
            valueKey="name"
            :readOnly="readOnly"
            @input="onRuleChange"
        />

        <BaseDropdownInputField
            class="operator-field"
            type="radio"
            innerLabel="Operator"
            v-model="chapterRule.operator"
            :options="validOperators"
            nameKey="displayName"
            valueKey="operatorName"
            :readOnly="readOnly"
        />

        <!-- Arrays -->
        <template v-if="mappedRule.type == 'array'">
            <BaseDropdownInputField
                class="value-field"
                :type="isRadioInput ? 'radio' : 'select'"
                v-model="ruleValueArray"
                :options="availableValues"
                :readOnly="readOnly"
                :displayFunction="chapterRule.name == 'DeliveryDate' && getPrettyDate"
                :search="availableValues.length > 5"
                :allowManualEntry="mappedRule.allowManualEntry"
            />
        </template>
        <BaseInputField
            type="number"
            v-else-if="mappedRule.type == 'number'"
            class="value-field"
            v-model="chapterRule.value"
            :readOnly="readOnly"
        />

        <BaseButton v-if="!readOnly" buttonClass="no-bg ghost-hover dark" @click="$emit('remove')"
            ><i class="far fa-trash"></i
        ></BaseButton>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'chapterRuleItem',
    props: [
        'chapterRule',
        'index',
        'availableCombinators',
        'availableRules',
        'availableOperators',
        'filterCombinator',
        'chapterRuleCount',
        'readOnly',
    ],
    computed: {
        ...mapGetters('products', {
            products: 'getAllProducts',
        }),
        ruleValueArray: {
            get() {
                return this.isRadioInput ? this.chapterRule.value : this.chapterRule.values
            },
            set(val) {
                if (this.isRadioInput) this.chapterRule.value = val
                else this.chapterRule.values = val
            },
        },
        isRadioInput() {
            return !['AnyInArray', 'NotInArray'].includes(this.chapterRule.operator)
        },
        mappedRule() {
            return this.availableRules.find(rule => rule.name == this.chapterRule.name)
        },
        validOperatorNames() {
            if (!this.chapterRule.name) return []
            return this.mappedRule.validOperators
        },
        validOperators() {
            return this.availableOperators.filter(operator => this.validOperatorNames.includes(operator.operatorName))
        },

        availableValues() {
            let ruleName = this.chapterRule.name
            if (!ruleName) return []
            if (ruleName == 'ParentSelectionAlignment') {
                return ['Focus', 'In', 'Out', 'None']
            }
            if (ruleName == 'DeliveryDate') ruleName = 'DeliveryDates'

            let productKey = ruleName
                .split(/(?=[A-Z])/)
                .join('_')
                .toLowerCase() // Convert ruleName to product key
            if (ruleName == 'Ean') {
                productKey = 'getAllEAN'
            }

            const unique = []

            function addIfUnique(value) {
                if (value != null && !unique.find(x => x == value)) unique.push(value.toString())
            }

            this.products.map(product => {
                const productValue = product[productKey]
                if (Array.isArray(productValue)) {
                    productValue.map(arrayValue => addIfUnique(arrayValue))
                } else {
                    addIfUnique(productValue)
                }
            })

            return unique
        },
        ruleOperator() {
            return this.chapterRule.operator
        },
    },
    watch: {
        ruleOperator(newOperator, oldOperator) {
            if (this.chapterRule.type != 'array' || !oldOperator) return
            // From Multi to Single
            if (['Equal', 'NotEqual'].includes(newOperator) && ['AnyInArray', 'NotInArray'].includes(oldOperator)) {
                this.chapterRule.value = this.chapterRule.values[0]
            }

            // From Single to Multi
            if (['Equal', 'NotEqual'].includes(oldOperator) && ['AnyInArray', 'NotInArray'].includes(newOperator)) {
                this.chapterRule.values = this.chapterRule.value ? [this.chapterRule.value] : []
            }
        },
        mappedRule() {
            // Reset the selected values when the mapped rule changed
            this.chapterRule.value = null
            this.chapterRule.values = []
        },
    },
    methods: {
        onRuleChange() {
            // Make sure the operator is valid for the rule
            const operatorIsValid = this.validOperatorNames.includes(this.chapterRule.operator)
            if (!operatorIsValid) {
                this.chapterRule.operator = this.validOperatorNames[0]
            }
        },
    },
}
</script>

<style scoped lang="scss">
.rule-item {
    padding: 16px;
    border: $borderModule;
    border-radius: $borderRadiusModule;
    &:hover {
        background: $bgElHover;
    }
    &.read-only {
        background: $grey450;
        pointer-events: none;
    }
}
.combinator-field {
    width: 88px;
}
.operator-field {
    width: 106px;
}
.value-field {
    width: 200px;
}
</style>
