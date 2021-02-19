<template>
    <div class="select-buttons" ref="selectButtons">
        <div class="search-wrapper" v-if="search && !manualEntryActive">
            <!-- <SearchField ref="searchField" :searchKey="searchKey" :arrayToSearch="options" v-model="optionsFilteredBySearch"/> -->
            <BaseSearchField
                ref="searchField"
                :searchKey="searchKey"
                :arrayToSearch="options"
                :searchMultipleArrays="multipleOptionArrays"
                :multipleArrayKey="optionGroupOptionsKey"
                :focusOnMount="focusSearchOnMount"
                v-model="optionsFilteredBySearch"
                @input="onSearch"
                @keydown.enter.exact.native="onSearchEnterKeypress"
                @keydown.enter.ctrl.native="submit()"
            />
        </div>
        <div class="wrapper">
            <span class="header" v-html="header" v-if="header"></span>

            <!-- Search in progress -->
            <div class="option manual-entry unset-option" v-if="allowManualEntry">
                <template v-if="submitSearchAsManualEntryAvailable">
                    <label>
                        <button class="primary full-width" style="margin-top: 8px;" @click="submit(searchString)">
                            <span>Use as custom value</span>
                        </button>
                    </label>
                </template>
                <!-- Not searching -->
                <template v-else>
                    <label
                        v-if="!manualEntryActive"
                        tabindex="0"
                        @keydown.enter="onActivateManualEntry"
                        @click="onActivateManualEntry"
                    >
                        <i class="far fa-pen"></i>
                        <div class="label">
                            Enter custom value
                        </div>
                    </label>
                    <label v-if="manualEntryActive">
                        <div class="label">
                            <BaseInputField
                                ref="manualEntryField"
                                inputClass="small"
                                placeholder="Enter custom value"
                                :selectOnFocus="true"
                                v-model="manualEntry"
                                @keyup.enter.native="submit(manualEntry)"
                            />
                            <button class="primary full-width" style="margin-top: 8px;" @click="submit(manualEntry)">
                                <span>Save custom value</span>
                            </button>
                        </div>
                    </label>
                </template>
            </div>

            <div
                class="option unset-option"
                v-if="unsetOption && optionsFlat.length == optionsFilteredFlat.length"
                @click="onUnset"
            >
                <label tabindex="0" @keydown.enter.exact="onUnset" @keydown.enter.ctrl="submit()">
                    <i class="far fa-trash-alt"></i>
                    <div class="label">
                        {{ unsetOption }}
                    </div>
                </label>
            </div>

            <template v-if="multipleOptionArrays">
                <div
                    class="option-group"
                    v-for="(optionGroup, optionGroupIndex) in optionsFilteredBySearch"
                    :key="optionGroupIndex"
                >
                    <h4>{{ optionGroupNameKey != null ? optionGroup[optionGroupNameKey] : `group-${index + 1}` }}</h4>
                    <div
                        class="option"
                        v-for="(option, index) in optionGroupOptionsKey
                            ? optionGroup[optionGroupOptionsKey]
                            : optionGroup"
                        :key="index"
                        :class="[
                            { 'has-description': optionDescriptionKey },
                            {
                                active:
                                    selection != null &&
                                    (type == 'radio'
                                        ? option[optionValueKey]
                                            ? option[optionValueKey] == selection
                                            : option == selection
                                        : option[optionValueKey]
                                        ? selection.includes(option[optionValueKey])
                                        : selection.includes(selection)),
                            },
                        ]"
                    >
                        <label tabindex="0" @keydown.enter.exact="onEnter(index)" @keydown.enter.ctrl="submit">
                            <BaseRadiobox
                                v-if="type == 'radio'"
                                ref="selectBox"
                                :uniqueKey="uniqueKey"
                                :value="optionValueKey ? option[optionValueKey] : option"
                                :modelValue="selection"
                                v-model="selection"
                                :groupIndex="optionGroupIndex"
                                :selectedGroupIndex="selectedGroupIndex"
                                @change="change($event, optionGroup, index)"
                            />
                            <BaseCheckbox
                                v-else
                                ref="selectBox"
                                :uniqueKey="uniqueKey"
                                :value="optionValueKey ? option[optionValueKey] : option"
                                :modelValue="selection"
                                v-model="selection"
                                :groupIndex="optionGroupIndex"
                                :selectedGroupIndex="selectedGroupIndex"
                                @change="change($event, optionGroup, index)"
                            />

                            <div class="label">
                                <slot name="before" :option="option" :index="index" />
                                <template v-if="optionNameKey">
                                    {{
                                        displayFunction ? displayFunction(option[optionNameKey]) : option[optionNameKey]
                                    }}
                                </template>
                                <template v-else>
                                    {{ displayFunction ? displayFunction(option) : option }}
                                </template>
                                <p class="description" v-if="optionDescriptionKey">
                                    {{ optionGroup[optionDescriptionKey] }}
                                </p>
                                <slot name="after" :option="option" :index="index" />
                            </div>
                        </label>
                    </div>
                </div>
            </template>

            <template v-else>
                <div
                    class="option"
                    v-for="(option, index) in optionsFilteredBySearch"
                    :key="index"
                    :class="[
                        { 'has-description': optionDescriptionKey },
                        {
                            active:
                                selection != null &&
                                (type == 'radio'
                                    ? option[optionValueKey]
                                        ? option[optionValueKey] == selection
                                        : option == selection
                                    : option[optionValueKey]
                                    ? selection.includes(option[optionValueKey])
                                    : selection.includes(selection)),
                        },
                    ]"
                >
                    <label tabindex="0" @keydown.enter.exact="onEnter(index)" @keydown.enter.ctrl="submit">
                        <BaseRadiobox
                            v-if="type == 'radio'"
                            ref="selectBox"
                            :uniqueKey="uniqueKey"
                            :value="
                                optionValueKey ? (optionValueKey == 'index' ? index : option[optionValueKey]) : option
                            "
                            v-model="selection"
                            @change="change"
                        />
                        <BaseCheckbox
                            v-else
                            ref="selectBox"
                            :uniqueKey="uniqueKey"
                            :value="
                                optionValueKey ? (optionValueKey == 'index' ? index : option[optionValueKey]) : option
                            "
                            :modelValue="selection"
                            v-model="selection"
                            @change="change"
                        />

                        <div class="label">
                            <slot name="before" :option="option" :index="index" />
                            <template v-if="labelPrefix">
                                <span v-html="labelPrefix" style="margin-right: 4px"></span>
                            </template>
                            <template v-if="optionNameKey">
                                {{ displayFunction ? displayFunction(option[optionNameKey]) : option[optionNameKey] }}
                            </template>
                            <template v-else>
                                {{ displayFunction ? displayFunction(option) : option }}
                            </template>
                            <p class="description" v-if="optionDescriptionKey">
                                {{ option[optionDescriptionKey] }}
                            </p>
                            <slot name="after" :option="option" :index="index" />
                        </div>
                    </label>
                </div>
            </template>

            <blockquote v-if="!options || options.length <= 0">No options available</blockquote>
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
        'uniqueKey',
        'search',
        'submitOnChange',
        'emitOnChange',
        'multipleOptionArrays',
        'optionGroupNameKey',
        'optionGroupOptionsKey',
        'unsetOption',
        'unsetValue',
        'value',
        'groupIndex',
        'labelPrefix',
        'allowManualEntry',
        'displayFunction',
        'focusSearchOnMount',
        'cloneOptionOnSubmit',
    ],
    data: function() {
        return {
            selection: [],
            optionGroup: null,
            searchString: '',
            optionsFilteredBySearch: this.options,
            manualEntryActive: false,
            manualEntry: '',
            selectedGroupIndex: null,
        }
    },
    computed: {
        searchKey() {
            const nameKey = this.optionNameKey
            const valueKey = this.optionValueKey
            return [
                this.optionNameKey,
                this.optionValueKey,
                this.optionDescriptionKey,
                this.optionGroupOptionsKey,
                this.optionGroupNameKey,
            ]
        },
        optionsFlat() {
            if (!this.multipleOptionArrays || !this.optionGroupOptionsKey) return this.options
            const options = []
            this.options.map(optionGroup => {
                options.push(...optionGroup[this.optionGroupOptionsKey])
            })
            return options
        },
        optionsFilteredFlat() {
            if (!this.multipleOptionArrays || !this.optionGroupOptionsKey) return this.optionsFilteredBySearch
            const options = []
            this.optionsFilteredBySearch.map(optionGroup => {
                options.push(...optionGroup[this.optionGroupOptionsKey])
            })
            return options
        },
        submitSearchAsManualEntryAvailable() {
            return (
                this.allowManualEntry &&
                this.searchString &&
                (this.searchString.length >= 3 || this.optionsFilteredFlat.length <= 0)
            )
        },
    },
    watch: {
        // Watch for external changes to the value
        value: function(newVal, oldVal) {
            // Preset the selection to the current option
            this.selection = this.value
        },
        // Watch for changes to the options and reset the optionsFilteredBySearch
        options: function(newVal, oldVal) {
            this.optionsFilteredBySearch = newVal
        },
    },
    methods: {
        submit(customValue) {
            let valueToEmit = customValue ? customValue : this.selection
            if (this.cloneOptionOnSubmit) valueToEmit = JSON.parse(JSON.stringify(valueToEmit))

            this.$emit('input', valueToEmit, this.optionGroup)
            this.$emit('submit', valueToEmit, this.optionGroup)
            if (customValue) {
                this.$emit('custom-entry', true)
            }
        },
        change(option, optionGroup, optionGroupIndex) {
            if (optionGroup) this.optionGroup = optionGroup
            if (optionGroupIndex) this.selectedGroupIndex = optionGroupIndex
            let valueToEmit = this.selection
            if (this.cloneOptionOnSubmit) valueToEmit = JSON.parse(JSON.stringify(valueToEmit))
            this.$emit('change', valueToEmit)
            if (this.emitOnChange) {
                this.$emit('input', valueToEmit)
            }
            if (this.submitOnChange) {
                this.submit()
            }
        },
        clear() {
            this.selection = []
            this.$emit('input', this.selection)
        },
        focusSearch() {
            if (this.search) {
                this.$refs.searchField.setFocus()
            }
        },
        onUnset() {
            if (typeof this.unsetValue != 'undefined') this.selection = this.unsetValue
            this.$emit('unset')
        },
        onSearchEnterKeypress() {
            if (this.submitSearchAsManualEntryAvailable) {
                this.submit(this.searchString)
            } else {
                if (!this.$refs.selectBox[0]) return
                this.$refs.selectBox[0].check()
            }
        },
        onEnter(index) {
            const selectbox = this.$refs.selectBox[index]
            selectbox.check()
        },
        onActivateManualEntry() {
            this.manualEntryActive = true
            this.manualEntry = this.searchString
            this.$nextTick(() => {
                this.$refs.manualEntryField.focus()
            })
        },
        onSearch(result, searchString) {
            this.searchString = searchString
        },
    },
    mounted() {
        this.focusSearch()
        // Preset the selection to the current option
        this.selection = this.value
        this.selectedGroupIndex = this.groupIndex
    },
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
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    .option-group {
        padding-top: 16px;
        margin-top: 8px;
        h4 {
            margin: 0;
            margin-bottom: 8px;
            background: $primary;
            color: white;
            font-size: 12px;
            padding: 8px 24px 8px 16px;
            max-width: 90%;
            display: inline-block;
            border-radius: 0 50px 50px 0;
            line-height: 1.4;
            box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
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
                width: 100%;
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
        &:hover,
        &.active {
            background: $bgModuleActive;
        }
        &.has-description {
            label {
                align-items: flex-start;
                .radiobox,
                .checkbox {
                    margin-top: 4px;
                }
            }
        }
        &:hover {
            .checkmark {
                border: solid 2px $primary;
            }
            input[type='checkbox'] {
                &:checked + .checkmark {
                    i {
                        &::before {
                            content: '\f068';
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
    input[type='checkbox'] {
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
        width: 22px;
        margin-right: 10px;
        text-align: center;
    }
}
</style>
