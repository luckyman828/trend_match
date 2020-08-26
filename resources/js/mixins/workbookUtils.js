export default {
    methods: {
        parseWorkbookToRowsAndCells(workbook) {
            // Use SheetJS to parse the workbook
            const data = new Uint8Array(workbook)
            var workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false })
            const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]]

            const rows = XLSX.utils.sheet_to_json(sheet, {
                raw: true,
                blankrows: false,
                dateNF: 'YYYY-MM-DD',
                defval: null,
            })

            return rows
        },
        validateMappedField(field, rows, depth) {
            // Assume no error
            let isValid = true
            field.error = false

            // Set the limit to a maximum of the number of lines in the file
            const numberOfRowsToValidate = field.customEntry ? 1 : rows.length < depth ? rows.length : depth

            // Test n values
            for (let i = 0; i <= numberOfRowsToValidate - 1; i++) {
                // Find the field value
                const fieldValue = field.customEntry ? field.fieldName : rows[i][field.fieldName]
                // If we have set a custom value, then test that instead

                // Test that the field actually has a value
                if (fieldValue && isValid) {
                    // Test for integers
                    if (field.type == 'number') {
                        if (isNaN(fieldValue)) {
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
                        const dateValue = new Date(valueToTest)
                        if (!dateValue instanceof Date || isNaN(dateValue)) {
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
        autoMapField(field, availableFields, matchesToAvoid) {
            let foundMatch = false
            let allMatches = []
            availableFields.forEach(fieldCollection => {
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
        instantiateProductsFromMappedFields(mappedFields, files) {
            const products = []
            files.map(file => {
                const keyField = file.mappedKey.fieldName
                if (!keyField) return

                file.rows.map(row => {
                    // Find the product corresponding to this row, or instantiate a new product if none exists
                    const keyValue = row[keyField]

                    const existingProduct = products.find(x => x.datasource_id == keyValue)
                    const baseProduct = {
                        datasource_id: keyValue,
                        variants: [],
                        prices: [],
                        assortments: [],
                        eans: [],
                    }
                    const product = existingProduct ? existingProduct : baseProduct

                    console.log('made it 1')

                    if (!existingProduct) {
                        products.push(product)
                    }

                    console.log('made it 2')

                    mappedFields.map(field => {
                        if (
                            !field.enabled ||
                            (!field.customEntry && (!field.file || field.file.fileName != file.fileName))
                        )
                            return
                        const fieldValue = field.customEntry ? field.fieldName : row[field.fieldName]

                        // START MAP VARIANTS
                        if (field.scope == 'variants' || field.scope == 'images') {
                            console.log('made it variants')
                            // Find the variant key
                            const variantKeyField = file.variantKey.fieldName
                            const variantKeyValue = row[variantKeyField]
                            // If we don't have any variant key, just give up
                            if (!variantKeyValue) return

                            // Check if the variant already exists
                            let variant = product.variants.find(x => x.mappingKeyValue == variantKeyValue)
                            if (!variant) {
                                variant = {
                                    name: null,
                                    sizes: [],
                                    pictures: [],
                                    mappingKeyValue: variantKeyValue, // Save a temporary key property on the variant, that we can use for mapping the same variants together
                                    // This actually allows us to link variants by a key that is not included on the variant object itself
                                }
                                product.variants.push(variant)
                            }

                            console.log('found a variant')

                            // Now that we have our variant, it's just a question of setting the values
                            const variantField = variant[field.name]

                            if (field.name == 'image') {
                                console.log('is image', variantField, fieldValue)
                                const valueExistsInArray = variant.pictures.find(x => x.url == fieldValue)
                                if (!valueExistsInArray)
                                    variant.pictures.push({
                                        name: null,
                                        url: fieldValue,
                                    })
                                return
                            }

                            if (Array.isArray(variantField)) {
                                console.log('is array')
                                const valueExistsInArray = variantField.includes(fieldValue)
                                if (!valueExistsInArray) variantField.push(fieldValue)
                                return
                            }

                            console.log('is not array')
                            variant[field.name] = fieldValue
                            return
                        }
                        // END MAP VARIANTS

                        // START MAP PRICES
                        if (field.scope == 'prices') {
                            console.log('made it prices')
                            // Check if the price group already exists
                            let priceGroup = product.prices.find(x => x.mappingGroupId == field.groupId)
                            if (!priceGroup) {
                                priceGroup = {
                                    mappingGroupId: field.groupId, // Save a temporary key to the price group to match them by
                                    currency: null,
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
                        if (field.scope == 'assortments') {
                            console.log('made it assortments')
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
                        console.log('made it past assortmetns')
                        // END MAP ASSORTMENTS

                        // NO SCOPE
                        const productField = product[field.name]
                        if (Array.isArray(productField)) {
                            console.log('is array')
                            const valueExistsInArray = productField.includes(fieldValue)
                            if (!valueExistsInArray) productField.push(fieldValue)
                            return
                        }
                        product[field.name] = fieldValue
                    })
                    console.log('made it past all')
                })
            })

            return products
        },
    },
}
