const tooltipTriggerDirective = {}
import { createPopper, auto } from '@popperjs/core'
import maxSize from 'popper-max-size-modifier'

tooltipTriggerDirective.install = Vue => {
    Vue.directive('tooltip-trigger', {
        bind: function(el, binding, vnode) {
            const showEvents = ['mouseenter', 'focus']
            const hideEvents = ['mouseleave', 'blur']

            let popperInstance = null
            let tooltipComponent = null
            let tooltipEl = null
            el.binding = binding

            function create() {
                // popperInstance = createPopper(el, tooltipEl, el.binding.value.popperOptions)
                popperInstance = createPopper(el, tooltipEl, {
                    placement: 'auto',
                    modifiers: [
                        {
                            name: 'flip',
                            enabled: true,
                            options: {
                                padding: 16,
                                allowedAutoPlacements: ['top', 'bottom'],
                            },
                        },
                        {
                            name: 'preventOverflow ',
                            enabled: true,
                            options: {},
                            phase: 'main',
                        },
                        maxSize,
                        {
                            name: 'applyMaxSize',
                            enabled: true,
                            // options: {
                            //     padding: 50,
                            // },
                            phase: 'beforeWrite',
                            requires: ['maxSize'],
                            fn({ state }) {
                                const { height } = state.modifiersData.maxSize
                                // Set the maxHeight of the tooltip-inner element
                                const tooltipInner = state.elements.popper.querySelector('.tooltip-inner')
                                if (tooltipInner) {
                                    tooltipInner.style.maxHeight = `${height - 20}px`
                                } else {
                                    state.styles.popper.maxHeight = `${height - 20}px`
                                }
                            },
                        },
                    ],
                })
            }

            function destroy() {
                if (popperInstance) {
                    popperInstance.destroy()
                    popperInstance = null
                }
            }

            el.showTooltipEvent = function() {
                console.log('show tooltip!')
                // Set the tooltip
                if (el.binding.value.tooltipComp) tooltipComponent = el.binding.value.tooltipComp
                else tooltipComponent = vnode.context.$refs[el.binding.value.tooltipRef]
                tooltipEl = tooltipComponent.$el

                document.body.appendChild(tooltipEl)

                if (!el.binding.value.disabled) {
                    tooltipEl.setAttribute('data-show', '')
                    tooltipComponent.show(el.binding.value.showArg)

                    create()

                    hideEvents.forEach(event => {
                        tooltipEl.addEventListener(event, el.hideTooltipEvent)
                    })
                }
            }

            el.hideTooltipEvent = function(e) {
                // Test that we are not hovering over or the tooltip
                const target = e.relatedTarget
                if (target != tooltipEl && !tooltipEl.contains(target)) {
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
        componentUpdated: function(el, binding, vnode) {
            el.binding = binding
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
