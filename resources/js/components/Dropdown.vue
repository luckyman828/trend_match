<template>
    <div class="dropdown-wrapper">

        <slot name="button" :toggle="toggle" :collapsed="collapsed">
            <span class="button" @click="toggle">Open dropdown</span>
        </slot>

        <div class="overlay invisible" :class="{active: !collapsed}" @click="toggle"></div>

        <div class="dropdown" :class="{collapsed: collapsed}" ref="dropdown">
            <div class="inner">
                <div class="header">
                    <slot name="header" :toggle="toggle"></slot>
                </div>
                <div class="body">
                    <slot name="body" :toggle="toggle"></slot>
                </div>
                <div class="footer">
                    <slot name="footer" :toggle="toggle"></slot>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'dropdown',
    data: function () { return {
        collapsed: true,
    }},
    methods: {
        toggle() {
            this.collapsed = !this.collapsed
        },
        // Set the height of the component
        setHeight() {
            const offset = 4
            const el = this.$refs.dropdown
            const parent = el.closest('.dropdown-parent')
            if (parent != null)
                el.style.cssText = `top: ${parent.getBoundingClientRect().height + offset}px; max-height: ${el.scrollHeight}px;`
            else el.style.cssText = `max-height: ${el.scrollHeight}px;`
        }
    },
    mounted() {
        this.setHeight()
    },
    updated() {
        this.setHeight()
    },
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';


</style>