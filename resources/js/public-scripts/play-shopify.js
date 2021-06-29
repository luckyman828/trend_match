import { embed } from './play.js'

const contentWindow = embed(addToBasket, removeFromBasket)

async function addToBasket(items) {
    let result
    console.log('add to basket', items)
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
            'https://kollekt_feature.test'
        )
    })
    return result
}

function removeFromBasket(items) {}
