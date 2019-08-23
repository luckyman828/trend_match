<template>
    <div class="team-dropdown dropdown collapsed">
        <div class="header">
            <span>{{options.length}} {{title}}</span>
            <span class="close"><i class="fal fa-times"></i></span>
        </div>
        <div class="body">
            <div class="radio-buttons">
                <label v-for="(option, index) in options" :key="index">
                    <input type="radio" name="radio-option" :id="'radio-option-' + option.id" :value="option.id" v-model="selection">
                    <span class="radio-mark"></span>
                    {{option.title}}
                </label>
            </div>
        </div>
        <div class="footer">
            <div class="grid-2 small-gap">
                <span class="button green" @click="submitDropdown">Save</span>
                <span class="button invisible" @click="closeModal">Cancel</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'dropdown',
    props: [
        'title',
        'options',
        'currentOptionId'
    ],
    data: function () { return {
        selection: ''
    }},
    methods: {
        submitDropdown() {
            this.$emit('onSubmit', this.selection)
            this.$emit('onClose')
        },
        closeModal() {
            this.$emit('onClose')
        }
    },
    mounted() {
        // Set the height of the component
        const el = this.$el
        const parent = el.closest('.dropdown-parent')
        if (parent != null)
            el.style.cssText = `top: ${parent.scrollHeight}px; max-height: ${el.scrollHeight}px;`
        else el.style.cssText = `max-height: ${el.scrollHeight}px;`
        el.classList.remove('collapsed')

        // Preset the selection
        document.querySelector('#radio-option-' + this.currentOptionId).checked = true
    },
    beforeDestroy() {
        // Set the height of the component
        const el = this.$el
        el.classList.add('collapsed')
    },
    destroyed() {
    }
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';


</style>