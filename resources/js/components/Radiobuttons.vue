<template>

    <div class="radio-buttons">
        <div class="search" v-if="search">
            <input class="input-wrapper small" placeholder="Search by e-mail.." type="search" v-model="searchString" ref="searchField">
            <span v-if="searchString.length > 0" class="close" @click="searchString = ''">
                <i class="fas fa-times"></i>
            </span>
        </div>
        <label v-for="(option, index) in optionsFiltered" :key="index" class="radiobox">
            <input v-if="optionValueKey" type="radio" name="radio-option" :ref="'radio-option-' + option.id" :id="'radio-option-' + option.id" :value="option[optionValueKey]" v-model="selection" @change="change()" @click="click">
            <input v-else type="radio" name="radio-option" :ref="'radio-option-' + option.id" :id="'radio-option-' + option.id" :value="option" v-model="selection" @change="change()" @click="click">
            <span class="radiomark"></span>
            <template v-if="optionNameKey">
                {{option[optionNameKey]}}
            </template>
            <template v-else>
                {{option}}
            </template>
        </label>
    </div>

</template>

<script>
export default {
    name: 'radioButtons',
    props: [
        'options',
        'optionNameKey',
        'optionValueKey',
        'currentOptionId',
        'search'
    ],
    data: function () { return {
        selection: null,
        searchString: '',
    }},
    watch: {
        currentOptionId(newVal, oldVal) {
            this.update()
        }
    },
    computed: {
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
        },
        click() {
            this.$emit('onClick', this.selection)
        },
        clear () {
            console.log('clear!')
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
            if (this.currentOptionId)
                if (this.optionValueKey) {
                    this.selection = this.options.find(x => x.id == this.currentOptionId)[this.optionValueKey]
                }
                else {
                    this.selection = this.options.find(x => x.id == this.currentOptionId)
                }
        }
    },
    mounted() {
        this.update()
    }
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';

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