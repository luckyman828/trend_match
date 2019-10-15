<template>
    <div class="dropdown-wrapper" ref="wrapper">

        <slot name="button" :toggle="toggle" :collapsed="collapsed" rel="test">
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
            // Set the height if the dropdown is being shown
            if (this.collapsed) this.setHeight()
            
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
            const offset = 8
            const el = this.$refs.dropdown

            const wrapper = this.$refs.wrapper
            // const parent = el.closest('.dropdown-parent') // Use set element as parent

            // First look for a parent inside the dropdown, then look for a parent outside
            const parent = ( wrapper.querySelector('.dropdown-parent') ) ? wrapper.querySelector('.dropdown-parent') : el.closest('.dropdown-parent')

            const parentPos = this.getPosition(parent)
            const parentTop = parentPos.y
            const parentLeft = parentPos.x
            const parentHeight = parent.getBoundingClientRect().height
            const parentWidth = parent.getBoundingClientRect().width
            const elHeight = el.getBoundingClientRect().height
            const elWidth = el.getBoundingClientRect().width
            const elRect = el.getBoundingClientRect()
            const parentRect = parent.getBoundingClientRect()

            // // Align the dropdown after the parent
            // if (parent != null) {
            //     // Top + Right align
            //     if (wrapper.classList.contains('right'))
            //         el.style.cssText = `top: ${parentTop + parentHeight + offset}px; left: ${parentLeft + parentWidth - elWidth + offset}px ;max-height: ${el.scrollHeight}px;`

            //     // Top + Left align
            //     else if (wrapper.classList.contains('left'))
            //         el.style.cssText = `top: ${parentTop + parentHeight + offset}px; left: ${parentLeft - offset}px ;max-height: ${el.scrollHeight}px;`
                
            //     // Top + Center align (DEFAULT)
            //     else
            //         el.style.cssText = `top: ${parentTop + parentHeight + offset}px; left: ${parentLeft + ( parentWidth / 2 ) - ( elWidth / 2 ) }px ;max-height: ${el.scrollHeight}px;`
            // }
            // else el.style.cssText = `max-height: ${el.scrollHeight}px;`

            // Align the dropdown after the parent
            if (parent != null) {
                // Top + Right align
                if (wrapper.classList.contains('right'))
                    el.style.cssText = `top: ${parentRect.bottom + offset}px; left: ${parentLeft + parentWidth - elWidth + offset}px ;max-height: ${el.scrollHeight}px;`
                    // el.style.cssText = `top: ${parentTop + parentHeight + offset}px; left: ${parentLeft + parentWidth - elWidth + offset}px ;max-height: ${el.scrollHeight}px;`

                // Top + Left align
                else if (wrapper.classList.contains('left'))
                    el.style.cssText = `top: ${parentRect.bottom + offset}px; left: ${parentLeft - offset}px ;max-height: ${el.scrollHeight}px;`
                    // el.style.cssText = `top: ${parentTop + parentHeight + offset}px; left: ${parentLeft - offset}px ;max-height: ${el.scrollHeight}px;`
                
                // Top + Center align (DEFAULT)
                else {
                    el.style.cssText = `top: ${parentRect.bottom + offset}px; left: ${parentRect.left + ( parentWidth / 2 ) - ( elWidth / 2 ) }px ;max-height: ${el.scrollHeight}px;`
                    // el.style.cssText = `top: ${parentTop + parentHeight + offset}px; left: ${parentLeft + ( parentWidth / 2 ) - ( elWidth / 2 ) }px ;max-height: ${el.scrollHeight}px;`
                }
            }
            else el.style.cssText = `max-height: ${el.scrollHeight}px;`

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

<style scopes lang="scss">
@import '~@/_variables.scss';

    .dropdown {
        position: fixed;
        width: fit-content;
    }

</style>