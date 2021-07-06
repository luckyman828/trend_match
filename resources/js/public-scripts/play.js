export function embed(
    addToBasketCallBack,
    removeFromBasketCallback,
    updateItemQuantityCallback,
    changeItemSizeCallback
) {
    // Kollekt PLAY
    const version = `0.0.0 - (8)`
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
                z-index: 99999; 
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
                box-shadow: 0 3px 6px #00000029;
            }
            .kollekt-player-frame {
                background: #f4f6ff;
                border-radius: 12px;
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
                    max-height: 100vh;
                    min-height: -webkit-fill-available;
                    height: -webkit-fill-available;
                    top: 0;
                }
                .kollekt-player-frame {
                    border-radius: 0;
                }
                .kollekt-close-button {
                    top: 8px;
                    right: 8px; 
                }
                
            }
        </style>`
    )

    // Create wrapper
    const wrapperEl = document.createElement('div')
    wrapperEl.classList.add('kollekt-play-wrapper')

    // Create Player
    const playerEl = document.createElement('div')
    playerEl.classList.add('kollekt-player')
    wrapperEl.appendChild(playerEl)

    // Crete overlay
    const overlayEl = document.createElement('div')
    overlayEl.classList.add('kollekt-play-overlay')
    overlayEl.addEventListener('click', function(e) {
        wrapperEl.style.display = 'none'
    })
    wrapperEl.appendChild(overlayEl)

    // Close button
    const closeButton = document.createElement('button')
    closeButton.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path></svg>`
    closeButton.classList.add('kollekt-close-button')
    closeButton.addEventListener('click', function(e) {
        wrapperEl.style.display = 'none'
    })

    const iframeEl = document.createElement('iframe')
    iframeEl.id = `embed-${version}`
    iframeEl.classList.add('kollekt-player-frame')
    iframeEl.name = Date.now()
    iframeEl.style.cssText = 'width: 100%; height: 100%; border: none;'

    playerEl.appendChild(closeButton)
    playerEl.appendChild(iframeEl)

    document.body.appendChild(wrapperEl)

    // Add click listener
    document.addEventListener('click', function(e) {
        const button = e.target.getAttribute('data-kollekt-play-id')
            ? e.target
            : e.target.closest('[data-kollekt-play-id]')
        if (!button) {
            return
        }
        const presentationId = button.getAttribute('data-kollekt-play-id')
        const appUrl = process.env.MIX_APP_URL

        // const iFrameBaseUrl = 'https://dev-stable.kollekt.dk/#/play/watch/'
        const iFrameBaseUrl = `${appUrl}/#/play/watch/`
        // iframeEl.src = `${iFrameBaseUrl}${videoId}`
        // iframeEl.src = `https://kollekt_feature.test/#/?timestamp=${new Date().getTime()}`
        iframeEl.src = `${iFrameBaseUrl}${presentationId}?timestamp=${new Date().getTime()}`
        wrapperEl.style.display = 'block'
        iframeEl.contentWindow.location.href = iframeEl.src
    })

    // Interact with shopify
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

        // console.log('message!', event.data)
        if (![...testOrigins, ...acceptedOrigins].includes(event.origin)) return
        const msgData = event.data

        // ADD TO BASKET
        if (msgData.action == 'addToBasket' && addToBasketCallBack) {
            addToBasketCallBack(msgData.items)
        }

        // REMOVE FROM BASKET
        if (msgData.action == 'removeFromBasket' && removeFromBasketCallback) {
            removeFromBasketCallback(msgData.items)
        }

        // UPDATE QUANTITY
        if (msgData.action == 'updateItemQuantity' && updateItemQuantityCallback) {
            updateItemQuantityCallback(msgData.item)
        }

        // CHANGE SIZE
        if (msgData.action == 'changeItemSize' && changeItemSizeCallback) {
            // updateDetail: { item, newSizeDetail, oldSizeDetail }
            changeItemSizeCallback(msgData.updateDetail)
        }
    })
    return iframeEl.contentWindow
}
