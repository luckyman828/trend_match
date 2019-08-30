<template>
    <ScreenLoader>
        <File/>
    </ScreenLoader>
</template>

<script>
import File from '../Catalogue'
import ScreenLoader from './ScreenLoader'

export default {
    name: 'fileLoader',
    components: {
        File,
        ScreenLoader
    },
}
</script>

<style scoped lang="scss">

</style>