function init() {
    const player = document.getElementById('the-kollekt-player')
    if (!player) {
        console.error(
            'Unable to initialize Google Analytics for PLAY. No Kollekt PLAY player found. Please make sure that this script in included AFTER the main play.js script.'
        )
        return
    }

    // ADD EVENT LISTNERS

    // OPEN PRESENTATION
    player.addEventListener('openPresentation', e => {
        const id = e.detail.presentationId
        const locale = e.detail.presentationLocale
        console.log('open presentation', id, locale)
    })

    // CLOSE PRESENTATION
    player.addEventListener('closePresentation', e => {
        console.log('close presentation')
    })

    // ADD TO BASKET
    player.addEventListener('addToBasket', e => {
        const items = e.detail.items
        console.log('addToBasket', items)
    })

    // REMOVE FROM BASKET
    player.addEventListener('removeFromBasket', e => {
        const items = e.detail.items
        console.log('removeFromBasket', items)
    })

    // UPDATE QUANTITY
    player.addEventListener('updateItemQuantity', e => {
        const item = e.detail.item
        console.log('updateItemQuantity', item)
    })

    // CHANGE SIZE
    player.addEventListener('changeItemSize', e => {
        const updateDetail = e.detail.updateDetail
        console.log('updateItemQuantity', updateDetail)
    })

    // GO TO CHECKOUT
    player.addEventListener('goToCheckout', e => {
        console.log('goToCheckout')
    })
}
init()
