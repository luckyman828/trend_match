<template>

    <div class="radio-buttons">
        <label v-for="(option, index) in options" :key="index" class="radiobox">
            <input v-if="optionValueKey" type="radio" name="radio-option" :id="'radio-option-' + option.id" :value="option[optionValueKey]" v-model="selection" @change="change()" @click="click">
            <input v-else type="radio" name="radio-option" :id="'radio-option-' + option.id" :value="option[optionValueKey]" v-model="selection" @change="change()" @click="click">
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
    ],
    data: function () { return {
        selection: null,
    }},
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
    },
    updated() {
        // Preset the selection
        if ( !this.selection )
            if (this.currentOptionId)
                if (document.querySelector('#radio-option-' + this.currentOptionId))
                    document.querySelector('#radio-option-' + this.currentOptionId).checked = true
    },
    mounted() {
        if (this.currentOptionId)
            if (document.querySelector('#radio-option-' + this.currentOptionId))
                document.querySelector('#radio-option-' + this.currentOptionId).checked = true
    }
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';


</style>