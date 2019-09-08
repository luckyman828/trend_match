<template>
    <div class="tooltip-wrapper" ref="wrapper">

        <div class="tooltip-parent" ref="parent" @mouseenter="show" @mouseleave="hide">
            <slot name="parent" @mouseenter="test">
                <p>Show tooltip</p>
            </slot>
        </div>

        <div class="tooltip dark" :class="{hidden: hidden}" ref="tooltip">
            <div class="inner">
                <div class="header">
                    <slot name="header" :toggle="toggle"></slot>
                </div>
                <div class="body">
                    <slot name="body" :toggle="toggle"></slot>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'tooltipAlt',
    data: function () { return {
        hidden: true,
    }},
    methods: {
        test () {
            console.log('test')
        },
        toggle() {
            this.hidden = !this.hidden
        },
        hide() {
            this.hidden = true
            clearTimeout(this.showDelay)
        },
        show() {
            this.showDelay = setTimeout( () => {this.hidden = false}, 300)
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
            const offsetTop = 4
            const offsetLeft = 4
            const el = this.$refs.tooltip
            // const parent = el.closest('.has-tooltip')
            const parent = this.$refs.parent
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
                // Top + Right align
                if (wrapper.classList.contains('right'))
                    el.style.cssText = `top: ${parentTop + parentHeight + offsetTop}px; left: ${parentLeft + parentWidth - elWidth + offsetLeft}px;`

                // Top + Left align
                else
                    el.style.cssText = `top: ${parentTop + parentHeight + offsetTop}px; left: ${parentLeft - offsetLeft}px;`
            }
        },
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

    .tooltip-parent {
        &:hover {
            cursor: pointer;
        }
    }

</style>