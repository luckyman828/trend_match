import { embed } from './play.js'
const version = `0.0.0 - (1)`
console.log('Init PLAY DKC embed script. Version: ' + version)

const contentWindow = embed(addToBasket, removeFromBasket, updateItemQuantity)

async function addToBasket(items) {
    console.log(
        'post this',
        items.map(item => ({ ean: item.sizeDetail.ean, quantity: 1 }))
    )
    const newBasket = window.w2mInterop.addMultipleToBasket(
        items.map(item => ({ ean: item.sizeDetail.ean, quantity: 1 }))
    )
    console.log('add response', newBasket)
    const basket = await w2mInterop.getBasket()
    console.log('get basket', basket)
    // contentWindow.postMessage(
    //     {
    //         action: 'updateBasketItems',
    //         items: items.map(item => {
    //             const basketItem = result.items.find(x => x.id == item.sizeDetail.ref_id)
    //             if (!basketItem) return item
    //             item.quantity = basketItem.quantity
    //             return item
    //         }),
    //     },
    //     targetOrigin
    // )
}

async function removeFromBasket(items) {
    await Promise.all(
        items.map(async item => {
            await window.w2mInterop.removeFromBasket(item.sizeDetail.ean)
        })
    )
    const basket = await w2mInterop.getBasket()
    console.log('remove basket', basket)
}

async function updateItemQuantity(item) {
    const newBasket = await window.w2mInterop.updateBasket(item.sizeDetail.ean, item.quantity)

    console.log('update response', newBasket)
    const basket = await w2mInterop.getBasket()
    console.log('update basket', basket)
}
