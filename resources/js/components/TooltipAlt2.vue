<template>
    <div class="tooltip-wrapper" ref="wrapper">

        <div class="tooltip-parent" ref="parent" @mouseenter="show" @mouseleave="hide">
            <slot><p>Show tooltip</p></slot>
        </div>

        <div class="tooltip dark" :class="{hidden: hidden}" ref="tooltip">

            <div class="arrow"></div>

            <div class="inner">

                <div class="header"  v-if="header != null" v-html="header"></div>

                <div class="body">

                    <span class="body-wrapper" v-if="body != null" v-html="body"></span>

                    <template v-if="array != null">
                        <p class="row" v-for="(row, index) in array" :key="index">
                            <template v-if="arrayLabelKey != null">
                                <span>{{row[arrayLabelKey]}}: </span>
                                <strong v-if="arrayValueKey != null">{{row[arrayValueKey]}}</strong>
                                <strong v-else>{{row}}</strong>
                            </template>
                            <template v-else>
                                <span v-if="arrayValueKey != null">{{row[arrayValueKey]}}</span>
                                <span v-else>{{row}}</span>
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
        'arrayValueKey'
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
            this.showDelay = setTimeout( () => {this.hidden = false}, this.showDelay)
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
            const offsetTop = 4
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
            // console.log(parent.getBoundingClientRect().top)
            // }
            const elHeight = el.getBoundingClientRect().height
            const elWidth = el.getBoundingClientRect().width

            // Align the dropdown after the parent
            if (parent != null) {
                // Top + Right align
                if (wrapper.classList.contains('right'))
                    el.style.cssText = `top: ${parentTop + parentHeight + offsetTop}px; left: ${parentLeft + parentWidth - elWidth + offsetLeft}px;`

                // Top + Left align
                else if (wrapper.classList.contains('left'))
                    el.style.cssText = `top: ${parentTop + parentHeight + offsetTop}px; left: ${parentLeft - offsetLeft}px;`

                // Top + Center align
                else
                    el.style.cssText = `top: ${parentTop + parentHeight + offsetTop}px; left: ${parentLeft + ( parentWidth / 2 ) - ( elWidth / 2 ) }px;`

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

<style scoped lang="scss">
@import '~@/_variables.scss';

    .tooltip-parent {
        &:hover {
            cursor: pointer;
        }
    }
    .body-wrapper {
        padding: 8px;
        display: block;
        font-size: 13px;
    }
    .flex-wrapper {
        display: flex;
        justify-content: space-between;
    }

</style>