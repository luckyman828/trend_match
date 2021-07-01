import { embed } from './play.js'
const version = `0.0.0 - (1)`
console.log('Init PLAY DKC embed script. Version: ' + version)

const contentWindow = embed(addToBasket, removeFromBasket)

async function addToBasket(items) {
    console.log(
        'post this',
        items.map(item => ({ ean: item.sizeDetail.ean, quantity: 1 }))
    )
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
