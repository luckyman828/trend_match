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
                let sizeString = ''
                if (size == 'sm') sizeString = `-300x300`
                if (size == 'lg') sizeString = `-1024x1024`

                // Check if there is an extension
                const extensionIndex = urlToReturn.indexOf('.jpg')
                if (extensionIndex >= 0) {
                    urlToReturn = `${urlToReturn.slice(0, extensionIndex)}${sizeString}${urlToReturn.slice(
                        extensionIndex
                    )}`
                } else {
                    urlToReturn = `${urlToReturn}${sizeString}`
                }
            }
            return urlToReturn
        },
    },
}
