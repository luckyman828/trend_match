<template>

    <div class="select-buttons" ref="selectButtons">
        <div class="search" v-if="search">
            <input class="input-wrapper small" placeholder="Search.." type="search" v-model="searchString" ref="searchField"
            @click.stop>
            <span v-if="searchString.length > 0" class="close" @click="searchString = ''">
                <i class="fas fa-times"></i>
            </span>
        </div>
        <div class="wrapper">

            <div class="option" v-for="(option, index) in optionsFilteredBySearch" :key="index" 
            :class="[{'has-description': optionDescriptionKey}, 
            {'active': type == 'radio' ? (option[optionValueKey] ? option[optionValueKey] == selection : option == selection) 
            : option[optionValueKey] ? selection.includes(option[optionValueKey]) : selection.includes(selection)}]">

                <label>
                    <template v-if="type == 'radio'">
                        <Radiobox :value="optionValueKey ? option[optionValueKey] : option" v-model="selection"/>
                    </template>
                    <template v-else>
                        <div class="checkbox">
                            <!-- <Checkbox :modelValue="optionValueKey ? option[optionValueKey] : option" v-model="selection"/> -->
                            <input type="checkbox" :value="optionValueKey ? option[optionValueKey] : option" v-model="selection">
                            <span class="checkmark solid"><i class="fas fa-check"></i></span>
                        </div>
                    </template>

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
        </div>
    </div>

</template>

<script>
export default {
    name: 'selectButtons',
    props: [
        'type',
        'options',
        'optionNameKey',
        'optionValueKey',
        'optionDescriptionKey',
        'activeOption',
        'search',
        'submitOnChange',
    ],
    data: function () { return {
        selection: [],
        searchString: '',
        // currentOption
    }},
    watch: {
        activeOption(newVal, oldVal) {
            this.update()
        }
    },
    computed: {
        valueChanged() {

        },
        currentOption () {
            if (this.selection != null) {
                if (this.optionValueKey != null) {
                    if ( this.options.find(x => x[this.optionValueKey] == this.selection) ) {
                        if (this.optionNameKey != null) {
                            return this.options.find(x => x[this.optionValueKey] == this.selection)[this.optionNameKey]
                        }
                        else return this.selection
                    }
                    else return 'select b'
                }
                else {
                    if ( this.options.find(x => x == this.selection) ) {
                        if (this.optionNameKey != null) {
                            return this.options.find(x => x == this.selection)[this.optionNameKey]
                        }
                        else return this.selection
                    }
                    else return 'select a'
                }
            }
            else return 'nothing'
        },
        optionsFilteredBySearch() {
            const options = this.options
            const searchString = this.searchString.toLowerCase()
            if (!searchString) {
                return options
            }
            else {
                let optionsToReturn = []
                if (this.optionNameKey) {
                    optionsToReturn= options.filter(x => x[this.optionNameKey].toLowerCase().search(searchString))
                } else if (this.optionValueKey) {
                    optionsToReturn= options.filter(x => x[this.optionValueKey].toLowerCase().search(searchString))
                } else {
                    optionsToReturn= options.filter(x => x.toLowerCase().search(searchString))
                }
                return optionsToReturn
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
                this.$emit('input', this.selection)
                this.$emit('submit', this.selection)
            }
        },
        click() {
            this.$emit('onClick', this.selection)
        },
        clear () {
            this.selection = []
            this.$refs.selectButtons.querySelectorAll('input[type=radio]').forEach(input => {
                input.checked = false
            })
            this.$emit('input', this.selected)
        },
        focusSearch() {
            if (this.search) {
                this.$refs.searchField.focus()
            }
        },
        update() {
            // Preset the selection
            // if (this.activeOption)
            //     if (this.optionValueKey) {
            //         this.selection = this.options.find(x => x.id == this.activeOption)[this.optionValueKey]
            //     }
            //     else {
            //         this.selection = this.options.find(x => x == this.activeOption)
            //     }
        }
    },
    mounted() {
        this.update()
        this.focusSearch()
    },
    created() {
        // If the type is checkboxes, set the selection to an array
        if (this.type != 'radio') this.selection = [] 
    }
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';

    .select-buttons .wrapper {
        max-height: 260px;
        overflow: auto;
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
            }
            .description {
                font-size: 12px;
                font-weight: 400;
                margin-top: -4px;
            }
            &:hover, &.active {
                background: $bgContentActive;
            }
            &.has-description {
                label {
                    align-items: flex-start;
                    .radiomark {
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
    .search {
        padding: 8px;
        position: relative;
        input.input-wrapper.small {
            padding-right: 32px;
            box-sizing: border-box;
        }
        .close {
            position: absolute;
            right: 8px;
            top: 11px;
            font-size: 12px;
            color: $dark05;
            cursor: pointer;
            padding: 4px 12px;
            &:hover {
                opacity: .8;
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

</style>