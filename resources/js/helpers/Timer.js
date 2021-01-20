// Helper Function
var Timer = function(callback, delay, resetCallback) {
    var timerId,
        start,
        remaining = delay,
        lastReset

    this.getRemaining = function() {
        // let newRemaining = remaining -= Date.now() - start
        return remaining - (Date.now() - start)
    }

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

    this.clear = function() {
        window.clearTimeout(timerId)
    }

    this.resume()
}
export default Timer
