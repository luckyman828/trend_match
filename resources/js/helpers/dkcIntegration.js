import store from '../store/'
export function cleanUpDKCObj(srcObj, newObj) {
    Object.keys(srcObj).map(key => {
        let theKey = key
        let keyVal = srcObj[key]

        if (Array.isArray(keyVal)) {
            // Check if the array is acutally just a single value
            if (keyVal.length == 1 && typeof keyVal[0] == 'string') {
                keyVal = keyVal[0]
                if (['true', 'false'].includes(keyVal)) keyVal = JSON.parse(keyVal)
            }
            // Check if array is actually just a single object
            if (keyVal.length == 1 && !Array.isArray(keyVal[0]) && typeof keyVal[0] == 'object') {
                const newKey = Object.keys(keyVal[0])[0]
                if (!['Variant', 'Size', 'Price', 'Assortment'].includes(newKey)) {
                    theKey = newKey
                }
                keyVal = keyVal[0][newKey]
            }
            if (Array.isArray(keyVal) && keyVal.length > 0) {
                keyVal = keyVal.map(arrayObj => {
                    const objKeys = Object.keys(arrayObj)
                    if (objKeys.length == 1 && objKeys[0] == '$') {
                        return arrayObj['$']
                    }
                    return arrayObj
                })

                // If the array is an array of languages, replace it by its english option
                if (keyVal[0].Language) {
                    keyVal = keyVal.find(x => x.Language == 'ENU').Value
                }
            }
            // If the Array is still an array loop through the array items and parse them as well
            if (Array.isArray(keyVal)) {
                keyVal = keyVal.map(arrayObj => {
                    const newArrayObj = {}
                    cleanUpDKCObj(arrayObj, newArrayObj)
                    return newArrayObj
                })
            }
        }

        newObj[theKey] = keyVal
    })
    return newObj
}

export async function instantiateProductsFromPrettyDKCProducts(prettyProducts) {
    const baseProduct = await store.dispatch['products/instantiateNewProduct']()
    const baseVariant = await store.dispatch['products/instantiateNewProductVariant']()
    return prettyProducts.map(product => {
        const newProduct = JSON.parse(JSON.stringify(baseProduct))
        newProduct.extra_data.aninalOrigin = product.AnimalOrigin
        newProduct.extra_data.blocked = product.Blocked
        newProduct.brand = product.Brand
        newProduct.extra_data.catalog = product.Catalog
        newProduct.composition = product.Composition
        newProduct.description = product.Description
        newProduct.extra_data.designGroup = product.DesignGroup
        newProduct.extra_data.inventory = product.Inventory
        newProduct.title = product.Name
        newProduct.datasource_id = product.No
        newProduct.extra_data.quality = product.Quality
        newProduct.extra_data.season = product.Season
        newProduct.extra_data.sex = product.Sex
        newProduct.category = product.ShopItemGroup
        newProduct.extra_data.topBottom = product.TopBottom
        newProduct.prices = []
        if (product.Variants.length <= 0) {
            product.Variants[0].Prices.map(price => {
                if (!!prices.find(x => x.currenct == price.Currency)) return
                return {
                    currency: price.Country ? `${price.Country} ${price.Currency}` : price.Currency,
                    wholesale_price: price.Value,
                    recommended_retail_price: price.ValueWhl,
                    mark_up:
                        price.Value != null && !!price.ValueWhl
                            ? Number(Math.round(price.Value / price.ValueWhl + 'e' + 2) + 'e-' + 2)
                            : 0,
                }
            })
        }
        newProduct.variants = product.Variants.map(variant => {
            const newVariant = JSON.parse(JSON.stringify(baseVariant))
            newVariant.variant = variant.Color
            newVariant.color = variant.ColorName
            newVariant.extra_data.colorRGB = variant.ColorRGB
            newVariant.ean_sizes = variant.EANs.split(';').map(sizeEan => {
                const sizeComponents = sizeEan.split(':')
                return {
                    size: sizeComponents[0].trim(),
                    ean: sizeComponents[1].trim(),
                }
            })
            // Pictures
            newVariant.pictures = [
                {
                    name: 'Front',
                    url: `https://media.dkcompanyshop.com/images/${newProduct.datasource_id}-${newVariant.variant}/010100?w=1300`,
                },
            ]

            // Calculate the new name
            const nameComponents = []
            if (newVariant.color) nameComponents.push(newVariant.color)
            if (newVariant.variant) nameComponents.push(newVariant.variant)
            const newName = nameComponents.join([' - '])
            newVariant.name = newName
            return newVariant
        })
        return newProduct
    })
}

export async function instantiateProductsFromXml(xml) {
    var parseString = require('xml2js').parseString
    let xmlProducts
    await new Promise((resolve, reject) => {
        parseString(xml, async (err, xmlResult) => {
            const resultJson = JSON.parse(JSON.stringify(xmlResult))
            xmlProducts = resultJson.Products.Product
            resolve()
        })
    })

    const prettyProducts = xmlProducts.map(product => {
        const prettyProduct = {}
        cleanUpDKCObj(product, prettyProduct)
        return prettyProduct
    })

    const newProducts = await instantiateProductsFromPrettyDKCProducts(prettyProducts)
    return newProducts
}
