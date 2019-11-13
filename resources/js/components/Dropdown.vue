<template>
    <div class="dropdown-wrapper" ref="wrapper">

        <slot name="button" :toggle="toggle" :collapsed="collapsed">
            <span class="button" @click="toggle">Open dropdown</span>
        </slot>

        <div class="overlay invisible" :class="{active: !collapsed}" @click="toggle"></div>

        <div class="dropdown" :class="[{collapsed: collapsed}, {above: showAbove}]" ref="dropdown">
            <div class="inner">
                <div v-if="$scopedSlots.header" class="header">
                    <slot name="header" :toggle="toggle"></slot>
                </div>
                <div class="body">
                    <slot name="body" :toggle="toggle"></slot>
                </div>
                <div v-if="$scopedSlots.footer" class="footer">
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
        showAbove: false,
    }},
    methods: {
        toggle() {
            // Set the height if the dropdown is being shown
            if (this.collapsed) {
                this.setPos()
                this.setHeight()
            }
            
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
            const el = this.$refs.dropdown
            el.style.maxHeight = el.scrollHeight + 'px'

        },
        setPos() {
            const offset = 8
            const el = this.$refs.dropdown

            const wrapper = this.$refs.wrapper
            // const parent = el.closest('.dropdown-parent') // Use set element as parent

            // First look for a parent inside the dropdown, then look for a parent outside
            const parent = ( wrapper.querySelector('.dropdown-parent') ) ? wrapper.querySelector('.dropdown-parent') : el.closest('.dropdown-parent') ? el.closest('.dropdown-parent') : wrapper

            const parentPos = this.getPosition(parent)
            const parentTop = parentPos.y
            const parentLeft = parentPos.x
            const parentHeight = parent.getBoundingClientRect().height
            const parentWidth = parent.getBoundingClientRect().width
            const elHeight = el.scrollHeight
            const elWidth = el.getBoundingClientRect().width
            const elRect = el.getBoundingClientRect()
            const parentRect = parent.getBoundingClientRect()

            // Show above or below depending on space available
            const windownHeight = window.innerHeight
            const distToBottom = parentTop + parentHeight + elHeight
            const bottomSpace = windownHeight - distToBottom
            const bottomOffset = 100;
            const showAbove = bottomSpace < 10
            this.showAbove = showAbove

            // const bottomDist = windownHeight - parentTop
            const bottomDist = windownHeight - parentRect.top

            // Align the dropdown after the parent
            if (parent != null) {

                // Set top distance
                if (showAbove) {
                    el.style.bottom = `${bottomDist + offset}px`
                    el.style.top = 'auto'
                } else {
                    el.style.top = `${parentRect.bottom + offset}px`
                    el.style.bottom = 'auto'
                }


                // Top + Right align
                if (wrapper.classList.contains('right'))
                    el.style.left = `${parentLeft + parentWidth - elWidth + offset}px`
                    // el.style.cssText = `top: ${parentRect.bottom + offset}px; left: ${parentLeft + parentWidth - elWidth + offset}px ;max-height: ${el.scrollHeight}px;`

                // Top + Left align
                else if (wrapper.classList.contains('left'))
                    el.style.left = `${parentLeft - offset}px`
                    // el.style.cssText = `top: ${parentRect.bottom + offset}px; left: ${parentLeft - offset}px ;max-height: ${el.scrollHeight}px;`
                
                // Top + Center align (DEFAULT)
                else el.style.left = `${parentRect.left + ( parentWidth / 2 ) - ( elWidth / 2 ) }px`

                // Set the max height of the tooltip
                // if (showAbove) {
                //     console.log('show above!')
                //     console.log(el)
                //     console.log(el.classList)
                //     el.classList.add('above')
                //     this.$nextTick(() => {
                //         console.log(el.classList)
                //         el.classList.add('above')
                //         console.log(el.classList)
                //     })
                // } else {
                //     console.log('remove above?')
                //     el.classList.remove('above')
                // }
            }
        },
        handleScroll() {
            if (!this.collapsed) {
                this.setPos()
            }
        }
    },
    created () {
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';

    .dropdown {
        position: fixed;
        width: fit-content;
    }

</style>