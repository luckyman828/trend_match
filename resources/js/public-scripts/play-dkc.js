import { embed } from './play.js'
const version = `0.0.0 - (1)`
console.log('Init PLAY DKC embed script. Version: ' + version)

const appUrl = process.env.MIX_APP_URL // `https://kollekt_feature.test`
const targetOrigin = `${appUrl}`

const contentWindow = embed(addToBasket, removeFromBasket, updateItemQuantity, changeItemSize)

async function addToBasket(items) {
    // console.log('Add this to basket', items)
    await window.w2mInterop.addMultipleToBasket(items.map(item => ({ ean: item.sizeDetail.ean, quantity: 1 })))

    const newBasket = await w2mInterop.getBasket()
    // console.log('AFTER ADDING!', newBasket)
    updateKollektBasket(items, newBasket)
}

async function removeFromBasket(items) {
    // console.log('remove this from basket', items)
    await Promise.all(
        items.map(async item => {
            await window.w2mInterop.removeFromBasket(item.sizeDetail.ean)
        })
    )
    const newBasket = await w2mInterop.getBasket()
    // console.log('AFTER REMOVING!', newBasket)
    updateKollektBasket(items, newBasket)
}

async function updateItemQuantity(item) {
    await window.w2mInterop.updateBasket(item.sizeDetail.ean, item.quantity)

    const newBasket = await w2mInterop.getBasket()
    updateKollektBasket([item], newBasket)
}

async function changeItemSize(updateDetail) {
    const item = updateDetail.item
    const oldSizeDetail = updateDetail.oldSizeDetail
    const newSizeDetail = updateDetail.newSizeDetail

    await removeFromBasket([{ variant: item.variant, sizeDetail: oldSizeDetail }])
    await addToBasket([{ variant: item.variant, sizeDetail: newSizeDetail }])
}

function updateKollektBasket(items, newBasket) {
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
