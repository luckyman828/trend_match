export default {
    methods: {
        variantImage(variant) {
            if (!variant || (!variant.blob_id && !variant.image)) return `/images/placeholder.JPG`
            if (variant.blob_id)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
    },
}
