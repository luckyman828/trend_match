<template>
    <img :src="variantImage(variant, theSize)" @error="onError">
</template>

<script>
import variantImage from '../../mixins/variantImage'

export default {
    name: 'baseVariantImg',
    props: [
        'variant',
        'size'
    ],
    mixins: [
        variantImage,
    ],
    data: function() { return {
        sizeError: false,
    }},
    computed: {
        theSize() {
            return this.sizeError ? null : this.size
        }
    },
    methods: {
        onError() {
            if (this.size) this.sizeError = true
        }
    }
}
</script>

<style>

</style>