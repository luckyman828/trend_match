import Vue from 'vue'
import Popper from 'popper.js'
import Tooltip from './components/Tooltip.vue'

const MyTooltip = Vue.extend(Tooltip)

const tooltipDirective = {}
tooltipDirective.install = Vue => {
    Vue.directive('tooltip', {
        bind: function(el, binding, vnode) {
            const textExr = analyzeText(el, binding)
            if (!textExr) return

            const { placement, customStyle: customStyleExr } = analyzeModifiers(el, binding)

            const vm = vnode.context
            const tooltip = new MyTooltip({
                el: document.createElement('div'),
                data: {
                    text: (vm && vm[textExr]) || textExr,
                    customStyle: (vm && vm[customStyleExr]) || customStyleExr,
                },
            })

            el.instance = tooltip
            el.tooltip = tooltip.$el
            addEvents(el, binding, placement)
        },

        unbind: function(el, binding) {
            if (el.domInserted) {
                if (el.tooltip && el.tooltip.parentNode) {
                    el.tooltip.parentNode.removeChild(el.tooltip)
                }
            }
            el.instance && el.instance.$destroy()
        },
    })

    const analyzeModifiers = (el, binding) => {
        const POSITIONS = ['top', 'left', 'right', 'bottom']

        let [placement = 'bottom', customStyle = ''] = []
        for (const item in binding.modifiers) {
            if (POSITIONS.includes(item)) {
                placement = item
            } else {
                customStyle = item
            }
        }
        return {
            placement,
            customStyle,
        }
    }

    const analyzeText = (el, binding) => {
        const value = binding.value
        const title = el.getAttribute('title')

        let textExr = ''
        if (!value) {
            const hasTitle = title && typeof title === 'string'
            if (!hasTitle) return false

            textExr = title // automatically convert all the title to tooltip
            el.setAttribute('title', '')
        } else {
            textExr = value
        }

        return textExr
    }

    const addEvents = (el, binding, placement) => {
        const addTooltip = e => {
            document.body.appendChild(el.tooltip)
            Vue.nextTick(() => {
                new Popper(el, el.tooltip, {
                    placement,
                })
            })
            el.instance.visible = true
        }

        const hideTooltip = () => {
            el.instance.visible = false
        }

        const removeTooltip = e => {
            if (!el.instance.visible) {
                document.body.removeChild(el.tooltip)
            }
        }

        el.addEventListener('mouseenter', addTooltip, false)
        el.addEventListener('mouseleave', hideTooltip, false)
        el.addEventListener('mousedown', hideTooltip, false)
        el.tooltip.addEventListener('transitionend', removeTooltip, false)
        // var in_dom = document.body.contains(el)
        // console.log(el)
        // var observer = new MutationObserver(function(mutations) {
        //     console.log('a mutation?')
        //     if (document.body.contains(el)) {
        //         if (!in_dom) {
        //             console.log('element inserted')
        //         }
        //         in_dom = true
        //     } else if (in_dom) {
        //         in_dom = false
        //         console.log('element removed')
        //     }
        // })
        // observer.observe(document.body, { childList: true })
    }
}

export default tooltipDirective
