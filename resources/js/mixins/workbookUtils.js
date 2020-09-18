export default {
    methods: {
        parseWorkbookToRowsAndCells(workbook) {
            // Use SheetJS to parse the workbook
            const data = new Uint8Array(workbook)
            var workbook = XLSX.read(data, {
                type: 'array',
                cellDates: true,
                cellNF: false,
                cellText: false,
            })
            const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]]

            const rows = XLSX.utils.sheet_to_json(sheet, {
                raw: true,
                blankrows: false,
                defval: null,
            })

            return rows
        },
        validateMappedField(field, rows, depth) {
            // Assume no error
            let isValid = true
            field.error = false
            if (!field.enabled) return isValid

            // Set the limit to a maximum of the number of lines in the file
            const numberOfRowsToValidate = field.customEntry
                ? 1
                : // If no depth has been provided
                depth == null
                ? rows.length
                : // If we have a depth
                rows.length < depth
                ? rows.length
                : depth

            // Test n values
            for (let i = 0; i <= numberOfRowsToValidate - 1; i++) {
                // Find the field value
                const fieldValue = field.customEntry ? field.fieldName : rows[i][field.fieldName]
                // If we have set a custom value, then test that instead

                // Test that the field actually has a value
                if (fieldValue && isValid) {
                    // Test for integers
                    if (field.type == 'number') {
                        if (typeof fieldValue != 'number' && !parseInt(fieldValue)) {
                            field.error = `Must be a <strong>number</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i + 2}</strong>`
                            isValid = false
                        }
                    }
                    // Test for correct date
                    if (field.type == 'date') {
                        // Check for special cases where the date is of format mmm-yy ("jan-20") which will be parsed incorrectly by the new Date() function
                        // Regex that looks for a work with exactly 3 characters between A-z.
                        const reg = new RegExp('\\b[A-z]{3}\\b')
                        let valueToTest = JSON.parse(JSON.stringify(fieldValue))
                        if (reg.test(valueToTest)) {
                            // If true then add a "1-" to the date to avoid ambiguity
                            valueToTest = '1-' + valueToTest
                        }
                        const isNumber = typeof valueToTest == 'number'
                        const dateValue = new Date(valueToTest)
                        if (!dateValue instanceof Date || isNaN(dateValue) || isNumber) {
                            field.error = `Invalid <strong>Date format</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i + 2}</strong>
                            <br>Make sure that values only contain <strong>English</strong> month names`
                            isValid = false
                        }
                    }
                    // Test for correct url
                    if (field.type == 'url') {
                        const urlReg = new RegExp(
                            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/
                        )
                        if (!urlReg.test(fieldValue)) {
                            field.error = `Must be a <strong>valid URL</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i + 2}</strong>`
                            isValid = false
                        }
                    }
                    if (field.name == 'currency' && fieldValue.length !== 3) {
                        field.error = `Must be a <strong>3 letter</strong> currency code, like "EUR".
                        <br>Found value: <i>${fieldValue}</i> on <strong>line ${i + 2}</strong>`
                        isValid = false
                    }
                }
            }
            return isValid
        },
        autoMapField(field, availableFiles, matchesToAvoid) {
            // console.log('automap', field)
            let foundMatch = false
            let allMatches = []
            availableFiles.forEach(fieldCollection => {
                const matches = fieldCollection.headers.filter(header =>
                    field.headersToMatch.find(headerMatch => {
                        return header.toLowerCase().search(headerMatch) >= 0
                    })
                )
                allMatches.push({
                    file: fieldCollection,
                    matches,
                })

                if (foundMatch) return

                if (matches.length > 0) {
                    let match = matches[0]

                    if (matchesToAvoid) {
                        // Find a match that is not included in the matched to avoid array
                        match = matches.find(
                            theMatch =>
                                !matchesToAvoid.find(
                                    x => x.fieldName == theMatch && x.fileName == fieldCollection.fileName
                                )
                        )
                    }
                    if (match) {
                        foundMatch = true
                        field.fieldName = match
                        field.file = fieldCollection
                        field.autoMatched = true
                    }
                }
            })
            return allMatches
        },
        instantiateProductsFromMappedFields(mappedFields, files, options) {
            // Obey options if provided
            const fieldsToInstantiateFrom = !options
                ? mappedFields
                : mappedFields.filter(field => {
                      if (field.scope) {
                          // Check for the special case of images
                          if (
                              field.scope == 'images' &&
                              this.uploadOptions.scopes.find(x => x.name == 'variants').enabled
                          )
                              return true

                          return this.uploadOptions.scopes.find(x => x.name == field.scope).enabled
                      }
                      return this.uploadOptions.fields.find(x => x.name == field.name).enabled
                  })

            const products = []
            files.map(file => {
                const keyField = file.mappedKey.fieldName
                if (!keyField) return

                file.rows.map(row => {
                    let rowCurrency = null

                    // Find the product corresponding to this row, or instantiate a new product if none exists
                    const keyValue = row[keyField]

                    const existingProduct = products.find(x => x.datasource_id == keyValue)
                    const baseProduct = {
                        id: null,
                        datasource_id: keyValue,
                    }

                    // Instantiate arrays based on options if any
                    if (!options || options.scopes.find(x => x.name == 'variants').enabled) baseProduct.variants = []
                    if (!options || options.scopes.find(x => x.name == 'prices').enabled) baseProduct.prices = []
                    if (!options || options.scopes.find(x => x.name == 'assortments').enabled)
                        baseProduct.assortments = []
                    if (!options || options.fields.find(x => x.name == 'eans').enabled) baseProduct.eans = []
                    baseProduct.delivery_dates = []

                    const product = existingProduct ? existingProduct : baseProduct

                    if (!existingProduct) {
                        products.push(product)
                    }

                    fieldsToInstantiateFrom.map(field => {
                        if (
                            !field.enabled ||
                            (!field.customEntry && (!field.file || field.file.fileName != file.fileName))
                        )
                            return
                        let fieldValue = field.customEntry ? field.fieldName : row[field.fieldName]

                        // Limit decimals to 2 places
                        if (typeof fieldValue == 'number')
                            fieldValue = Math.round((fieldValue + Number.EPSILON) * 100) / 100

                        // Format date values
                        if (field.type == 'date') {
                            // If the field value is not null, format it as a date
                            if (fieldValue instanceof Date) {
                                fieldValue = DateTime.fromJSDate(fieldValue).toISODate()
                            }
                        }

                        // START MAP VARIANTS
                        // console.log('at least try try map variants?')
                        if (product.variants) {
                            // Loop through our variant keys
                            file.variantKeyList.map(variantKey => {
                                if (!variantKey.customEntry && !field.file && !field.fileName) return
                                // console.log('instantiate variant')

                                // Find the variant key
                                const variantKeyField = variantKey.fieldName
                                const variantKeyValue = variantKey.customEntry
                                    ? variantKey.fieldName
                                    : row[variantKeyField]
                                // If we don't have any variant key, just give up
                                if (!variantKeyValue) return
                                // console.log('variantKeyValue', variantKeyValue)

                                // Check if the variant already exists
                                let variant = product.variants.find(x => x.mappingKeyValue == variantKeyValue)
                                if (!variant) {
                                    variant = {
                                        id: this.$uuid.v4(), // We have to generate a UUID for our variants ourselves
                                        name: variantKeyValue,
                                        sizes: [],
                                        pictures: [],
                                        image: null,
                                        images: [],
                                        ean: null,
                                        ean_sizes: [{ size: null, ean: null }],
                                        mappingKeyValue: variantKeyValue, // Save a temporary key property on the variant, that we can use for mapping the same variants together
                                        // This actually allows us to link variants by a key that is not included on the variant object itself
                                    }
                                    product.variants.push(variant)
                                }

                                // console.log('product variants', product.variants)
                                if (!(field.scope == 'variants' || field.scope == 'images')) return

                                // Now that we have our variant, it's just a question of setting the values
                                const variantField = variant[field.name]

                                if (field.name == 'image') {
                                    const valueExistsInArray = variant.pictures.find(x => x.url == fieldValue)
                                    if (!valueExistsInArray && fieldValue)
                                        variant.pictures.push({
                                            name: null,
                                            url: fieldValue,
                                        })
                                    return
                                }

                                // Variant Sizes with EANS
                                // ATT!: This code assumes that every variant size/ean pair comes in a chronological order
                                if (field.name == 'sizes') {
                                    // Check if the value already exists
                                    const existingSize = variant.ean_sizes.find(x => x.size == fieldValue)
                                    if (!existingSize) {
                                        // Check if we have an object with no size set
                                        const noSizeSet = variant.ean_sizes.find(x => !x.size)
                                        // If we have an object with no size set, set its size
                                        if (noSizeSet) noSizeSet.size = fieldValue
                                        else variant.ean_sizes.push({ size: fieldValue, ean: null })
                                    }
                                }
                                if (field.name == 'ean') {
                                    const existingEan = variant.ean_sizes.find(x => x.ean == fieldValue)
                                    if (!existingEan) {
                                        // Check if we have an object with no size set
                                        const noEanSet = variant.ean_sizes.find(x => !x.ean)
                                        // If we have an object with no size set, set its size
                                        if (noEanSet) noEanSet.ean = fieldValue
                                        else variant.ean_sizes.push({ size: null, ean: fieldValue })
                                    }
                                }

                                if (Array.isArray(variantField)) {
                                    const valueExistsInArray = variantField.includes(fieldValue)
                                    if (!valueExistsInArray) variantField.push(fieldValue)
                                    return
                                }

                                variant[field.name] = fieldValue
                            })
                        }
                        // END MAP VARIANTS

                        // START MAP PRICES
                        if (product.prices && field.scope == 'prices') {
                            // Find the currency for this row && field to map.
                            // This only works because the currency field is always the first price field being mapped
                            if (field.name == 'currency') {
                                rowCurrency = fieldValue
                            }

                            // Check if the price group already exists
                            let priceGroup = product.prices.find(
                                x => x.mappingGroupId == field.groupId && x.currency == rowCurrency
                            )
                            if (!priceGroup) {
                                priceGroup = {
                                    mappingGroupId: field.groupId, // Save a temporary key to the price group to match them by
                                    currency: rowCurrency,
                                    wholesale_price: null,
                                    recommended_retail_price: null,
                                    mark_up: null,
                                }
                                product.prices.push(priceGroup)
                            }

                            // Now that we have our price group, we simply map the values
                            priceGroup[field.name] = fieldValue
                            return
                        }
                        // END MAP PRICES

                        // START MAP ASSORTMENTS
                        if (product.assortments && field.scope == 'assortments') {
                            let assortmentGroup = product.assortments.find(x => x.mappingGroupId == field.groupId)
                            if (!assortmentGroup) {
                                assortmentGroup = {
                                    mappingGroupId: field.groupId,
                                    name: null,
                                    box_ean: null,
                                    box_size: null,
                                }
                                product.assortments.push(assortmentGroup)
                            }
                            // Set values for the assortment group
                            assortmentGroup[field.name] = fieldValue
                            return
                        }
                        // END MAP ASSORTMENTS

                        // NO SCOPE
                        const productField = product[field.name]
                        if (Array.isArray(productField)) {
                            const valueExistsInArray = productField.includes(fieldValue)
                            if (!valueExistsInArray && fieldValue != null) productField.push(fieldValue)
                            return
                        }
                        product[field.name] = fieldValue
                    })
                })
            })

            // Remove assortments with no name
            products.map(product => {
                if (product.assortments) {
                    product.assortments = product.assortments.filter(x => !!x.name)
                }
            })

            // Remove products with no ID
            return products.filter(x => !!x.datasource_id)
        },
    },
}
