<template>
    <BaseImageSizer class="image-upload-area" :aspect="aspect" :fit="fit">
        <img class="preview" :src="image" />
        <BaseDroparea @input="onImageChange">
            <slot />
        </BaseDroparea>
    </BaseImageSizer>
</template>

<script>
export default {
    name: 'imageUploadArea',
    props: ['aspect', 'fit', 'image'],
    data() {
        return {}
    },
    methods: {
        onImageChange(imageFile) {
            this.$emit('input', imageFile)
            // Fetch the image so we can display it.
            const fileReader = new FileReader()
            fileReader.readAsDataURL(imageFile)
            fileReader.onload = e => {
                const newImage = e.target.result
                this.$emit('update:image', newImage)
            }
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.image-upload-area {
    &:hover {
        .droparea {
            opacity: 1;
        }
    }
    .drop-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background: transparent;
        &:hover {
            opacity: 1;
        }
    }
}
</style>
