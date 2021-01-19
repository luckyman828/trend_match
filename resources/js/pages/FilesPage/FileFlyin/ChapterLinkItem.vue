<template>
    <div class="rule-item flex-list center-v md">
        <BaseDropdownInputField
            class="combinator-field"
            v-if="ruleIndex == 0"
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
            class="linked-chapter-field"
            innerLabel="Chapter"
            v-model="chapterLink.linkedChapterId"
            type="radio"
            :options="availableChapters"
            nameKey="name"
            valueKey="id"
        />
        <BaseDropdownInputField
            class="operator-field"
            type="radio"
            innerLabel="Operator"
            v-model="chapterRule.operator"
            :options="validOperators"
            nameKey="displayName"
            valueKey="operatorName"
        />

        <!-- Arrays -->
        <template v-if="mappedRule.type == 'array'">
            <BaseDropdownInputField
                v-if="!['AnyInArray', 'NotInArray'].includes(chapterRule.operator)"
                class="value-field"
                type="radio"
                v-model="chapterRule.value"
                :options="availableValues"
            />
            <BaseDropdownInputField
                v-else
                class="value-field"
                v-model="chapterRule.values"
                :options="availableValues"
            />
        </template>
        <BaseInputField
            type="number"
            v-else-if="mappedRule.type == 'number'"
            class="value-field"
            v-model="chapterRule.value"
        />
        <BaseButton buttonClass="invisible ghost-hover dark" @click="$emit('remove')"
            ><i class="far fa-trash"></i
        ></BaseButton>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'chapterLinkItem',
    props: [
        'chapter',
        'chapterLink',
        'availableOperators',
        'availableChapters',
        'filterCombinator',
        'availableCombinators',
        'ruleIndex',
    ],
    computed: {
        ...mapGetters('products', {
            products: 'products',
        }),
        chapterRule() {
            return this.chapterLink.rule
        },
        mappedRule() {
            return this.chapterLink.rule
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

            const productKey = ruleName
                .split(/(?=[A-Z])/)
                .join('_')
                .toLowerCase() // Convert ruleName to product key

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
        ruleOperator() {
            return this.chapterRule.operator
        },
    },
    watch: {
        ruleOperator(newOperator, oldOperator) {
            if (!this.chapterRule.type == 'array' || !oldOperator) return
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
    created() {
        if (!this.chapterLink.linkedChapterId) this.chapterLink.linkedChapterId = this.availableChapters[0].id
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.rule-item {
    padding: 16px;
    border: $borderModule;
    border-radius: $borderRadiusModule;
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
