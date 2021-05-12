const showContextMenuDirective = {}
showContextMenuDirective.install = Vue => {
    Vue.directive('show-contextmenu', {
        bind: function(el, binding, vnode) {
            el.clickEvent = function(event) {
                // Get the element of the binding
                const contextMenu = vnode.context.$refs[binding.value.ref]
                if (!contextMenu) return

                let offset = { x: 0, y: 0 }
                const baseOffset = binding.value.offset ? binding.value.offset : 4
                const elRect = el.getBoundingClientRect()
                if (binding.value.placement == 'bottom') {
                    offset.y = Math.max(0, elRect.bottom - event.clientY) + baseOffset
                }

                contextMenu.show(event, binding.value.item, offset)
            }

            el.addEventListener('click', el.clickEvent)
        },
        unbind: function(el) {
            el.removeEventListener('click', el.clickEvent)
        },
    })
}
export default showContextMenuDirective
