import { embed } from './play.js'
const version = `0.0.0 - (4)`
console.log('Init PLAY Shopify embed script. Version: ' + version)

const appUrl = process.env.MIX_APP_URL // `https://kollekt_feature.test`
const targetOrigin = `${appUrl}`

const contentWindow = embed(addToBasket, removeFromBasket, updateItemQuantity, changeItemSize)

async function addToBasket(items) {
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
        const newBasket = await response.json()
        updateKollektBasket(items, newBasket)
    })
}

async function removeFromBasket(items) {
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
        const newBasket = await response.json()
        updateKollektBasket(items, newBasket)
    })
}

async function updateItemQuantity(item) {
    const formData = { id: item.sizeDetail.ref_id, quantity: item.quantity }

    await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then(async response => {
        const newBasket = await response.json()
        updateKollektBasket([item], newBasket)
    })
}

async function changeItemSize(updateDetail) {
    const item = updateDetail.item
    const oldSizeDetail = updateDetail.oldSizeDetail
    const newSizeDetail = updateDetail.newSizeDetail

    await removeFromBasket([{ variant: item.variant, sizeDetail: oldSizeDetail }])
    await addToBasket([{ variant: item.variant, sizeDetail: newSizeDetail, quantity: item.quantity }])
}

function updateKollektBasket(items, newBasket) {
    contentWindow.postMessage(
        {
            action: 'updateBasketItems',
            items: items.map(item => {
                const basketItem = newBasket.items.find(x => x.id == item.sizeDetail.ref_id)
                if (!basketItem) return item
                item.quantity = basketItem.quantity
                return item
            }),
        },
        targetOrigin
    )
}
