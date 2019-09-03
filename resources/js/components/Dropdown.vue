<template>
    <div class="dropdown-wrapper" ref="wrapper">

        <slot name="button" :toggle="toggle" :collapsed="collapsed">
            <!-- <span class="button" @click="toggle">Open dropdown</span> -->
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
        getPosition(element) {
            var xPosition = 0;
            var yPosition = 0;

            while(element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }

            return { x: xPosition, y: yPosition };
        },
        // Set the height of the component
        setHeight() {
            const offset = 4
            const el = this.$refs.dropdown
            const parent = el.closest('.dropdown-parent')
            const wrapper = this.$refs.wrapper

            const parentPos = this.getPosition(parent)
            const parentTop = parentPos.y
            const parentLeft = parentPos.x
            const parentHeight = parent.getBoundingClientRect().height
            const parentWidth = parent.getBoundingClientRect().width
            const elHeight = el.getBoundingClientRect().height
            const elWidth = el.getBoundingClientRect().width

            // Align the dropdown after the parent
            if (parent != null) {
                console.log('Top: ' + parentTop);
                console.log('Left: ' + parentLeft);
                // Top + Right align
                if (wrapper.classList.contains('right'))
                    el.style.cssText = `top: ${parentTop + parentHeight + offset}px; left: ${parentLeft + parentWidth - elWidth + offset}px ;max-height: ${el.scrollHeight}px;`

                // Top + Left align
                else
                    el.style.cssText = `top: ${parentTop + parentHeight + offset}px; left: ${parentLeft - offset}px ;max-height: ${el.scrollHeight}px;`
            }
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

    .dropdown {
        position: fixed;
        width: fit-content;
    }

</style>