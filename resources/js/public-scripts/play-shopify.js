export async function addToBasket(items) {
    let result
    const formData = {
        'items': items.map(item => {
            return {
            'id': item.id,
            'quantity': item.quantity,
        }})
    }
    
    await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(async response => {
        result = await response.json()
        // console.log('add to basket result', await response.json())
    })
    return result
}