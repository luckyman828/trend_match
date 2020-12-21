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
            <ChapterRuleItem
                v-for="(filterRule, index) in chapterFilterRules"
                :key="index"
                :filterRule="filterRule"
                :index="index"
                :availableCombinators="availableCombinators"
                :availableOperators="availableOperators"
                :availableRules="availableRules"
                :filterCombinator.sync="filterCombinator"
                @remove="onRemoveRule(index)"
            />
            <button class="ghost-item invisible primary ghost-hover" @click="onAddRule">
                <i class="far fa-plus"></i>
                <span>Add Filter</span>
            </button>
            <button class="dark full-width lg" @click="onSubmit"><span>Save Chapter</span></button>
        </div>
        <BaseLoader v-else />
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChapterRuleItem from './ChapterRuleItem'
export default {
    name: 'chapterFilterModal',
    components: { ChapterRuleItem },
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
                // { displayName: 'Is undefined', operatorName: 'IsNullOrEmpty' },
                { displayName: 'Greater than', operatorName: 'Greater' },
                { displayName: 'Less than', operatorName: 'LessThan' },
            ]
        },
        availableRules() {
            // Get custom fields and add them
            const baseRules = [
                {
                    displayName: 'Category',
                    ruleName: 'Category',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                    type: 'array',
                },
                {
                    displayName: 'Buying Gruop',
                    ruleName: 'BuyingGroup',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                    type: 'array',
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
                    type: 'array',
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
                    type: 'number',
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
                    type: 'array',
                },
                {
                    displayName: 'Parent IN/OUT',
                    ruleName: 'ParentSelectionAlignment',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                    type: 'array',
                },
            ]
            // baseRules.push(
            //     ...this.customFields.map(field => {
            //         return {
            //             displayName: field,
            //             ruleName: field,
            //             validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
            //         }
            //     })
            // )
            return baseRules
        },
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.init()
            }
        },
    },
    methods: {
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('selections', ['fetchChapterRules', 'updateChapterRules']),
        async init() {
            this.isLoading = true
            // Fetch chapter rules
            const chapterRules = await this.fetchChapterRules({ selection: this.selection })

            console.log('fetched chatper rules', chapterRules)

            // this.chapterFilterRules.push(...chapterRules)
            if (this.chapterFilterRules.length <= 0) {
                this.chapterFilterRules.push(this.getDefaultRule())
            }

            // Check if we have any products fetched, else fetch them
            if (this.file.id != this.fileProductsAreFetchedFromId) {
                this.fileProductsAreFetchedFromId = this.file.id
                await this.fetchProducts({ fileId: this.file.id })
            }
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

        async onSubmit() {
            await this.updateChapterRules({
                selection: this.selection,
                chapterRules: this.chapterFilterRules,
                combinator: this.filterCombinator,
            })
        },
    },
    created() {
        // this.init()
        // this.chapterFilterRules.push(this.getDefaultRule())
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.ghost-item {
    width: 100%;
    height: 72px;
    border: $borderGhostItem;
    background: transparent;
    color: $primary;
    &:hover {
        background: $primary;
        border-color: $primary;
        color: white;
    }
}
</style>
