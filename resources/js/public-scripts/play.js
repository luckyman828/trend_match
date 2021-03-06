export function embed({
    contentWindowChangeCallback,
    getBasketCallback,
    addToBasketCallback,
    removeFromBasketCallback,
    updateItemQuantityCallback,
    changeItemSizeCallback,
} = {}) {
    if (window.kollekt_play_init) {
        console.log('wont create an extra')
        return
    }
    window.kollekt_play_init = true

    // Kollekt PLAY
    const version = `1.0.0 - (0)`
    console.log('Init PLAY embed script. Version: ' + version)
    document.head.insertAdjacentHTML(
        'beforeend',
        `<style>
            .kollekt-play-wrapper {
                position: fixed; 
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                height: 100vh; 
                width: 100vw; 
                z-index: 999999999999; 
                display: none;
                scroll-behavior: smooth;
            }
            .kollekt-play-overlay {
                width: 100%;
                height: 100%;
                position: absolute;
                background: #0D131C69;
            }
            .kollekt-player {
                position: fixed; 
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                height: calc(100vh - 80px); 
                width: calc(100vw - 32px); 
                scroll-behavior: smooth;
                max-height: 800px;
                max-width: 1280px;
                z-index: 1;
            }
            .kollekt-player.fullscreen-mode-active {
                height: 100vh; 
                width: 100vw; 
                max-height: none;
                max-width: none;
            }
            .kollekt-player.fullscreen-mode-active .kollekt-player-frame {
                border-radius: 0;
            }
            .kollekt-player-frame {
                background: #f4f6ff;
                border-radius: 12px;
                box-shadow: 0 3px 6px #00000029;
                overflow: hidden;
            }
            .kollekt-close-button {
                position: absolute; 
                right: 0; 
                top: -40px; 
                height: 32px; 
                width: 32px; 
                z-index: 1;
                border: none;
                -webkit-appearence: none;
                border-radius: 50px;
                background: white;
                color: #1C293B;
            }
            .kollekt-close-button > svg {
                height: 15px;
                width: 15px;
                margin-top: 5px;
            }

            /* SMALL DESKTOP */
            @media screen and (max-height: 932px) {
                .kollekt-player {
                    top: 32px;
                }
            }

            /* MOBILE */
            @media screen and (max-width: 800px) {
                .kollekt-player {
                    min-height: 100vh;
                    min-width: 100vw;
                    /*min-height: -webkit-fill-available;
                    height: -webkit-fill-available;*/
                    top: 0;
                }
                .kollekt-player-frame {
                    border-radius: 0;
                }
                .kollekt-close-button {
                    top: 8px;
                    right: 8px; 
                }
                .kollekt-close-button > svg {
                    height: 15px;
                    width: 32px;
                    margin-top: 8px;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                
            }
        </style>`
    )

    // Create wrapper
    const wrapperEl = document.createElement('div')
    wrapperEl.classList.add('kollekt-play-wrapper')

    // Prevent scrolling background from within the player
    let playerVisible = false
    let scrollX
    let scrollY
    window.addEventListener('scroll', onScroll)
    function onScroll(e) {
        if (playerVisible) {
            e.preventDefault()
            e.stopPropagation()
            window.scrollTo(scrollX, scrollY)
            return false
        }
    }

    // Create Player
    const playerEl = document.createElement('div')
    playerEl.classList.add('kollekt-player')
    playerEl.id = 'the-kollekt-player'
    wrapperEl.appendChild(playerEl)

    // Crete overlay
    const overlayEl = document.createElement('div')
    overlayEl.classList.add('kollekt-play-overlay')
    overlayEl.addEventListener('click', onClose)
    wrapperEl.appendChild(overlayEl)

    // Close button
    const closeButton = document.createElement('button')
    closeButton.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path></svg>`
    closeButton.classList.add('kollekt-close-button')
    closeButton.addEventListener('click', onClose)

    let iframeEl = createIframe()

    playerEl.appendChild(closeButton)

    document.body.appendChild(wrapperEl)

    let contentWindow = iframeEl.contentWindow

    // Add click listener
    // ON SHOW FUNCTION
    document.addEventListener('click', function(e) {
        const button = e.target.getAttribute('data-kollekt-play-id')
            ? e.target
            : e.target.closest('[data-kollekt-play-id]')
        if (!button) {
            return
        }
        const presentationId = button.getAttribute('data-kollekt-play-id')
        const appUrl = process.env.MIX_APP_URL

        const presentationLocale = button.getAttribute('data-kollekt-play-locale')

        const iFrameBaseUrl = `${appUrl}/#/play/watch/`
        iframeEl.src = `${iFrameBaseUrl}${presentationId}?timestamp=${new Date().getTime()}${
            presentationLocale ? `&locale=${presentationLocale}` : ''
        }`
        wrapperEl.style.display = 'block'

        // Emit event
        emitEvent('openPresentation', { presentationId, presentationLocale })

        // Trigger get basket on creation
        // Add delay to ensure loading is done

        iframeEl.onload = () => {
            if (getBasketCallback) getBasketCallback()
        }
        playerVisible = true
        scrollX = window.scrollX
        scrollY = window.scrollY
    })

    function toggleFullscreenMode() {
        if (playerEl.classList.contains('fullscreen-mode-active')) {
            playerEl.classList.remove('fullscreen-mode-active')
            postMessage({ action: 'toggleFullscreenMode', newValue: false })
        } else {
            playerEl.classList.add('fullscreen-mode-active')
            postMessage({ action: 'toggleFullscreenMode', newValue: true })
        }
    }

    // Add fullscreen listeners
    function fullscreenChangeHandler(e) {
        toggleFullscreenMode()
    }

    function onClose() {
        {
            // Reload the iframe by removing and recreating the iframe
            wrapperEl.style.display = 'none'
            iframeEl.remove()
            iframeEl = createIframe()

            // Emit event
            emitEvent('closePresentation')

            // Reset the contentWindow
            contentWindow = iframeEl.contentWindow
            if (contentWindowChangeCallback) contentWindowChangeCallback(contentWindow)
            playerVisible = false
        }
    }

    function createIframe() {
        const newIframe = document.createElement('iframe')
        newIframe.setAttribute('allow', 'fullscreen')
        newIframe.id = `embed-${version}`
        newIframe.classList.add('kollekt-player-frame')
        newIframe.name = Date.now()
        newIframe.style.cssText = 'width: 100%; height: 100%; border: none;'
        playerEl.appendChild(newIframe)

        return newIframe
    }

    document.addEventListener('fullscreenchange', fullscreenChangeHandler, false)
    document.addEventListener('mozfullscreenchange', fullscreenChangeHandler, false)
    document.addEventListener('MSFullscreenChange', fullscreenChangeHandler, false)
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler, false)

    // Interact with webshop
    window.addEventListener('message', async event => {
        const testOrigins =
            process.env.NODE_ENV == 'production' ? [] : ['https://kollekt_feature.test', 'https://kollekt_release.test']
        const acceptedOrigins = [
            'https://app.kollekt.dk',
            'https://branchtest.kollekt.dk',
            'https://dev.kollekt.dk',
            'https://dev-stable.kollekt.dk',
            'https://staging.kollekt.dk',
        ]

        // console.log('postMessage received!', event.data, addToBasketCallback)
        if (![...testOrigins, ...acceptedOrigins].includes(event.origin)) return
        const msgData = event.data

        // CLOSE PRESENTATION
        if (msgData.action == 'closePresentation') {
            onClose()
        }

        // GET BASKET
        if (msgData.action == 'getBasket' && getBasketCallback) {
            getBasketCallback()
        }

        // ADD TO BASKET
        if (msgData.action == 'addToBasket' && addToBasketCallback) {
            addToBasketCallback(msgData.items)

            // Emit event
            emitEvent('addToBasket', { items: msgData.items })
        }

        // REMOVE FROM BASKET
        if (msgData.action == 'removeFromBasket' && removeFromBasketCallback) {
            removeFromBasketCallback(msgData.items)

            // Emit event
            emitEvent('removeFromBasket', { items: msgData.items })
        }

        // UPDATE QUANTITY
        if (msgData.action == 'updateItemQuantity' && updateItemQuantityCallback) {
            updateItemQuantityCallback(msgData.item)

            // Emit event
            emitEvent('updateItemQuantity', { item: msgData.item })
        }

        // CHANGE SIZE
        if (msgData.action == 'changeItemSize' && changeItemSizeCallback) {
            // updateDetail: { item, newSizeDetail, oldSizeDetail }
            changeItemSizeCallback(msgData.updateDetail)

            // Emit event
            emitEvent('changeItemSize', { updateDetail: msgData.updateDetail })
        }

        // GO TO CHECKOUT
        if (msgData.action == 'goToCheckout') {
            // Emit event
            emitEvent('goToCheckout')

            window.location = msgData.url
        }

        // MODAL OPEN / DISABLE CLOSE
        if (msgData.action == 'disableClose') {
            closeButton.style.display = 'None'
        }
        // MODAL CLOSED / ENABLE CLOSE
        if (msgData.action == 'enableClose') {
            closeButton.style.display = 'Block'
        }
    })

    function postMessage(msg) {
        const appUrl = process.env.MIX_APP_URL
        const targetOrigin = `${appUrl}`
        contentWindow.postMessage(msg, targetOrigin)
    }

    function emitEvent(eventName, eventData) {
        const event = new CustomEvent(eventName, { detail: eventData })
        playerEl.dispatchEvent(event)
    }

    return contentWindow
}
