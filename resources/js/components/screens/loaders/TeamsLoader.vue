<template>
    <ScreenLoader>
        <Teams/>
    </ScreenLoader>
</template>

<script>
import Teams from '../Teams'
import ScreenLoader from './ScreenLoader'

export default {
    name: 'fileLoader',
    components: {
        Teams,
        ScreenLoader
    },
}
</script>

<style scoped lang="scss">

</style>