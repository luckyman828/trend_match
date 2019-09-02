<template>

    <div class="radio-buttons">
        <label v-for="(option, index) in options" :key="index" class="radiobox">
            <input type="radio" name="radio-option" :id="'radio-option-' + option.id" :value="option[optionValueKey]" v-model="selection">
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
        'currentOptionId'
    ],
    data: function () { return {
        selection: null,
    }},
    methods: {
        submit() {
            this.$emit('input', this.selection)
        },
    },
    updated() {
        // Preset the selection
        if ( !this.selection )
            if (this.currentOptionId)
                document.querySelector('#radio-option-' + this.currentOptionId).checked = true
    },
    mounted() {
        if (this.currentOptionId)
            document.querySelector('#radio-option-' + this.currentOptionId).checked = true
    }
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';


</style>