import { embed } from './play.js'
const version = `0.0.0 - (7)`
console.log('Init PLAY Shopify embed script. Version: ' + version)

const appUrl = process.env.MIX_APP_URL // `https://kollekt_feature.test`
const targetOrigin = `${appUrl}`

let contentWindow = embed({
    contentWindowChangeCallback: onContentWindowChange,
    getBasketCallback: getBasket,
    addToBasketCallback: addToBasket,
    removeFromBasketCallback: removeFromBasket,
    updateItemQuantityCallback: updateItemQuantity,
    changeItemSizeCallback: changeItemSize,
})

async function onContentWindowChange(newContentWindow) {
    contentWindow = newContentWindow
}

async function getBasket() {
    await fetch('/cart.js', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(async response => {
        const shopBasket = await response.json()

        // Transform the basket response to a kollekt-compatible model

        contentWindow.postMessage(
            {
                action: 'syncBasket',
                items: shopBasket.items.map(item => {
                    return {
                        ref_id: item.variant_id,
                        size: item.options_with_values.find(x => x.name == 'size').value,
                        quantity: item.quantity,
                    }
                }),
            },
            targetOrigin
        )
    })
}

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
