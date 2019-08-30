<template>
    <ScreenLoader>
        <Folder/>
    </ScreenLoader>
</template>

<script>
import Folder from '../Collection'
import ScreenLoader from './ScreenLoader'

export default {
    name: 'fileLoader',
    components: {
        Folder,
        ScreenLoader
    },
}
</script>

<style scoped lang="scss">

</style>