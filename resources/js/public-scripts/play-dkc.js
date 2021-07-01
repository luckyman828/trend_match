import { embed } from './play.js'
const version = `0.0.0 - (1)`
console.log('Init PLAY DKC embed script. Version: ' + version)

const contentWindow = embed(addToBasket, removeFromBasket, updateItemQuantity)

async function addToBasket(items) {
    await window.w2mInterop.addMultipleToBasket(items.map(item => ({ ean: item.sizeDetail.ean, quantity: 1 })))

    const newBasket = await w2mInterop.getBasket()
    console.log('AFTER ADDING!', newBasket)
    updateKollektBasket(newBasket)
}

async function removeFromBasket(items) {
    await Promise.all(
        items.map(async item => {
            await window.w2mInterop.removeFromBasket(item.sizeDetail.ean)
        })
    )
    const newBasket = await w2mInterop.getBasket()
    console.log('AFTER REMOVING!', newBasket)
    updateKollektBasket(newBasket)
}

async function updateItemQuantity(item) {
    await window.w2mInterop.updateBasket(item.sizeDetail.ean, item.quantity)

    const newBasket = await w2mInterop.getBasket()
    updateKollektBasket(newBasket)
}

function updateKollektBasket(newBasket) {
    contentWindow.postMessage(
        {
            action: 'updateBasketItems',
            items: items.map(item => {
                const basketItem = newBasket.basketLines.find(x => x.productEAN == item.sizeDetail.ean)
                if (!basketItem) return item
                item.quantity = basketItem.quantity
                return item
            }),
        },
        targetOrigin
    )
}
