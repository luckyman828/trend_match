export default {
    methods: {
        variantImage(variant, { size, index } = {}) {
            let urlToReturn = `/images/placeholder.JPG`
            if (!variant || !variant.pictures || variant.pictures.length <= 0) return urlToReturn

            if (variant.pictures && variant.pictures.length > 0) {
                if (index) urlToReturn = variant.pictures[index].url
                else urlToReturn = variant.pictures[0].url
            }

            if (size) {
                if (size == 'sm') urlToReturn = `${urlToReturn}-300x300`
                if (size == 'lg') urlToReturn = `${urlToReturn}-1024x1024`
            }
            return urlToReturn
        },
    },
}
