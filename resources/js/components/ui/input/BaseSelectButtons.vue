<template>

    <div class="select-buttons" ref="selectButtons">


        <div class="search-wrapper" v-if="search">
            <!-- <SearchField ref="searchField" :searchKey="searchKey" :arrayToSearch="options" v-model="optionsFilteredBySearch"/> -->
            <BaseSearchField ref="searchField" :searchKey="searchKey" :arrayToSearch="options" 
            :searchMultipleArrays="multipleOptionArrays" :multipleArrayKey="optionGroupOptionsKey" v-model="optionsFilteredBySearch"/>
        </div>
        <div class="wrapper">
            <span class="header" v-html="header" v-if="header"></span>

            <div class="option unset-option" v-if="unsetOption" @click="onUnset">
                <label>
                    <i class="fas fa-minus"></i>
                    <div class="label">
                        {{unsetOption}}
                    </div>
                </label>
            </div>

            <template v-if="multipleOptionArrays">
                <div class="option-group" v-for="(optionGroup, index) in optionsFilteredBySearch" :key="index">
                    <h4>{{optionGroupNameKey != null ? optionGroup[optionGroupNameKey] : `group-${index+1}`}}</h4>
                    <div class="option" v-for="(option, index) in optionGroupOptionsKey ? optionGroup[optionGroupOptionsKey] : optionGroup" :key="index" 
                    :class="[{'has-description': optionDescriptionKey}, 
                    {'active': type == 'radio' ? (option[optionValueKey] ? option[optionValueKey] == selection : option == selection) 
                    : option[optionValueKey] ? selection.includes(option[optionValueKey]) : selection.includes(selection)}]">

                        <label>
                            <BaseRadiobox v-if="type == 'radio'" :value="optionValueKey ? option[optionValueKey] : option" :modelValue="selection" v-model="selection" @change="change"/>
                            <BaseCheckbox v-else :value="optionValueKey ? option[optionValueKey] : option" :modelValue="selection" v-model="selection" @change="change"/>

                            <div class="label">
                                <template v-if="optionNameKey">
                                    {{option[optionNameKey]}}
                                </template>
                                <template v-else>
                                    {{option}}
                                </template>
                                <p class="description" v-if="optionDescriptionKey">
                                    {{optionGroup[optionDescriptionKey]}}
                                </p>
                            </div>
                        </label>

                    </div>
                </div>
            </template>

            <template v-else>
                <div class="option" v-for="(option, index) in optionsFilteredBySearch" :key="index" 
                :class="[{'has-description': optionDescriptionKey}, 
                {'active': type == 'radio' ? (option[optionValueKey] ? option[optionValueKey] == selection : option == selection) 
                : option[optionValueKey] ? selection.includes(option[optionValueKey]) : selection.includes(selection)}]">

                    <label>
                        <BaseRadiobox v-if="type == 'radio'" :value="optionValueKey ? optionValueKey == 'index' ? index : option[optionValueKey] : option" 
                        v-model="selection" @change="change"/>
                        <BaseCheckbox v-else :value="optionValueKey ? optionValueKey == 'index' ? index : option[optionValueKey] : option" 
                        :modelValue="selection" v-model="selection" @change="change"/>

                        <div class="label">
                            <template v-if="optionNameKey">
                                {{option[optionNameKey]}}
                            </template>
                            <template v-else>
                                {{option}}
                            </template>
                            <p class="description" v-if="optionDescriptionKey">
                                {{option[optionDescriptionKey]}}
                            </p>
                        </div>
                    </label>

                </div>
            </template>

        </div>
    </div>

</template>

<script>
export default {
    name: 'selectButtons',
    props: [
        'header',
        'type',
        'options',
        'optionNameKey',
        'optionValueKey',
        'optionDescriptionKey',
        'search',
        'submitOnChange',
        'multipleOptionArrays',
        'optionGroupNameKey',
        'optionGroupOptionsKey',
        'unsetOption',
        'value',
    ],
    data: function () { return {
        selection: [],
        searchString: '',
        optionsFilteredBySearch: this.options
    }},
    computed: {
        searchKey() {
            const nameKey = this.optionNameKey
            const valueKey = this.optionValueKey
            if (nameKey) {
                return nameKey
            }
            else if (valueKey) {
                return valueKey
            }
        }
    },
    methods: {
        submit() {
            this.$emit('input', this.selection)
            this.$emit('submit', this.selection)
        },
        change() {
            this.$emit('change', this.selection)
            if (this.submitOnChange) {
                this.submit()
            }
        },
        clear () {
            this.selection = []
            this.$emit('input', this.selected)
        },
        focusSearch() {
            if (this.search) {
                this.$refs.searchField.setFocus()
            }
        },
        onUnset() {
            this.$emit('unset')
        }
    },
    mounted() {
        this.focusSearch()
        // Preset the selection to the current option
        this.selection = this.value
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .select-buttons {
        &:not(:last-child) {
            margin-bottom: 12px;
        }
    }
    .search-wrapper + .wrapper {
        border-top: solid 1px $divider;
    }
    .header {
        font-size: 12px;
        font-weight: 500;
        padding: 0 16px;
        color: $primary;
    }
    .select-buttons .wrapper {
        max-height: 500px;
        overflow: hidden auto;
        .option-group {
            padding-top: 16px;
            margin-top: 8px;
            h4 {
                margin: 0;
                padding: 0 16px;
                margin-bottom: 8px;
            }
        }
        .option {
            font-weight: 400;
            font-size: 12px;
            cursor: pointer;
            label {
                padding: 8px 16px;
                display: flex;
                align-items: center;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                .label {
                    width: 100%
                }
            }
            .description {
                font-size: 12px;
                font-weight: 400;
                margin-top: -4px;
                // white-space: nowrap;
                width: calc(100% - 16px);
                // overflow: hidden;
            }
            &:hover, &.active {
                background: $bgContentActive;
            }
            &.has-description {
                label {
                    align-items: flex-start;
                    .radiobox, .checkbox {
                        margin-top: 4px;
                    }
                }
            }
            &:hover {
                .checkmark {
                    border: solid 2px $primary;
                }
                input[type=checkbox] {
                    &:checked + .checkmark {
                        i {
                            &::before {
                                content: '\f068'
                            }
                        }
                    }
                }
            }
        }
    }
    .checkbox {
        position: relative;
        line-height: 0;
        margin-right: 10px;
        input[type=checkbox] {
            position: absolute;
            display: block;
            opacity: 0;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
            z-index: 1;
            &:checked + .checkmark {
                height: 18px;
                width: 18px;
                border-color: $primary;
                i {
                    font-weight: 500;
                }
            }
        }
        .checkmark {
            margin: 0;
            height: 18px;
            width: 18px;
            border: solid $dark2 1px;
            i {
                color: white;
            }
        }
    }
    .search-wrapper {
        padding: 8px 16px;
        margin-bottom: 8px;
    }
    .unset-option {
        i {
            margin-right: 8px;
        }
    }

</style>