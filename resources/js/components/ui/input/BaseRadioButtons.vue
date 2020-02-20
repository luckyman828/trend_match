<template>

    <div class="radio-buttons">
        <div class="search" v-if="search">
            <input class="input-wrapper small" placeholder="Search.." type="search" v-model="searchString" ref="searchField"
            @click.stop>
            <span v-if="searchString.length > 0" class="close" @click="searchString = ''">
                <i class="fas fa-times"></i>
            </span>
        </div>
        <div class="wrapper">
            <div class="option" v-for="(option, index) in optionsFiltered" :key="index" 
            :class="[{'has-description': optionDescriptionKey}, {'active': option[optionValueKey] ? option[optionValueKey] == selection : option == selection}]">
                <label class="radiobox">
                    <input v-if="optionValueKey" type="radio" name="radio-option" :ref="'radio-option-' + option.id" :id="'radio-option-' + option.id" :value="option[optionValueKey]" v-model="selection" @change="change()" @click="click">
                    <input v-else type="radio" name="radio-option" :ref="'radio-option-' + option.id" :id="'radio-option-' + option.id" :value="option" v-model="selection" @change="change()" @click="click">
                    <span class="radiomark"></span>
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
    name: 'radioButtons',
    props: [
        'options',
        'optionNameKey',
        'optionValueKey',
        'optionDescriptionKey',
        'currentOptionId',
        'search',
        'submitOnChange'
    ],
    data: function () { return {
        selection: null,
        searchString: '',
        // currentOption
    }},
    watch: {
        currentOptionId(newVal, oldVal) {
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
        optionsFiltered() {
            const options = this.options
            const searchString = this.searchString.toLowerCase()
            let optionsToReturn = []
            if (searchString) {
                if (this.optionNameKey) {
                    optionsToReturn= options.filter(x => x[this.optionNameKey].toLowerCase().startsWith(searchString))
                } else if (this.optionValueKey) {
                    optionsToReturn= options.filter(x => x[this.optionValueKey].toLowerCase().startsWith(searchString))
                } else {
                    optionsToReturn= options.filter(x => x.toLowerCase().startsWith(searchString))
                }
            } 
            else optionsToReturn = options
            return optionsToReturn
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
            document.querySelectorAll('input[type=radio]').forEach(input => {
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
            if (this.currentOptionId != null)
                if (this.optionValueKey) {
                    this.selection = this.options.find(x => x.id == this.currentOptionId)[this.optionValueKey]
                }
                else {
                    this.selection = this.options.find(x => x == this.currentOptionId)
                }
        }
    },
    mounted() {
        this.update()
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .radio-buttons .wrapper {
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
                max-width: 200px;
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
        }
    }
    .radiobox {
        font-weight: 500;
        &:hover {
            background: $bgContentActive;
            .radiomark {
                border-color: $primary;
            }
        }
        .radiomark {
            border: solid 2px $fontIcon;
            height: 20px;
            width: 20px;
            min-width: 20px;
            margin-right: 10px;
        }
        input:checked + .radiomark {
            border: solid 7px $primary;
            &::after {
                content: none;
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

</style>