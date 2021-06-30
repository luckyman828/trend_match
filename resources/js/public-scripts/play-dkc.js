import { embed } from './play.js'

const contentWindow = embed(addToBasket, removeFromBasket)

async function addToBasket(items) {
    const newBasket = window.w2mInterop.addMultipleToBasket(
        items.map(item => ({ ean: item.sizeDetail.ean, quantity: 1 }))
    )
}

// Hello

function removeFromBasket(items) {
    for (const item of items) {
        window.w2mInterop.removeFromBasket(item.sizeDetail.ean)
    }
}
