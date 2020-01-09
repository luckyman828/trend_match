<template>
    <div class="subfile-contents">
        <SubfileRow v-for="subfile in subfiles" :subfile="subfile" :key="subfile.id" :depth="adepth"/>
    </div>
</template>

<script>
import SubfileRow from './SubfileRow'

export default {
    name: 'subfileRowContents',
    components: {
        SubfileRow
    },
    props: [
        'subfiles',
        'adepth'
    ]
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .subfile-contents {
        margin-left: 20px;
    }
    
</style>