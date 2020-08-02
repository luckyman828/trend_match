export default {
    methods: {
        variantImage(variant, { size, index } = {}) {
            let urlToReturn = `/images/placeholder.JPG`
            if (!variant || !variant.pictures || variant.pictures.length <= 0) return urlToReturn

            if (variant.pictures && variant.pictures.length > 0) {
                let pictureUrlToReturn = urlToReturn
                if (index) pictureUrlToReturn = variant.pictures[index].url
                else pictureUrlToReturn = variant.pictures[0].url

                if (!pictureUrlToReturn) return urlToReturn
                urlToReturn = pictureUrlToReturn
            }

            if (size) {
                if (size == 'sm') urlToReturn = `${urlToReturn}-300x300`
                if (size == 'lg') urlToReturn = `${urlToReturn}-1024x1024`
            }
            return urlToReturn
        },
    },
}
