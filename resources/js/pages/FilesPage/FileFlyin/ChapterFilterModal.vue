<template>
    <BaseModal
        class="chapter-filter-modal"
        :show="show"
        @close="$emit('close')"
        :header="selection ? selection.name : 'Unnamed'"
        subHeader="Chapter settings"
    >
        <h3>Show products...</h3>
        <div class="rule-item-list flex-list flex-v" v-if="show && !status">
            <ChapterRuleItem
                v-for="(chapterRule, index) in chapterRules"
                :key="chapterRule.key"
                :chapterRule="chapterRule"
                :index="index"
                :availableCombinators="availableCombinators"
                :availableOperators="availableOperators"
                :availableRules="availableRules"
                :filterCombinator.sync="filterCombinator"
                :chapterRuleCount="chapterRules.length"
                @remove="onRemoveRule(index)"
            />
            <button class="ghost-item invisible primary ghost-hover" @click="onAddRule">
                <i class="far fa-plus"></i>
                <span>Add Filter</span>
            </button>
            <button class="dark full-width lg" @click="onSubmit"><span>Save Chapter</span></button>
        </div>
        <BaseLoader v-else :msg="status" />
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
            status: true,
            fileIdFetchedFrom: null,
            selectionIdFetchedFrom: null,
            filterCombinator: 'AND',
            chapterRules: [],
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
                    name: 'Category',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                    type: 'array',
                },
                {
                    displayName: 'Buying Gruop',
                    name: 'BuyingGroup',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                    type: 'array',
                },
                {
                    displayName: 'Delivery Date',
                    name: 'DeliveryDate',
                    validOperators: [
                        'Equal',
                        'AnyInArray',
                        // 'Greater',
                        // 'LessThan',
                        // 'GreaterOrEqual',
                        // 'IsNullOrEmpty',
                        // 'LessThanOrEqual',
                    ],
                    type: 'array',
                },
                {
                    displayName: 'Product Minimum',
                    name: 'MinOrder',
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
                    name: 'MinVariantOrder',
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
                    displayName: 'Parent IN/OUT',
                    name: 'ParentSelectionAlignment',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                    type: 'array',
                },
            ]
            // baseRules.push(
            //     ...this.customFields.map(field => {
            //         return {
            //             displayName: field,
            //             name: field,
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
            this.status = 'Fetching rules'
            // Fetch chapter rules
            if (this.selectionIdFetchedFrom != this.selection.id) {
                this.selectionIdFetchedFrom = this.selection.id
                const chapterRules = await this.fetchChapterRules({ selection: this.selection })

                this.filterCombinator = chapterRules.relation
                this.chapterRules = chapterRules.rules
                    ? chapterRules.rules.map(rule => {
                          rule.key = this.$uuid.v4()
                          return rule
                      })
                    : []
            }
            if (this.chapterRules.length <= 0) {
                this.chapterRules.push(this.getDefaultRule())
            }

            // Check if we have any products fetched, else fetch them
            if (this.file.id != this.fileIdFetchedFrom) {
                this.fileIdFetchedFrom = this.file.id
                await this.fetchProducts({ fileId: this.file.id })
            }
            this.status = null
        },
        getDefaultRule() {
            return {
                name: this.availableRules[0].name,
                operator: this.availableOperators[0].operatorName,
                value: null,
                values: [],
                key: this.$uuid.v4(),
            }
        },
        onAddRule() {
            this.chapterRules.push(this.getDefaultRule())
        },
        onRemoveRule(index) {
            this.chapterRules.splice(index, 1)
        },

        async onSubmit() {
            this.status = 'Saving rules'
            await this.updateChapterRules({
                selection: this.selection,
                chapterRules: this.chapterRules,
                combinator: this.filterCombinator,
            })
            this.status = null
            this.$emit('close')
        },
    },
    created() {
        // this.init()
        // this.chapterRules.push(this.getDefaultRule())
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
h3 {
    text-align: center;
}
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
