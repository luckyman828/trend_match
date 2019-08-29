<template>
    <div class="dropdown-wrapper" v-if="currentOption != null">

        <slot name="button" :toggle="toggle" :collapsed="collapsed" :currentOption="currentOption">
            <span class="button" @click="toggle">Open dropdown</span>
        </slot>

        <div class="dropdown radio-dropdown" :class="{collapsed: collapsed}" ref="dropdown">
            <div class="inner">
                <div class="header">
                    <span>{{currentOption.title}}</span>
                </div>
                <div class="body">
                    <div class="radio-buttons">
                        <label v-for="(option, index) in optionsToShow" :key="index" @click="submit(option.id)" :class="{active: option.id == currentOptionId}" class="radiobox">
                            {{option.title}}
                        </label>
                    </div>
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
        'currentOptionId',
        'defaultOption'
    ],
    data: function () { return {
        collapsed: true,
    }},
    computed: {
        optionsToShow () {
            const optionsToShow = this.options
            if (this.defaultOption != null)
                optionsToShow.unshift(this.defaultOption)
            return optionsToShow
        },
        currentOption () {
            if (this.optionsToShow[0] != null) {
                if (this.optionsToShow[0].title != null) {
                    const found = this.optionsToShow.find(x => x.id == this.currentOptionId)
                    if (found)
                        return found
                    else return {title: 'Set filter'}
                }
            }
            else return {title: 'Fetcing..'}
        }
    },
    methods: {
        submit(id) {
            this.$emit('submit', id)
            this.$emit('input', id)
            this.collapsed = true;
        },
        toggle() {
            this.collapsed = !this.collapsed;
        }
    },
    updated() {
        // Set the height of the component
        const offset = 4
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