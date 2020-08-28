const clickOutsideDirective = {}
clickOutsideDirective.install = Vue => {
    Vue.directive('click-outside', {
        bind: function(el, binding, vnode) {
            let clickOriginTarget = null
            el.clickOutsideEvent = function(event) {
                // here I check that click was outside the el and his childrens
                if (
                    !(el == event.target || el.contains(event.target) || !document.contains(event.target)) &&
                    !(
                        el == clickOriginTarget ||
                        el.contains(clickOriginTarget) ||
                        !document.contains(clickOriginTarget)
                    ) &&
                    !(event.target.classList.contains('.snackbar') || event.target.closest('.snackbar')) &&
                    !(event.target.classList.contains('.tooltip') || event.target.closest('.tooltip'))
                ) {
                    // and if it did, call method provided in attribute value
                    vnode.context[binding.expression](event)
                }
            }
            // HANDLE MOUSEDOWN
            // On mousedown save a reference to the element where the click originated
            el.clickStartEvent = function(event) {
                clickOriginTarget = event.target
            }
            document.body.addEventListener('mouseup', el.clickOutsideEvent)
            document.body.addEventListener('mousedown', el.clickStartEvent)
        },
        unbind: function(el) {
            document.body.removeEventListener('mouseup', el.clickOutsideEvent)
            document.body.removeEventListener('mousedown', el.clickStartEvent)
        },
    })
}
export default clickOutsideDirective
