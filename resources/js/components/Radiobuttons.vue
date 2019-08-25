<template>

    <div class="radio-buttons">
        <label v-for="(option, index) in options" :key="index" class="radiobox">
            <input type="radio" name="radio-option" :id="'radio-option-' + option.id" :value="option.id" v-model="selection">
            <span class="radiomark"></span>
            {{option.title}}
        </label>
    </div>

</template>

<script>
export default {
    name: 'radioButtons',
    props: [
        'options',
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
        console.log('Updated. Selection: ' + !this.selection)
        if ( !this.selection )
            document.querySelector('#radio-option-' + this.currentOptionId).checked = true
    },
    mounted() {
        document.querySelector('#radio-option-' + this.currentOptionId).checked = true
    }
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';


</style>