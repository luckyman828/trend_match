const dragscrollDirective = {}
dragscrollDirective.install = Vue => {
    Vue.directive('dragscroll', {
        bind: function(el, binding, vnode) {
            addEvents(el, binding)
        },

        unbind: function(el, binding) {
            el.removeEventListener('mousedown', unbindEvents.mouseDownEvent)
            el.removeEventListener('mouseleave', unbindEvents.mouseLeaveEvent)
            el.removeEventListener('mouseup', unbindEvents.mouseUpEvent)
            el.removeEventListener('mousemove', unbindEvents.mouseMoveEvent)
        },
    })

    let unbindEvents = {
        mouseDownEvent: null,
        mouseLeaveEvent: null,
        mouseUpEvent: null,
        mouseMoveEvent: null,
    }

    const addEvents = (el, binding) => {
        const slider = el
        let target = null
        let isDown = false
        let startX
        let scrollLeft

        const mouseDownEvent = e => {
            console.log('darg scroll')
            // Only enable dragscroll if the clicked element is not an input field
            if (
                (e.target.tagName.toUpperCase() == 'INPUT' && e.target.type != 'file') ||
                e.target.tagName.toUpperCase() == 'TEXTAREA'
            )
                return
            isDown = true
            slider.classList.add('active')
            startX = e.pageX - slider.offsetLeft
            scrollLeft = slider.scrollLeft
        }
        const mouseLeaveEvent = () => {
            isDown = false
            slider.classList.remove('active')
        }
        const mouseUpEvent = () => {
            isDown = false
            slider.classList.remove('active')
        }
        const mouseMoveEvent = e => {
            if (!isDown) return
            e.preventDefault()
            const x = e.pageX - slider.offsetLeft
            const scrollSpeedMultiplier = 1
            const walk = (x - startX) * scrollSpeedMultiplier //scroll-fast
            slider.scrollLeft = scrollLeft - walk
        }

        el.addEventListener('mousedown', mouseDownEvent)
        el.addEventListener('mouseleave', mouseLeaveEvent)
        el.addEventListener('mouseup', mouseUpEvent)
        el.addEventListener('mousemove', mouseMoveEvent)

        unbindEvents.mouseDownEvent = mouseDownEvent
        unbindEvents.mouseLeaveEvent = mouseLeaveEvent
        unbindEvents.mouseUpEvent = mouseUpEvent
        unbindEvents.mouseMoveEvent = mouseMoveEvent
    }
}

export default dragscrollDirective
