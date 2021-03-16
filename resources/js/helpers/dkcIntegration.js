import { parse, v4 as uuidv4 } from 'uuid'
import store from '../store/'
export function cleanUpDKCObj(srcObj, newObj) {
    Object.keys(srcObj).map(key => {
        let theKey = key
        let keyVal = srcObj[key]
        if (keyVal == null) return

        if (key == 'variants' && !Array.isArray(keyVal.variant)) {
            keyVal = [keyVal.variant]
        }

        // Flatten objects in objects
        // console.log('before flatten', theKey, keyVal)
        if (!Array.isArray(keyVal) && typeof keyVal == 'object' && Object.keys(keyVal).length == 1) {
            const newKey = Object.keys(keyVal)[0]
            if (!['variant', 'price', 'size', 'assortment'].includes(newKey)) {
                theKey = newKey
            }
            keyVal = keyVal[newKey]
        }
        // console.log('after flatten', theKey, keyVal)

        if (Array.isArray(keyVal) && keyVal.length > 0) {
            if (keyVal[0]._language) {
                keyVal = keyVal.find(x => x._language == 'ENU')._value
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

export async function instantiateDKCProducts(products) {
    const prettyProducts = products.map(product => {
        const prettyProduct = {}
        cleanUpDKCObj(product, prettyProduct)
        return prettyProduct
    })

    console.log('pretty products', prettyProducts)

    const baseProduct = await store.dispatch('products/instantiateNewProduct')
    const baseVariant = await store.dispatch('products/instantiateNewProductVariant')

    const newProducts = prettyProducts.map(product => {
        const newProduct = JSON.parse(JSON.stringify(baseProduct))
        newProduct.extra_data.aninalOrigin = product.animal_origin
        newProduct.extra_data.blocked = product.blocked
        newProduct.brand = product.brand
        newProduct.extra_data.catalog = product.catalog
        newProduct.composition = product.composition
        newProduct.description = product.description
        newProduct.extra_data.designGroup = product.design_group
        newProduct.extra_data.inventory = product.inventory
        newProduct.title = product.name
        newProduct.datasource_id = product.no
        newProduct.extra_data.quality = product.quality
        newProduct.extra_data.season = product.season
        newProduct.extra_data.sex = product.sex
        newProduct.category = product.shop_item_group
        newProduct.extra_data.topBottom = product.top_bottom
        if (product.variants.length > 0) {
            product.variants[0].prices.map(price => {
                if (!!newProduct.prices.find(x => x.currency == price._currency)) return
                const wholesale_price = parseFloat(price._value_whl.replace(/,/g, ''))
                const recommended_retail_price = parseFloat(price._value.replace(/,/g, ''))
                const newPrice = {
                    currency: price._country ? `${price._country} ${price._currency}` : price._currency,
                    wholesale_price,
                    recommended_retail_price,
                    mark_up:
                        wholesale_price != null && !!recommended_retail_price
                            ? Number(Math.round(recommended_retail_price / wholesale_price + 'e' + 2) + 'e-' + 2)
                            : 0,
                }
                newProduct.prices.push(newPrice)
            })
        }
        // VARIANTS
        newProduct.variants = !product.variants
            ? []
            : product.variants.map(variant => {
                  const newVariant = JSON.parse(JSON.stringify(baseVariant))
                  newVariant.id = uuidv4()
                  newVariant.variant = variant.color
                  newVariant.color = variant.color_name
                  newVariant.extra_data.colorRGB = variant.color_rgb
                  newVariant.ean_sizes = variant.ea_ns.split(';').map(sizeEan => {
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

                  // ASSORTMENTS
                  variant.assortments.map(assortment => {
                      const newAssortment = {
                          variant_ids: [newVariant.id],
                          box_size: assortment.assortment_pieces,
                          box_ean: null,
                          delivery_dates: [],
                          name: `${assortment.code}${assortment.assortment_variant
                              .map(x => `;${x.size_code}:${x.quantity}`)
                              .join('')}`,
                      }
                      newProduct.assortments.push(newAssortment)
                  })

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
    return newProducts
}

export default instantiateDKCProducts
