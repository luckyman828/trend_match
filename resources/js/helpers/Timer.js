// Helper Function
var Timer = function(callback, delay, resetCallback) {
    var timerId,
        start,
        remaining = delay,
        lastReset

    this.pause = function() {
        window.clearTimeout(timerId)
        remaining -= Date.now() - start
    }

    this.resume = function() {
        start = Date.now()
        window.clearTimeout(timerId)
        timerId = window.setTimeout(callback, remaining)
    }

    this.reset = function() {
        start = Date.now()
        remaining = delay
        window.clearTimeout(timerId)
        timerId = window.setTimeout(callback, remaining)
        resetCallback()
    }

    this.resume()
}
export default Timer
