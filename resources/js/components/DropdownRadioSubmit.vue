<template>
    <div class="dropdown-wrapper" v-if="options != null">

        <slot name="button" :toggle="toggle" :collapsed="collapsed">
            <span class="button" @click="toggle">Open dropdown</span>
        </slot>

        <div class="team-dropdown dropdown" :class="{collapsed: collapsed}" ref="dropdown">
            <div class="header">
                <span>{{options.length}} {{title}}</span>
                <span class="close" @click="toggle"><i class="fal fa-times"></i></span>
            </div>
            <div class="body">
                <div class="radio-buttons">
                    <label v-for="(option, index) in options" :key="index" class="radiobox">
                        <input type="radio" name="radio-option" :id="'radio-option-' + option.id" :value="option.id" v-model="selection">
                        <span class="radiomark"></span>
                        {{option.title}}
                    </label>
                </div>
            </div>
            <div class="footer">
                <div class="grid-2 small-gap">
                    <span class="button green" @click="submit">Save</span>
                    <span class="button invisible" @click="toggle">Cancel</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'dropdownRadioSubmit',
    props: [
        'title',
        'options',
        'currentOptionId'
    ],
    data: function () { return {
        selection: '',
        collapsed: true,
    }},
    methods: {
        submit() {
            this.$emit('input', this.selection)
            this.toggle()
        },
        toggle() {
            this.collapsed = !this.collapsed
        }
    },
    updated() {
        // Set the height of the component
        const offset = 0
        const el = this.$refs.dropdown
        const parent = el.closest('.dropdown-parent')
        if (parent != null)
            el.style.cssText = `top: ${parent.getBoundingClientRect().height + offset}px; max-height: ${el.scrollHeight}px;`
        else el.style.cssText = `max-height: ${el.scrollHeight}px;`

        // Preset the selection
        document.querySelector('#radio-option-' + this.currentOptionId).checked = true
    },
    // mounted() {
    //     // Set the height of the component
    //     const el = this.$el
    //     const parent = el.closest('.dropdown-parent')
    //     console.log(parent)
    //     if (parent != null)
    //         el.style.cssText = `top: ${parent.scrollHeight}px; max-height: ${el.scrollHeight}px;`
    //     else el.style.cssText = `max-height: ${el.scrollHeight}px;`

    //     // Preset the selection
    //     document.querySelector('#radio-option-' + this.currentOptionId).checked = true
    // },
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';


</style>