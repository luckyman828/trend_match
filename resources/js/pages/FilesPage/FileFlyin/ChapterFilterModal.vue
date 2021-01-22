<template>
    <BaseModal
        class="chapter-filter-modal"
        :show="show"
        @close="$emit('close')"
        :header="selection ? selection.name : 'Unnamed'"
        subHeader="Chapter settings"
    >
        <h3>Show products...</h3>
        <template v-if="show && !status">
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
                        <div class="flex-list center-v md center-h">
                            <BaseDropdownInputField
                                class="linked-chapter-field"
                                innerLabel="Linked Chapter"
                                v-model="chapterLink.linkedChapterId"
                                type="radio"
                                :options="availableChapters"
                                nameKey="name"
                                valueKey="id"
                                @input="onNewLinkedChapter"
                            />
                            <button
                                class="invisible ghost-hover dark"
                                v-tooltip="'Remove chapter link'"
                                @click="hasChapterLink = false"
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

                        <div class="rule-item-list" v-if="linkedChapter">
                            <h4>linked chapter action</h4>
                            <div class="chapter-link">
                                <button
                                    class="ghost-item invisible primary ghost-hover"
                                    v-if="!hasChapterActionLink"
                                    @click="hasChapterActionLink = true"
                                >
                                    <i class="far fa-plus"></i>
                                    <span>Add Linked Chapter Action Filter</span>
                                </button>
                                <ChapterLinkItem
                                    v-else
                                    :ruleIndex="chapterRules.length"
                                    :chapterLink="chapterLink"
                                    :availableOperators="availableOperators"
                                    :chapter="selection"
                                    :availableChapters="availableChapters"
                                    :filterCombinator.sync="filterCombinator"
                                    :availableCombinators="availableCombinators"
                                    @remove="hasChapterActionLink = false"
                                />
                            </div>
                        </div>
                    </template>
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
import ChapterLinkItem from './ChapterLinkItem'
export default {
    name: 'chapterFilterModal',
    components: { ChapterRuleItem, ChapterLinkItem },
    props: ['show', 'selection'],
    data: function() {
        return {
            status: true,
            fileIdFetchedFrom: null,
            filterCombinator: 'AND',
            chapterRules: [],
            hasChapterLink: false,
            chapterLink: null,
            linkedChapter: null,
            hasChapterActionLink: false,
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
                // {
                //     displayName: 'Parent IN/OUT',
                //     name: 'ParentSelectionAlignment',
                //     validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                //     type: 'array',
                // },
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
            } else {
                this.chapterLink = {
                    rule: {
                        displayName: 'Chapter Alignment',
                        name: 'ParentSelectionAlignment',
                        validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                        type: 'array',
                        operator: 'Equal',
                        value: null,
                        values: [],
                        key: this.$uuid.v4(),
                    },
                    linkedChapterId: null,
                }
            }
        },
    },
    methods: {
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('selections', ['fetchChapterRules', 'updateChapterRules']),
        getDefaultChapterLink() {
            return {
                rule: {
                    displayName: 'Chapter Alignment',
                    name: 'ParentSelectionAlignment',
                    validOperators: ['Equal', 'NotEqual', 'AnyInArray', 'NotInArray', 'IsNullOrEmpty'],
                    type: 'array',
                    operator: 'Equal',
                    value: null,
                    values: [],
                    key: this.$uuid.v4(),
                },
                linkedChapterId: null,
            }
        },
        async init() {
            this.status = 'Fetching rules'
            // Fetch chapter rules
            const chapterRules = await this.fetchChapterRules({ selection: this.selection })
            this.chapterLink = this.getDefaultChapterLink()
            this.hasChapterActionLink = false

            this.filterCombinator = chapterRules.relation
            this.chapterRules = chapterRules.rules
                ? chapterRules.rules
                      .filter(rule => rule.name != 'ParentSelectionAlignment')
                      .map(rule => {
                          rule.key = this.$uuid.v4()
                          return rule
                      })
                : []

            if (parseInt(this.selection.linked_chapter_id)) {
                const actionRule =
                    chapterRules.rules && chapterRules.rules.find(rule => rule.name == 'ParentSelectionAlignment')
                if (actionRule) {
                    this.hasChapterActionLink = true
                    Object.assign(this.chapterLink.rule, actionRule)
                }
                this.hasChapterLink = true
                const linkedChapterId = this.selection.linked_chapter_id
                await this.fetchLinkedChapter(linkedChapterId)
                this.chapterLink.linkedChapterId = linkedChapterId
            } else {
                this.hasChapterLink = false
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
                chapterLink: this.hasChapterLink ? this.chapterLink : null,
            })
            this.status = null
            this.$emit('close')
        },
        onNewLinkedChapter(linkedChapter) {
            if (!linkedChapter) {
                this.linkedChapter = null
                this.chapterLink.linkedChapterId = null
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
    text-align: center;
}
h4 {
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
