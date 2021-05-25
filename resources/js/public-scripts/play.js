import {addToBasket as shopifyAddToBasket} from './play-shopify'

// Kollekt PLAY
const version = `0.0.0 - (4)`
console.log('Init PLAY embed script. Version: ' + version)

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
iframeEl.id = `embed-${version}`
iframeEl.name = Date.now()
iframeEl.style.cssText = 'width: 100%; height: 100%;'

playerEl.appendChild(closeButton)
playerEl.appendChild(iframeEl)

document.body.appendChild(playerEl)

// Add click listener
document.addEventListener('click', function(e) {
    const button = e.target.getAttribute('data-kollekt-play-id') ? e.target : e.target.closest('[data-kollekt-play-id]')
    if (!button) {
        return
    }
    const videoId = button.getAttribute('data-kollekt-play-id')
    const iFrameBaseUrl = 'https://branchtest.kollekt.dk/#/play/watch/'
    // iframeEl.src = `${iFrameBaseUrl}${videoId}`
    // iframeEl.src = `https://kollekt_feature.test/#/?timestamp=${new Date().getTime()}`
    iframeEl.src = `https://kollekt_feature.test/#/play/watch/846335067609235456?timestamp=${new Date().getTime()}`
    playerEl.style.display = 'block'
    iframeEl.contentWindow.location.href = iframeEl.src
})

// Interact with shopify
window.addEventListener('message', event => {
    console.log('window message received', event)
    const testOrigins = ['https://kollekt_feature.test', 'https://kollekt_release.test'] // REMOVE BEFORE GOING PRODUCTION!!
    const acceptedOrigins = ['https://app.kollekt.dk', 'https://branchtest.kollekt.dk', 'https://dev.kollekt.dk', 'https://staging.kollekt.dk']
    if (![...testOrigins, ...acceptedOrigins].includes(event.origin)) return
    const msgData = event.data
    if (msgData.action == 'addToBasket') {
        shopifyAddToBasket(msgData.items)
        
    }
})