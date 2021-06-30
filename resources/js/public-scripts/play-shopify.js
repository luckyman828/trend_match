import { embed } from './play.js'
const version = `0.0.0 - (2)`
console.log('Init PLAY Shopify embed script. Version: ' + version)

const targetOrigin = `https://kollekt_feature.test`

const contentWindow = embed(addToBasket, removeFromBasket, updateItemQuantity)

async function addToBasket(items) {
    let result
    const formData = {
        items: items.map(item => {
            return {
                id: item.sizeDetail.ref_id,
                quantity: item.quantity,
            }
        }),
    }

    await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then(async response => {
        result = await response.json()

        contentWindow.postMessage(
            {
                action: 'updateBasketItems',
                items: result.items.map((basketItem, index) => {
                    const item = items[index]
                    item.quantity = basketItem.quantity
                }),
            },
            targetOrigin
        )
    })
    return result
}

async function removeFromBasket(items) {
    let result
    const formData = { updates: {} }
    items.map(item => {
        formData.updates[item.sizeDetail.ref_id] = 0
    })

    await fetch('/cart/update.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then(async response => {
        result = await response.json()

        contentWindow.postMessage(
            {
                action: 'updateBasketItems',
                items: result.items.map((basketItem, index) => {
                    const item = items[index]
                    item.quantity = basketItem.quantity
                }),
            },
            targetOrigin
        )
    })
    return result
}

async function updateItemQuantity(item) {
    let result
    const formData = { id: item.sizeDetail.ref_id, quantity: item.quantity }

    await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then(async response => {
        result = await response.json()

        contentWindow.postMessage(
            {
                action: 'updateBasketItems',
                items: result.items.map((basketItem, index) => {
                    const item = items[index]
                    item.quantity = basketItem.quantity
                }),
            },
            targetOrigin
        )
    })
    return result
}
