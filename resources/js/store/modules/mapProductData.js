export default {
    namespaced: true,

    state: {
        fieldIndex: 0,
        productFields: [
            // KEYS
            {
                scope: 'key',
                name: 'datasource_id',
                displayName: 'ID',
                type: 'number',
                headersToMatch: [
                    'id',
                    'style number',
                    'style no',
                    'style no.',
                    'product id',
                    'number',
                    'style_no',
                    'style_number',
                ],
            },
            // {
            //     scope: 'variantKey',
            //     name: 'variant_key',
            //     displayName: 'Variant key',
            //     type: 'string',
            //     headersToMatch: [
            //         '^(?!.*(minimum|quantity|size|qty|ean|min|image|url)).*(variant|color|colour|box).*$',
            //         // Match 'variant', 'color' or 'colour', but not if the string contains 'minimum', 'quantity', or 'size'
            //         'variant name',
            //         'color name',
            //         'colour name',
            //         'main colour name',
            //         'colour_name',
            //     ],
            // },
            // {
            //     scope: 'assortmentKey',
            //     name: 'assortment_key',
            //     displayName: 'Assortment key',
            //     type: 'string',
            //     headersToMatch: [
            //         'assortment name',
            //         'box name',
            //         'ass name',
            //         'box(?!.*(size|ean))', // box not followed by 'size' or 'ean'
            //         'assortment(?!.*(size|ean))', // assortment not followed by 'size' or 'ean'
            //     ],
            // },
            // {
            //     scope: 'priceKey',
            //     name: 'price_key',
            //     displayName: 'Price key',
            //     type: 'string',
            //     headersToMatch: ['currency', 'currency name'],
            // },
            // DEFAULT
            {
                scope: null,
                name: 'title',
                displayName: 'Name',
                type: 'string',
                headersToMatch: [
                    'title',
                    '^(?!.*department).*name.*$',
                    'style name',
                    'product name',
                    'style_name',
                    'product_name',
                ],
            },
            {
                scope: null,
                name: 'sale_description',
                displayName: 'Description',
                type: 'string',
                headersToMatch: ['description', 'sales description'],
            },
            {
                scope: null,
                name: 'brand',
                displayName: 'Brand',
                type: 'string',
                headersToMatch: ['brand', 'brand name', 'brand_name'],
            },
            {
                scope: null,
                name: 'category',
                displayName: 'Category',
                type: 'string',
                headersToMatch: ['category', 'style category', 'product category'],
            },
            {
                scope: null,
                name: 'min_order',
                displayName: 'Minimum Order Quantity',
                type: 'number',
                headersToMatch: [
                    'minimum',
                    'minimum quantity',
                    'quantity',
                    'minimum order quantity',
                    'order minimum',
                    'order minimum quantity',
                ],
            },
            {
                scope: null,
                name: 'min_variant_order',
                displayName: 'Minimum Variant Quantity',
                type: 'number',
                headersToMatch: [
                    'variant minimum',
                    'variant minimum quantity',
                    'minimum variant',
                    'minimum variant quantity',
                    'color minimum',
                    'colour minimum',
                    'minimum per color',
                ],
            },
            {
                scope: null,
                name: 'composition',
                displayName: 'Composition',
                type: 'string',
                headersToMatch: ['composition', 'material'],
            },
            {
                scope: null,
                name: 'delivery_dates',
                displayName: 'Delivery (date/month)',
                type: 'date',
                headersToMatch: [
                    'delivery',
                    'delivery date',
                    'delivery month',
                    'del. date',
                    'del. month',
                    'del. period',
                    'delivery period',
                ],
            },
            {
                scope: null,
                name: 'editors_choice',
                displayName: 'Editors Choice',
                type: 'boolean',
                headersToMatch: ['editors choice', 'focus', 'focus style', 'focus product'],
            },
            {
                scope: null,
                name: 'eans',
                displayName: 'EANs',
                type: 'number',
                headersToMatch: ['eans', 'ean', 'variant ean', 'style ean', 'ean_no'],
            },
            {
                scope: null,
                name: 'buying_group',
                displayName: 'Buyer Group',
                headersToMatch: ['buyer group', 'buyer', 'pricelist', 'buying group'],
            },
            {
                scope: null,
                name: 'assortment_sizes',
                displayName: 'Custom Assortment Sizes',
                headersToMatch: ['box size', 'assortment box size', 'ass size', 'assortment size'],
            },
            // VARIANTS
            // {
            //     scope: 'variants',
            //     name: 'name',
            //     displayName: 'Variant Name',
            //     type: 'string',
            //     headersToMatch: [
            //         '^(?!.*(minimum|quantity|size|qty)).*(variant|color|colour).*$',
            //         // Match 'variant', 'color' or 'colour', but not if the string contains 'minimum', 'quantity', or 'size'
            //         'variant name',
            //         'color name',
            //         'colour name',
            //         'main colour name',
            //         'colour_name',
            //     ],
            // },
            {
                scope: 'variants',
                name: 'color',
                displayName: 'Color',
                type: 'string',
                headersToMatch: [
                    '^(?!.*(minimum|quantity|size|qty|ean|min|image|url)).*(color|colour|box).*$',
                    // Match 'variant', 'color' or 'colour', but not if the string contains 'minimum', 'quantity', or 'size'
                    'color name',
                    'colour name',
                    'main colour name',
                    'colour_name',
                    'variant color',
                ],
            },
            {
                scope: 'variants',
                name: 'variant',
                displayName: 'Variant',
                type: 'string',
                headersToMatch: [
                    'variant name',
                    'style variant',
                    'style variant name',
                    'variant variant',
                    '^(?!.*(minimum|quantity|size|qty|ean|min|image|url)).*(variant).*$',
                ],
            },
            {
                scope: 'variants',
                name: 'sizes',
                displayName: 'Variant Sizes',
                type: 'string',
                headersToMatch: [
                    'sizes',
                    'variant sizes',
                    '^(?!.*box).*size.*$', // 'size' but not 'box size'
                    'variant size',
                ],
            },
            // IMAGES
            {
                scope: 'images',
                name: 'image',
                displayName: 'Variant Image URL',
                type: 'url',
                headersToMatch: ['picture url', 'image url', 'img url', 'picture', 'image', 'img', 'variant image'],
            },
            // PRICES
            {
                scope: 'prices',
                name: 'currency',
                displayName: 'Currency Name',
                type: 'string',
                headersToMatch: [
                    'currency',
                    'currency name',
                    '^(?=.*(DKK|SEK|NOK|GBP|EUR|CHF)).*(RRP|WHS|MU).*$', // VILA-style currencies --> Must include a currency code and RRP, WHS or MU
                ],
            },
            {
                scope: 'prices',
                name: 'wholesale_price',
                displayName: 'Wholesale Price',
                type: 'number',
                headersToMatch: ['whs', 'wholesale price', 'whs price'],
            },
            {
                scope: 'prices',
                name: 'recommended_retail_price',
                displayName: 'Recommended Retail Price',
                type: 'number',
                headersToMatch: ['rrp', 'recommended retail price', 'retail price'],
            },
            {
                scope: 'prices',
                name: 'mark_up',
                displayName: 'Mark Up',
                type: 'number',
                // prettier-ignore
                headersToMatch: ['markup', 'mark up', '(?:^| )mu(?:$| )']
            },
            // ASSORTMENTS
            {
                scope: 'assortments',
                name: 'name',
                displayName: 'Assortment Name',
                type: 'string',
                headersToMatch: [
                    'assortment name',
                    'box name',
                    'ass name',
                    'box(?!.*(size|ean))', // box not followed by 'size' or 'ean'
                    'assortment(?!.*(size|ean))', // assortment not followed by 'size' or 'ean'
                ],
            },
            {
                scope: 'assortments',
                name: 'box_ean',
                displayName: 'Assortment Box EAN',
                type: 'number',
                headersToMatch: ['box ean', 'assortment box ean', 'assortment ean', 'ass ean'],
            },
            {
                scope: 'assortments',
                name: 'box_size',
                displayName: 'Assortment Box Size',
                type: 'number',
                headersToMatch: ['box size', 'assortment box size', 'ass size', 'assortment size'],
            },
        ],
    },

    getters: {
        getProductFields: (state, getters) => {},
    },

    actions: {
        fetchProductFields({ state, rootGetters }, { scope, groupId = 0 } = {}) {
            // console.log('fetchProductFields', scope, groupId, state.productFields)
            const allFields = JSON.parse(JSON.stringify(state.productFields))
            // Add custom fields defined on the workspace
            const customFields = rootGetters['workspaces/getCustomProductFields']
            if (customFields)
                customFields.map(field => {
                    allFields.push({
                        scope: null,
                        name: 'extra_data',
                        displayName: field,
                        type: 'string',
                        headersToMatch: [field],
                    })
                })

            const fields = allFields.filter(x => x.scope == scope)

            return fields.map(x => {
                x.file = null
                x.fieldName = null
                x.autoMatched = false
                x.error = null
                x.enabled = true
                x.customEntry = false
                // Give each value an id based on its index
                x.id = state.fieldIndex
                x.groupId = groupId
                state.fieldIndex++

                return x
            })
        },
        getField({ state }, { fieldName, groupId = 0 } = {}) {
            // console.log('fetchProductFields', scope, groupId, state.productFields)
            const field = JSON.parse(JSON.stringify(state.productFields)).find(x => x.name == fieldName)
            field.file = null
            field.fieldName = null
            field.autoMatched = false
            field.error = null
            field.enabled = true
            field.customEntry = false
            // Give each value an id based on its index
            field.id = state.fieldIndex
            field.groupId = groupId
            state.fieldIndex++
            return field
        },
        getAllFields({ state, rootGetters }) {
            // console.log('fetchProductFields', scope, groupId, state.productFields)
            const fields = JSON.parse(JSON.stringify(state.productFields)).filter(
                x => !['key', 'variantKey'].includes(x.scope)
            )
            // Add custom fields defined on the workspace
            const customFields = rootGetters['workspaces/getCustomProductFields']
            if (customFields)
                customFields.map(field => {
                    fields.push({
                        scope: null,
                        name: 'extra_data',
                        displayName: field,
                        type: 'string',
                        headersToMatch: [field],
                    })
                })
            return fields.map(x => {
                x.file = null
                x.fieldName = null
                x.autoMatched = false
                x.error = null
                x.enabled = true
                x.customEntry = false
                // Give each value an id based on its index
                x.id = state.fieldIndex
                x.groupId = 0
                state.fieldIndex++

                return x
            })
        },
        getUploadOptions({ state, rootGetters }, enabledByDefault = true) {
            const fields = JSON.parse(JSON.stringify(state.productFields)).filter(x => !x.scope)
            // Add custom fields defined on the workspace
            const customFields = rootGetters['workspaces/getCustomProductFields']
            if (customFields)
                customFields.map(field => {
                    fields.push({
                        scope: null,
                        name: 'extra_data',
                        displayName: field,
                        type: 'string',
                        headersToMatch: [field],
                    })
                })
            const fieldsRefined = fields.map(x => {
                x.enabled = enabledByDefault
                return x
            })
            return {
                fields: fieldsRefined,
                scopes: [
                    {
                        name: 'variants',
                        enabled: enabledByDefault,
                        displayName: 'Variants & Images',
                        imagesOnly: false,
                    },
                    {
                        name: 'prices',
                        enabled: enabledByDefault,
                        displayName: 'Prices',
                    },
                    {
                        name: 'assortments',
                        enabled: enabledByDefault,
                        displayName: 'Assortments',
                    },
                ],
            }
        },
    },

    mutations: {},
}
