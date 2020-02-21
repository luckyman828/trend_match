<template>
    <div class="screen-loader">
        <slot v-if="!loadingInit && !loading"/>
        <Loader v-else/>
    </div>
</template>

<script>
import Loader from '../../Loader'

export default {
    name: 'screenLoader',
    components: {
        Loader
    },
    props: [
        'loading'
    ],
    computed: {
        loadingInit () {
            return this.$store.getters['persist/loadingInit']
        }
    }
}
</script>

<style scoped lang="scss">
    .screen-loader {
        height: 500px;
    }
</style>