<template>
    <div class="dropdown-wrapper" ref="wrapper">

        <div class="dropdown-trigger" ref="trigger">
            <slot name="button" :toggle="toggle" :collapsed="collapsed">
                <span class="button" @click="toggle">Open dropdown</span>
            </slot>
        </div>

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
    name: 'dropdownV2',
    data: function () { return {
        collapsed: true,
    }},
    methods: {
        toggle() {
            // Set the height if the dropdown is being shown
            if (this.collapsed) this.setHeight()
            
            this.collapsed = !this.collapsed
        },
        // Set the height of the component
        setHeight() {
            const el = this.$refs.dropdown
            const trigger = this.$refs.trigger
            const offset = 8
            console.log(trigger.scrollHeight)
            el.style.cssText = `top: ${trigger.scrollHeight + offset}px; max-height: ${el.scrollHeight}px;`

        }
    },
    mounted() {
        this.setHeight()
    },
    updated() {
        // this.setHeight()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .dropdown-wrapper {
        position: relative;
        &.right .dropdown {
            left: auto;
            right: 0;
            transform: none;
        }
        &.left .dropdown {
            left: 0;
            right: auto;
            transform: none;
        }
    }
    .dropdown {
        position: absolute;
        width: fit-content;
        left: 50%;
        transform: translateX(-50%);
    }

</style>