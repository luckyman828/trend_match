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
                if (size == 'sm') urlToReturn = this.getResizedImageUrl(urlToReturn, '300x300')
                if (size == 'lg') urlToReturn = this.getResizedImageUrl(urlToReturn, '1024x1024')
            }
            return urlToReturn
        },
        getResizedImageUrl(url, size) {
            const components = url.split('/')
            let fileName = components[components.length - 1]
            components.splice(components.length - 1, 1)
            if (fileName.includes('.')) {
                const dotIdx = fileName.lastIndexOf('.')
                const name = `${fileName.substring(0, dotIdx)}-${size}`;
                fileName = name + fileName.substring(dotIdx)
            }
            else {
                fileName = `${fileName}-${size}`
            }
            components.push(fileName)
            return components.join('/')
        }
    },
}
