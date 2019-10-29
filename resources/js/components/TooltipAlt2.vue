<template>
    <div class="tooltip-wrapper" ref="wrapper" @mouseleave="hide">

        <div class="tooltip-parent" ref="parent" @mouseenter="show">
            <slot><p>Show tooltip</p></slot>
        </div>

        <div v-if="!disabled" class="tooltip dark" :class="{hidden: hidden}" ref="tooltip">

            <div class="arrow"></div>

            <div class="inner">

                <div class="header"  v-if="header != null" v-html="header"></div>

                <div class="body" ref="body">

                    <span class="body-wrapper" v-if="body != null" v-html="body"></span>

                    <template v-if="array != null">
                        <p class="row" v-for="(row, index) in array" :key="index">
                            <template v-if="arrayLabelKey != null">
                                <span class="label">{{(row[arrayLabelKey]) ? row[arrayLabelKey] : 'No label'}}: </span>
                                <strong class="value" v-if="arrayValueKey != null">{{row[arrayValueKey]}}<template v-if="arrayValueUnit">{{arrayValueUnit}}</template></strong>
                                <strong class="value" v-else>{{row}}</strong>
                            </template>
                            <template v-else>
                                <span class="value" v-if="arrayValueKey != null">{{row[arrayValueKey]}}<template v-if="arrayValueUnit">{{arrayValueUnit}}</template></span>
                                <span class="value" v-else>{{row}}</span>
                            </template>
                        </p>
                    </template>

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
        showDelay: 300,
    }},
    props: [
        'header',
        'body',
        'array',
        'arrayLabelKey',
        'arrayValueKey',
        'arrayValueUnit',
        'disabled'
    ],
    methods: {
        toggle() {
            this.hidden = !this.hidden
        },
        hide() {
            this.hidden = true
            clearTimeout(this.showDelay)
        },
        show() {
            if (!this.disabled) {
                this.setHeight()
                this.showDelay = setTimeout( () => {this.hidden = false}, this.showDelay)
            }
        },
        // getPosition(element) {
        //     var xPosition = 0;
        //     var yPosition = 0;

        //     while(element) {
        //         xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        //         yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        //         element = element.offsetParent;
        //     }

        //     return { x: xPosition, y: yPosition };
        // },
        // Set the height of the component
        setHeight() {
            const offsetLeft = 4
            const el = this.$refs.tooltip
            // const parent = el.closest('.has-tooltip') // Use a set parent as parent
            // const parent = this.$refs.parent // Use the slots wrapper as parent
            const parent = this.$slots.default[0].elm // Use the slot as parent
            const wrapper = this.$refs.wrapper

            // if (parent != null) {
            // const parentPos = this.getPosition(parent)
            // const parentTop = parentPos.y
            // const parentLeft = parentPos.x
            const parentTop = parent.getBoundingClientRect().top
            const parentLeft = parent.getBoundingClientRect().left
            const parentHeight = parent.getBoundingClientRect().height
            const parentWidth = parent.getBoundingClientRect().width
            const parentRect = parent.getBoundingClientRect()
            // console.log(parent.getBoundingClientRect().top)
            // }
            const elHeight = el.getBoundingClientRect().height
            const elWidth = el.getBoundingClientRect().width

            // Check if the dropdown should be shown above or below the hovered item
            // console.log('Bottom dist: ' + parentTop + parentHeight + elHeight)
            // console.log('Window height: ' + window.innerHeight)
            // console.log('El height: ' + elHeight)
            const windownHeight = window.innerHeight


            const distToBottom = parentTop + parentHeight + elHeight
            const bottomSpace = windownHeight - distToBottom
            const bottomOffset = 100;
            const showAbove = bottomSpace < 50

            const topDist = parentTop + parentHeight
            const bottomDist = windownHeight - parentTop

            // Align the dropdown after the parent
            if (parent != null) {
                // Top + Right align
                if (wrapper.classList.contains('right')) {
                    if (!showAbove) {
                        el.style.cssText = `bottom: auto; top: ${topDist}px; left: ${parentLeft + parentWidth - elWidth + offsetLeft}px;`
                    } else {
                        el.style.cssText = `top: auto; bottom: ${bottomDist}px; left: ${parentLeft + parentWidth - elWidth + offsetLeft}px;`
                    }
                }
                // Top + Left align
                else if (wrapper.classList.contains('left')) {
                    if (!showAbove) {
                        el.style.cssText = `bottom: auto; top: ${topDist}px; left: ${parentLeft - offsetLeft}px;`
                    } else {
                        el.style.cssText = `top: auto; bottom: ${bottomDist}px; left: ${parentLeft - offsetLeft}px;`
                    }
                    
                }
                // Top + Center align
                else {
                    if (!showAbove) {
                        el.style.cssText = `bottom: auto; top: ${topDist}px; left: ${parentLeft + ( parentWidth / 2 ) - ( elWidth / 2 ) }px;`
                    } else {
                        el.style.cssText = `top: auto; bottom: ${bottomDist}px; left: ${parentLeft + ( parentWidth / 2 ) - ( elWidth / 2 ) }px;`
                    }
                }

            }

            // Set the max height of the tooltip
            if (showAbove) {
                el.classList.add('above')
                this.$refs.body.style.maxHeight = parentTop - bottomOffset  + 'px'
            } else {
                el.classList.remove('above')
                this.$refs.body.style.maxHeight = window.innerHeight - (parentTop + parentHeight) - bottomOffset  + 'px'
            }

        },
    },
    mounted() {
        if (!this.disabled)
            this.setHeight()

    },
    updated() {
        if (!this.disabled)
            this.setHeight()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .body-wrapper {
        padding: 8px;
        display: block;
        font-size: 13px;
    }
    .body {
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .flex-wrapper {
        display: flex;
        justify-content: space-between;
    }

</style>