export default {
    methods: {
        variantImage(variant, size) {
            if (!variant || !variant.image) return `/images/placeholder.JPG`
            if (size == 'sm') return `${variant.image}-300x300`
            if (size == 'lg') return `${variant.image}-1024x1024`
            return variant.image
        },
    },
}
