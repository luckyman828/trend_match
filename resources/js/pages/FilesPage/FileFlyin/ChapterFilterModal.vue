<template>
    <BaseModal
        class="chapter-filter-modal"
        :show="show"
        @close="$emit('close')"
        :header="selection ? selection.name : 'Unnamed'"
        subHeader="Chapter settings"
    >
        <template v-if="show && !status">
            <div class="linked-chapter-section" v-if="availableChapters.length > 0">
                <h3>Linked Chapter</h3>
                <div class="rule-item-list">
                    <button
                        class="ghost-item invisible primary ghost-hover"
                        v-if="!hasChapterLink"
                        @click="hasChapterLink = true"
                    >
                        <i class="far fa-plus"></i>
                        <span>Add Linked Chapter</span>
                    </button>
                    <template v-else>
                        <div class="flex-list center-v md">
                            <BaseDropdownInputField
                                class="linked-chapter-field"
                                innerLabel="Linked Chapter"
                                v-model="linkedChapterId"
                                type="radio"
                                :options="availableChapters"
                                nameKey="name"
                                valueKey="id"
                                @input="onNewLinkedChapter"
                            />
                            <button
                                class="invisible ghost-hover dark"
                                v-tooltip="'Remove chapter link'"
                                @click="onNewLinkedChapter(null)"
                            >
                                <i class="far fa-trash"></i>
                            </button>
                        </div>

                        <div class="rule-item-list" v-if="linkedChapter">
                            <h4>Inherited rules</h4>
                            <div class="flex-list flex-v">
                                <ChapterRuleItem
                                    v-for="(chapterRule, index) in linkedChapter.rules"
                                    :key="chapterRule.key"
                                    :chapterRule="chapterRule"
                                    :index="index"
                                    :availableCombinators="availableCombinators"
                                    :availableOperators="availableOperators"
                                    :availableRules="availableRules"
                                    :filterCombinator.sync="filterCombinator"
                                    :chapterRuleCount="chapterRules.length"
                                    :readOnly="true"
                                />
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div class="chapter-rules-section">
                <h3>Chapter rules</h3>
                <div class="rule-item-list flex-list flex-v">
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
                </div>
            </div>

            <button class="dark full-width lg" @click="onSubmit"><span>Save Chapter</span></button>
        </template>
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
            filterCombinator: 'AND',
            chapterRules: [],
            hasChapterLink: false,
            linkedChapterId: null,
            linkedChapter: null,
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
        ...mapGetters('selections', {
            allSelections: 'getSelections',
        }),
        availableChapters() {
            return this.allSelections.filter(x => x.type == 'Chapter' && x.id != this.selection.id)
        },
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
                    displayName: 'Brand',
                    name: 'Brand',
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
                    displayName: 'Linked Chapter Action',
                    name: 'ParentSelectionAlignment',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                    type: 'array',
                },
            ]

            const rulesToReturn = !this.hasChapterLink
                ? baseRules.filter(rule => rule.name != 'ParentSelectionAlignment')
                : baseRules

            return rulesToReturn
        },
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.init()
            } else {
                this.hasChapterLink = false
                this.linkedChapterId = null
                this.linkedChapter = null
            }
        },
    },
    methods: {
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('selections', ['fetchChapterRules', 'updateChapterRules']),
        async init() {
            this.status = 'Fetching rules'
            // Fetch chapter rules
            const chapterRules = await this.fetchChapterRules({ selection: this.selection })

            this.filterCombinator = chapterRules.relation
            this.chapterRules = chapterRules.rules
                ? chapterRules.rules.map(rule => {
                      rule.key = this.$uuid.v4()
                      return rule
                  })
                : []

            if (parseInt(this.selection.linked_chapter_id)) {
                const linkedChapterId = this.selection.linked_chapter_id
                await this.fetchLinkedChapter(linkedChapterId)
                this.linkedChapterId = linkedChapterId
                this.hasChapterLink = true
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
                linkedChapterId: this.hasChapterLink ? this.linkedChapterId : null,
            })
            this.status = null
            this.$emit('close')
        },
        onNewLinkedChapter(linkedChapter) {
            if (!linkedChapter) {
                this.linkedChapter = null
                this.linkedChapterId = null
                this.hasChapterLink = false
                this.chapterRules = this.chapterRules.filter(rule => rule.name != 'ParentSelectionAlignment')
                return
            }
            this.fetchLinkedChapter(linkedChapter)
        },
        async fetchLinkedChapter(linkedChapterId) {
            const chapter = this.allSelections.find(x => x.id == linkedChapterId)
            const chapterRules = await this.fetchChapterRules({ selection: chapter })
            this.linkedChapter = {
                chapter,
                rules: chapterRules.rules
                    ? chapterRules.rules
                          .filter(rule => rule.name != 'ParentSelectionAlignment')
                          .map(rule => {
                              rule.key = this.$uuid.v4()
                              return rule
                          })
                    : [],
            }
        },
    },
    created() {},
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
h3 {
    margin-bottom: 8px;
}
.rule-item-list {
    margin-bottom: 16px;
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
