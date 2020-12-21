const horizontalSrollDirective = {}
horizontalSrollDirective.install = Vue => {
    Vue.directive('horizontal-scroll', {
        bind: function(el, binding, vnode) {
            el.onWheel = function(e) {
                if (e.type != 'wheel' || e.altKey) {
                    return
                }
                let delta = (e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1
                delta = delta * -(binding && binding.value ? binding.value : 100)
                document.documentElement.scrollLeft -= delta
                // safari needs also this
                el.scrollLeft -= delta
                e.preventDefault()
            }

            el.addEventListener('wheel', el.onWheel)
        },
        unbind: function(el) {
            el.removeEventListener('wheel', el.onWheel)
        },
    })
}
export default horizontalSrollDirective
