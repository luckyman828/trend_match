export default {
    methods: {
        variantImage(variant, options) {
            if (!variant || !variant.image) return `/images/placeholder.JPG`
            // if (options) {
            //     // Find the index of the extension
            //     // const extensionIndex = variant.image.lastIndexOf('.')
            //     // const imageBase = variant.image.substr(0, extensionIndex)
            //     // const extension = variant.image.substr(extensionIndex, variant.image.length)
            //     // if (options.size == 'sm') return `${imageBase}-300x300${extension}`
            //     // if (options.size == 'sm') return `${variant.image}-300x300`
            // }
            else return variant.image
        },
    },
}
