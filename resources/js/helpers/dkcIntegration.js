import { DateTime, Interval } from 'luxon'
import { parse, v4 as uuidv4 } from 'uuid'
import variantImage from '../mixins/variantImage'
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
            if (keyVal[0].language) {
                keyVal = keyVal.find(x => x.language == 'ENU').value
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
                if (!!newProduct.prices.find(x => x.currency == price.currency)) return
                const wholesale_price = price.value_whl ? parseFloat(price.value_whl.replace(/,/g, '')) : null
                const recommended_retail_price = price.value ? parseFloat(price.value.replace(/,/g, '')) : null
                const newPrice = {
                    currency: price._country ? `${price.country} ${price.currency}` : price.currency,
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
                  const imageUrl = `https://media.dkcompanyshop.com/images/${newProduct.datasource_id}-${newVariant.variant}/010100?w=1300`

                  newVariant.pictures = [
                      {
                          name: 'Front',
                          url: imageUrl,
                      },
                  ]

                  // DELIVERY
                  if (variant.delivery_window) {
                      const fromDate = DateTime.fromISO(variant.delivery_window.shipment_from).startOf('month')
                      const toDate = DateTime.fromISO(variant.delivery_window.shipment_to).endOf('month')
                      let dateInterval = Interval.fromDateTimes(fromDate, toDate)
                      let monthCount = Math.ceil(dateInterval.length('month'))
                      for (let i = 0; i < monthCount; i++) {
                          const deliveryDate = fromDate.set({ month: fromDate.get('month') + i }).toFormat('yyyy-MM-dd')
                          newVariant.delivery_dates.push(deliveryDate)
                          // Check if we should also add the delivery date to the product
                          if (!newProduct.delivery_dates.includes(deliveryDate)) {
                              newProduct.delivery_dates.push(deliveryDate)
                          }
                      }
                  }

                  // ASSORTMENTS
                  variant.assortments &&
                      variant.assortments.map(assortment => {
                          const newAssortment = {
                              variant_ids: [newVariant.id],
                              box_size: assortment.assortment_pieces,
                              box_ean: null,
                              delivery_dates: newVariant.delivery_dates,
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

    // // Loop through all pictures and check if they exist
    // const allPictures = []
    // newProducts.map(product => {
    //     product.variants.map(variant => {
    //         allPictures.push(...variant.pictures)
    //     })
    // })
    // await Promise.all(allPictures.map(picture => {
    //     // Check if the image exists / is available
    //     await new Promise((resolve, reject) => {
    //         const imageTest = new Image()
    //         imageTest.src = picture.url
    //         console.log('the image test', imageTest.width, imageUrl)
    //     })
    // }))

    return newProducts
}

export function getVariantBackgroundStyle(variant) {
    const url = variantImage.methods.variantImage(variant, { size: 'sm' })
    if (url != '/images/placeholder.JPG') {
        return { backgroundImage: `url(${url})` }
    }
    const colorRGB = variant.extra_data.colorRGB
    if (!colorRGB) return
    const rgbComponents = colorRGB.split(';')
    return { backgroundColor: `rgb(${rgbComponents[0]} ${rgbComponents[1]} ${rgbComponents[2]})` }
}

export default instantiateDKCProducts
