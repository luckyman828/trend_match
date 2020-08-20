export default {
    namespaced: true,

    state: {
        productFields: [
            // KEY
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
            // DEFAULT
            {
                scope: null,
                name: 'title',
                displayName: 'Name',
                type: 'string',
                headersToMatch: ['title', 'name', 'style name', 'product name', 'style_name', 'product_name'],
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
                headersToMatch: ['composition', 'materials', 'quality', 'material'],
            },
            {
                scope: null,
                name: 'delivery_date',
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
            // VARIANTS
            {
                scope: 'variants',
                name: 'variant_name',
                displayName: 'Variant Name',
                type: 'string',
                headersToMatch: [
                    'color',
                    'colour',
                    'variant',
                    'variant name',
                    'color name',
                    'colour name',
                    'main colour name',
                    'colour_name',
                ],
            },
            {
                scope: 'variants',
                name: 'sizes',
                displayName: 'Variant Sizes',
                type: 'string',
                headersToMatch: ['sizes', 'variant sizes', 'size', 'variant size'],
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
                headersToMatch: ['currency', 'currency name'],
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
                headersToMatch: ['markup', 'mark up'],
            },
            // ASSORTMENTS
            {
                scope: 'assortments',
                name: 'name',
                displayName: 'Assortment Name',
                type: 'string',
                headersToMatch: ['assortment name', 'box name', 'ass name'],
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
                headersToMatch: ['box size', 'assortment box size', 'ass.', 'ass size', 'assortment size'],
            },
        ],
    },

    getters: {
        getProductFields: state => {
            const fields = JSON.parse(JSON.stringify(state.productFields))
            return fields.map(x => {
                x.file = null
                x.fieldName = null
                x.autoMatched = false
                x.error = null
                x.enabled = true
                return x
            })
        },
    },

    actions: {},

    mutations: {},
}
