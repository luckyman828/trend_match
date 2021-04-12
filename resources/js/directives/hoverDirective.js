const hoverDirective = {}
hoverDirective.install = Vue => {
    Vue.directive('hover', {
        bind: function(el, binding, vNode) {
            // Provided expression must evaluate to an object.
            const compName = vNode.context.name
            if (typeof binding.value !== 'object') {
                let warn = `[v-hover]: provided expression '${binding.expression}' is not an object, but it needs to be.`
                if (compName) {
                    warn += `\nFound in component '${compName}'`
                }
                console.warn(warn)
            }
            if (!binding.value.over && !binding.value.leave) {
                let warn = `[v-hover]: object provided does not have 'over' or 'leave' properties. Needs at least one to be of use`
                if (compName) {
                    warn += `\nFound in component '${compName}'`
                }
                console.warn(warn)
            }
            el.__vHoverOver__ = binding.value.over || (() => {})
            el.__vHoverLeave__ = binding.value.leave || (() => {})

            // Add Event Listeners
            el.addEventListener('mouseover', el.__vHoverOver__)
            el.addEventListener('mouseleave', el.__vHoverLeave__)
        },
        unbind: function(el, binding) {
            // Remove Event Listeners
            el.removeEventListener('mouseover', el.__vHoverOver__)
            el.removeEventListener('mouseleave', el.__vHoverLeave__)
            delete el.__vHoverOver__
            delete el.__vHoverLeave__
        },
    })
}
export default hoverDirective
