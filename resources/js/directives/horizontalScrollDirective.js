const horizontalSrollDirective = {}
horizontalSrollDirective.install = Vue => {
    Vue.directive('click-outside', {
        bind: function(el, binding, vnode) {
            el.onWheel = function(e) {
                if (e.type != 'wheel') {
                    return
                }
                let delta = (e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1
                delta = delta * -300
                document.documentElement.scrollLeft -= delta
                // safari needs also this
                document.body.scrollLeft -= delta
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
