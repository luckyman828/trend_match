<template>
    <div class="file-single">
        <FlyinHeader :title="file.title" @closeFlyin="onClose">
            <p>I am a flyin header</p>
        </FlyinHeader>
        <div class="body">
            <SubfilesTable :subfiles="file.subfiles"/>
        </div>
    </div>
</template>

<script>
import SubfilesTable from './SubfilesTable'
import FlyinHeader from './FlyinHeader'

export default {
    name: 'fileSingle',
    props: [
        'file'
    ],
    components: {
        SubfilesTable,
        FlyinHeader,
    },
    methods: {
        onClose() {
            this.$emit('closeFlyin')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .file-single {
        height: 100%;
        background: $grey;
        .body {
            padding: 16px;
        }
    }
</style>