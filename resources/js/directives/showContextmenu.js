const showContextMenuDirective = {}
showContextMenuDirective.install = Vue => {
    Vue.directive('show-contextmenu', {
        bind: function(el, binding, vnode) {
            el.triggerHandler = function(event) {
                // Get the element of the binding
                const contextMenu = binding.value.contextMenuComponent || vnode.context.$refs[binding.value.ref]
                if (!contextMenu) return
                event.preventDefault()

                let offset = { x: 0, y: 0 }
                const baseOffset = binding.value.offset ? binding.value.offset : 4
                const elRect = el.getBoundingClientRect()
                if (binding.value.placement == 'bottom') {
                    offset.y = Math.max(0, elRect.bottom - event.clientY) + baseOffset
                }

                contextMenu.show(event, binding.value.item, offset)
                if (binding.value.callback) binding.value.callback()
            }

            const eventTrigger = binding.value.trigger ? binding.value.trigger : 'click'
            el.addEventListener(eventTrigger, el.triggerHandler)
        },
        unbind: function(el, binding) {
            const eventTrigger = binding.value.trigger ? binding.value.trigger : 'click'
            el.removeEventListener(eventTrigger, el.triggerHandler)
        },
    })
}
export default showContextMenuDirective
