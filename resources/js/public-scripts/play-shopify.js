export function addToBasket(items) {
    const formData = {
        'items': items.map(item => {
            return {
            'id': item.id,
            'quantity': item.quantity,
        }})
    }
    
    fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
}