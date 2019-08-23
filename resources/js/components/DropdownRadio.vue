<template>
    <div class="dropdown-wrapper" v-if="currentOption != null">

        <div class="dropdown-button" @click="collapsed = !collapsed">
              <img src="/assets/Path5699.svg">
              <span>{{currentOption.title}}</span>
              <i class="far fa-chevron-down"></i>
        </div>

        <div class="dropdown radio-dropdown" :class="{collapsed: collapsed}" ref="dropdown">
            <div class="header">
                <span>{{currentOption.title}}</span>
            </div>
            <div class="body">
                <div class="radio-buttons">
                    <label><slot/></label>
                    <label v-for="(option, index) in options" :key="index" @click="submitDropdown(option.id)" :class="{active: option.id == currentOptionId}">
                        {{option.title}}
                    </label>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'dropdownRadio',
    props: [
        'options',
        'currentOptionId'
    ],
    data: function () { return {
        collapsed: true,
    }},
    computed: {
        currentOption () {
            if (this.options[0] != null) {
                if (this.options[0].title != null) {
                    const found = this.options.find(x => x.id == this.currentOptionId)
                    if (found)
                        return found
                    else return {title: 'Set team filter'}
                }
            }
            else return {title: 'Set team filter'}
        }
    },
    methods: {
        submitDropdown(id) {
            this.$emit('onSubmit', id)
            this.collapsed = true;
        },
        close() {
            this.collapsed = true;
        }
    },
    updated() {
        // Set the height of the component
        const offset = 10
        const el = this.$refs.dropdown
        const parent = el.closest('.dropdown-wrapper')
        if (parent != null)
            el.style.cssText = `top: ${parent.getBoundingClientRect().height + offset}px; max-height: ${el.scrollHeight}px;`
        else el.style.cssText = `max-height: ${el.scrollHeight}px;`
    },
    destroyed() {
    }
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';


</style>