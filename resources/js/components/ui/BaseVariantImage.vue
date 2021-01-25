<template>
    <img :src="urlOverride ? urlOverride : variantImage(variant, { size: theSize, index })" @error="onError" />
</template>

<script>
import variantImage from '../../mixins/variantImage'

export default {
    name: 'BaseVariantImage',
    props: ['variant', 'size', 'index', 'useBase64Img'],
    mixins: [variantImage],
    data: function() {
        return {
            sizeError: false,
            urlOverride: null,
        }
    },
    computed: {
        theSize() {
            return this.sizeError ? null : this.size
        },
    },
    methods: {
        onError() {
            if (this.size) this.sizeError = true
        },
        async getBase64() {
            // Make sure the variant has a picture
            if (!this.variant || this.variant.pictures.length <= 0) return

            let imgUrl = this.variant.pictures[0].url
            const newUrl = await this.toDataURL(imgUrl)
            this.urlOverride = newUrl
        },
        async toDataURL(url) {
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest()
                xhr.onload = function() {
                    var reader = new FileReader()
                    reader.onloadend = function() {
                        resolve(reader.result)
                    }
                    reader.readAsDataURL(xhr.response)
                }
                xhr.open('GET', url)
                xhr.responseType = 'blob'
                xhr.send()
            })
        },
    },
    created() {
        if (this.useBase64Img) this.getBase64()
    },
}
</script>

<style></style>
