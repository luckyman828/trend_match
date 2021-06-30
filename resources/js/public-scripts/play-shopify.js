import { embed } from './play.js'
const version = `0.0.0 - (2)`
console.log('Init PLAY Shopify embed script. Version: ' + version)

const appUrl = process.env.MIX_APP_URL // `https://kollekt_feature.test`
const targetOrigin = `${appUrl}`

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

        console.log('add', result)
        contentWindow.postMessage(
            {
                action: 'updateBasketItems',
                items: items.map(item => {
                    const basketItem = result.items.find(x => x.id == item.sizeDetail.ref_id)
                    if (!basketItem) return item
                    item.quantity = basketItem.quantity
                    return item
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

        console.log('remove', result)

        contentWindow.postMessage(
            {
                action: 'updateBasketItems',
                items: items.map(item => {
                    const basketItem = result.items.find(x => x.id == item.sizeDetail.ref_id)
                    if (!basketItem) return item
                    item.quantity = basketItem.quantity
                    return item
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

        console.log('update', result)

        const basketItem = result.items.find(x => x.id == item.sizeDetail.ref_id)
        if (basketItem) {
            item.quantity = basketItem.quantity
        }

        contentWindow.postMessage(
            {
                action: 'updateBasketItems',
                items: [item],
            },
            targetOrigin
        )
    })
    return result
}
