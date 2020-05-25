const tooltipTriggerDirective = {}
import { createPopper } from '@popperjs/core'

tooltipTriggerDirective.install = Vue => {
    Vue.directive('tooltip-trigger', {
        bind: function(el, binding, vnode) {
            const showEvents = ['mouseenter', 'focus']
            const hideEvents = ['mouseleave', 'blur']

            let popperInstance = null
            let tooltipComponent = null
            let tooltipEl = null

            function create() {
                popperInstance = createPopper(el, tooltipEl, binding.value.popperOptions)
            }

            function destroy() {
                if (popperInstance) {
                    popperInstance.destroy()
                    popperInstance = null
                }
            }

            el.showTooltipEvent = function() {
                // Set the tooltip
                tooltipComponent = vnode.context.$refs[binding.value.tooltipRef]
                tooltipEl = tooltipComponent.$el

                tooltipEl.setAttribute('data-show', '')

                create()

                tooltipComponent.show(binding.value.showArg)

                hideEvents.forEach(event => {
                    tooltipEl.addEventListener(event, el.hideTooltipEvent)
                })
            }

            el.hideTooltipEvent = function(e) {
                // Test that we are not hovering over or the tooltip
                const target = e.relatedTarget
                if (target != tooltipEl) {
                    tooltipEl.removeAttribute('data-show')
                    destroy()

                    tooltipComponent.hide()

                    hideEvents.forEach(event => {
                        tooltipEl.removeEventListener(event, el.hideTooltipEvent)
                    })
                }
            }

            showEvents.forEach(event => {
                el.addEventListener(event, el.showTooltipEvent)
            })

            hideEvents.forEach(event => {
                el.addEventListener(event, el.hideTooltipEvent)
            })
        },
        unbind: function(el) {
            const showEvents = ['mouseenter', 'focus']
            const hideEvents = ['mouseleave', 'blur']

            showEvents.forEach(event => {
                el.addEventListener(event, el.showTooltipEvent)
            })

            hideEvents.forEach(event => {
                el.addEventListener(event, el.hideTooltipEvent)
            })
        },
    })
}
export default tooltipTriggerDirective
