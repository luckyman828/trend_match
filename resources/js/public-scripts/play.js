// Kollekt PLAY

// Create Player
const playerEl = document.createElement('div')
playerEl.style.cssText =
    'position: fixed; left: 0; top: 0; height: 100vh; width: 100vw; z-index: 99999; display: none; min-height: 100vh;min-width: 100vw;max-height: 100vh;overflow: hidden;background: #f4f6ff;scroll-behavior: smooth;min-height: -webkit-fill-available;height: -webkit-fill-available;'

// Close button
const closeButton = document.createElement('button')
closeButton.innerHTML = '<span>X</span>'
closeButton.style.cssText = 'position: absolute; right: 0; top: 0; height: 40px; width: 40px; z-index: 1;'
closeButton.addEventListener('click', function(e) {
    playerEl.style.display = 'none'
})

const iframeEl = document.createElement('iframe')
iframeEl.style.cssText = 'width: 100%; height: 100%;'

playerEl.appendChild(closeButton)
playerEl.appendChild(iframeEl)

document.body.appendChild(playerEl)

// Add click listener
document.addEventListener('click', function(e) {
    const button = e.target
    if (!button.getAttribute('data-kollekt-play-id')) {
        return
    }
    const videoId = button.getAttribute('data-kollekt-play-id')
    const iFrameBaseUrl = 'https://branchtest.kollekt.dk/#/play/watch/'
    iframeEl.src = `${iFrameBaseUrl}${videoId}`
    playerEl.style.display = 'block'
})