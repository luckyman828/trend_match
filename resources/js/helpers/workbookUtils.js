import { parse, v4 as uuidv4 } from 'uuid'
export function parseWorkbookToRowsAndCells(workbook, noHeaderRow) {
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
        header: noHeaderRow ? 'A' : false,
    })

    return rows
}

export function parseCSVStringToRowsAndCells(string, noHeaderRow) {
    // Use SheetJS to parse the workbook
    // const data = new Uint8Array(workbook)
    var workbook = XLSX.read(string, {
        type: 'string',
        cellDates: true,
        cellNF: false,
        cellText: false,
    })
    const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]]

    const rows = XLSX.utils.sheet_to_json(sheet, {
        raw: true,
        blankrows: false,
        defval: null,
        header: noHeaderRow ? 'A' : false,
    })

    return rows
}

export function validateMappedField(field, rows, depth) {
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
                const isNumber = typeof fieldValue == 'number'
                const canBeParsedAsNumber = !!parseInt(fieldValue)
                const changesLengthWhenParsed =
                    typeof fieldValue == 'string' && parseInt(fieldValue).toString().length != fieldValue.length
                if (!isNumber && (!canBeParsedAsNumber || changesLengthWhenParsed)) {
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
}

export function autoMapField(field, availableFiles, matchesToAvoid, mustInclude) {
    let foundMatch = false
    let allMatches = []
    availableFiles.forEach(fieldCollection => {
        const matches = fieldCollection.headers.filter(header =>
            field.headersToMatch.find(headerMatch => {
                const headerToMatch = typeof headerMatch == 'string' ? headerMatch.toLowerCase() : headerMatch
                return header.toLowerCase().search(headerToMatch) >= 0
            })
        )
        allMatches.push({
            file: fieldCollection,
            matches,
        })

        if (foundMatch) return

        if (matches.length > 0) {
            let match = matches[0]

            if (matchesToAvoid || mustInclude) {
                // Find a match that is not included in the matched to avoid array
                match = matches.find(theMatch => {
                    // Check that the match is not included in our avoid array, and that the match includes the string that it must include
                    const passesMustInclude =
                        !mustInclude || theMatch.toLowerCase().search(mustInclude.toLowerCase()) >= 0
                    const passesMatchesToAvoid =
                        !matchesToAvoid ||
                        !matchesToAvoid.find(x => x.fieldName == theMatch && x.fileName == fieldCollection.fileName)
                    return passesMustInclude && passesMatchesToAvoid
                })
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
}

export function instantiateProductsFromMappedFields(mappedFields, files, options) {
    // Obey options if provided
    const fieldsToInstantiateFrom = !options
        ? mappedFields
        : mappedFields.filter(field => {
              if (field.scope) {
                  // Check for the special case of images
                  if (field.scope == 'images' && this.uploadOptions.scopes.find(x => x.name == 'variants').enabled)
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
            let rowAssortmentName = null

            // Find the product corresponding to this row, or instantiate a new product if none exists
            const keyValue = row[keyField]

            const existingProduct = products.find(x => x.datasource_id == keyValue)
            const baseProduct = {
                id: null,
                datasource_id: keyValue,
                extra_data: {},
                labels: [],
            }

            // Instantiate arrays based on options if any
            if (!options || options.scopes.find(x => x.name == 'variants').enabled) baseProduct.variants = []
            if (!options || options.scopes.find(x => x.name == 'prices').enabled) baseProduct.prices = []
            if (!options || options.scopes.find(x => x.name == 'assortments').enabled) {
                baseProduct.assortments = []
            }
            if (!options || options.fields.find(x => x.name == 'eans').enabled) baseProduct.eans = []
            if (!options || options.fields.find(x => x.name == 'assortment_sizes').enabled)
                baseProduct.assortment_sizes = []
            if (!options || options.fields.find(x => x.name == 'delivery_dates' && !x.scope).enabled)
                baseProduct.delivery_dates = []

            // Add custom product data if we have any
            mappedFields
                .filter(x => x.customProperty && x.scope != 'variants')
                .map(extraField => {
                    baseProduct.extra_data[extraField.customProperty.name] =
                        extraField.customProperty.type == 'Array' ? [] : null
                })

            const product = existingProduct ? existingProduct : baseProduct

            if (!existingProduct) {
                products.push(product)
            }

            // INSTANTIATE VARIANTS
            // All variants should be instantiated before we start looping through our fields,
            // to avoid cases where a value should be set on a variant that is yet to be instantiated.
            // Product variants are unique by COLOR and VARIANT
            const colorFields = fieldsToInstantiateFrom.filter(
                field =>
                    field.name == 'color' &&
                    field.file &&
                    field.file.fileName == file.fileName &&
                    (!!field.enabled || !!field.customEntry)
            )
            const variantFields = fieldsToInstantiateFrom.filter(
                field =>
                    field.name == 'variant' &&
                    field.file &&
                    field.file.fileName == file.fileName &&
                    (!!field.enabled || !!field.customEntry)
            )

            if (product.variants && (variantFields.length > 0 || colorFields.length > 0)) {
                // If we have a new unique combination of color and variant, push those

                for (let i = 0; i < Math.max(colorFields.length, 1); i++) {
                    const colorField = colorFields[i]
                    let color = null
                    if (colorField) color = colorField.customEntry ? colorField.fieldName : row[colorField.fieldName]
                    if (color == 'null') color = null
                    for (let j = 0; j < Math.max(variantFields.length, 1); j++) {
                        const variantField = variantFields[j]
                        let variant = null
                        if (variantField)
                            variant = variantField.customEntry ? variantField.fieldName : row[variantField.fieldName]
                        if (variant == 'null') variant = null

                        // Instantiate a basevariant
                        const baseVariant = {
                            id: uuidv4(), // We have to generate a UUID for our variants ourselves
                            style_option_id: null,
                            color,
                            variant,
                            sizes: [],
                            pictures: [],
                            image: null,
                            images: [],
                            ean: null,
                            ean_sizes: [{ size: null, ean: null }],
                            extra_data: {},
                        }

                        if (mappedFields.find(x => x.name == 'delivery_dates' && x.scope == 'variants').enabled) {
                            baseVariant.delivery_dates = []
                        }
                        // Add custom product data if we have any
                        mappedFields
                            .filter(x => x.customProperty && x.scope == 'variants')
                            .map(extraField => {
                                baseVariant.extra_data[extraField.customProperty.name] =
                                    extraField.customProperty.type == 'Array' ? [] : null
                            })

                        const existsInArray = !!product.variants.find(
                            x => (!color || x.color == color) && (!variant || x.variant == variant)
                        )
                        if (existsInArray) continue
                        product.variants.push(baseVariant)
                    }
                }
            }

            fieldsToInstantiateFrom.map(field => {
                if (!field.enabled || (!field.customEntry && (!field.file || field.file.fileName != file.fileName)))
                    return
                let fieldValue = field.customEntry ? field.fieldName : row[field.fieldName]

                // Limit decimals to 2 places
                if (typeof fieldValue == 'number') fieldValue = Math.round((fieldValue + Number.EPSILON) * 100) / 100

                // Dont have null values
                if (fieldValue == 'null') fieldValue = null

                // Format date values
                if (field.type == 'date' && fieldValue != null) {
                    if (!(fieldValue instanceof Date)) {
                        const date = new Date(fieldValue)
                        // Check if the date is a valid date
                        if (!isNaN(date)) {
                            // Add a few days to make sure we stay in the same month no matter timezone..
                            date.setDate(date.getDate() + 3)
                            fieldValue = date
                        }
                    }
                    // If the field value is not null, format it as a date
                    if (fieldValue instanceof Date) {
                        fieldValue = DateTime.fromJSDate(fieldValue).toISODate()
                    }
                }

                // START MAP VARIANTS
                //Don't set name or variant of variants
                if (['variant', 'color'].includes(field.name)) return
                if (
                    product.variants &&
                    (field.scope == 'variants' || field.scope == 'images' || field.name == 'eans')
                ) {
                    let variantFieldHasBeenProcessed
                    // Find all variants of this row
                    for (let i = 0; i < Math.max(colorFields.length, 1); i++) {
                        const colorField = colorFields[i]
                        let color = null
                        if (colorField)
                            color = colorField.customEntry ? colorField.fieldName : row[colorField.fieldName]
                        for (let j = 0; j < Math.max(variantFields.length, 1); j++) {
                            const theVariantField = variantFields[j]
                            let variantVariant = null
                            if (theVariantField)
                                variantVariant = theVariantField.customEntry
                                    ? theVariantField.fieldName
                                    : row[theVariantField.fieldName]

                            const variant = product.variants.find(x => x.color == color && x.variant == variantVariant)

                            if (!variant) continue

                            // Now that we have our variant, it's just a question of setting the values
                            const variantField = field.customProperty
                                ? variant.extra_data[field.name]
                                : variant[field.name]

                            if (field.name == 'image') {
                                const valueExistsInArray = variant.pictures.find(
                                    x => x.url == fieldValue || x.name == fieldValue
                                )
                                if (!valueExistsInArray && fieldValue)
                                    variant.pictures.push({
                                        name: fieldValue,
                                        url: fieldValue,
                                    })
                                variantFieldHasBeenProcessed = true
                                continue
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
                                variantFieldHasBeenProcessed = true
                                continue
                            }
                            if (field.name == 'eans') {
                                // Set the variant ean
                                if (!variant.ean) variant.ean = fieldValue

                                // Add the EAN to the products EANs
                                if (product.eans) {
                                    const existsInArray = product.eans.find(x => x == fieldValue)
                                    if (!existsInArray) product.eans.push(fieldValue)
                                }

                                // Set ean_sizes
                                const existingEan = variant.ean_sizes.find(x => x.ean == fieldValue)
                                if (!existingEan) {
                                    // Check if we have an object with no ean set
                                    const noEanSet = variant.ean_sizes.find(x => !x.ean)
                                    // If we have an object with no size set, set its size
                                    if (noEanSet) noEanSet.ean = fieldValue
                                    else variant.ean_sizes.push({ size: null, ean: fieldValue })
                                }
                                variantFieldHasBeenProcessed = true
                                continue
                            }

                            if (Array.isArray(variantField)) {
                                const valueExistsInArray = variantField.includes(fieldValue)
                                if (!valueExistsInArray) variantField.push(fieldValue)
                                variantFieldHasBeenProcessed = true
                                continue
                            }

                            // Set value of an object. This should take care of custom product data
                            if (field.customProperty) {
                                variant.extra_data[field.name] = fieldValue
                                variantFieldHasBeenProcessed = true
                                continue
                            }

                            variant[field.name] = fieldValue
                        }
                    }
                    if (variantFieldHasBeenProcessed) return
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
                    // Find the assortment name for this row && field to map.
                    // This only works because the assortment name field is always the first assortment field being mapped
                    if (field.name == 'name') {
                        rowAssortmentName = fieldValue
                    }

                    // Check if the assortment group already exists
                    let assortmentGroup = product.assortments.find(
                        x => x.mappingGroupId == field.groupId && x.name == rowAssortmentName
                    )
                    if (!assortmentGroup) {
                        assortmentGroup = {
                            mappingGroupId: field.groupId,
                            name: rowAssortmentName,
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
                const productField = field.customProperty ? product.extra_data[field.name] : product[field.name]
                if (Array.isArray(productField)) {
                    const valueExistsInArray = productField.includes(fieldValue)
                    // Only push if we actually have a fieldValue
                    if (!valueExistsInArray && !!fieldValue) productField.push(fieldValue)
                    return
                }

                // Set value of an object. This should take care of custom product data
                if (field.customProperty) {
                    product.extra_data[field.name] = fieldValue
                    return
                }

                product[field.name] = fieldValue
            })
        })
    })

    // CLEANING UP
    products.map(product => {
        // Remove assortments with no name
        if (product.assortments) {
            product.assortments = product.assortments.filter(x => !!x.name)
        }
        // Generate the product variant name
        if (product.variants) {
            product.variants.map(variant => {
                // Calculate the new name
                const nameComponents = []
                if (variant.color) nameComponents.push(variant.color)
                if (variant.variant) nameComponents.push(variant.variant)
                const newName = nameComponents.join([' - '])
                variant.name = newName
            })
        }
    })
    // Remove products with no ID
    return products.filter(x => !!x.datasource_id)
}
