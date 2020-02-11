<template>
    <div class="page-loader">
        <slot v-if="!loadingInit && !loading"/>
        <BaseLoader v-else/>
    </div>
</template>

<script>

export default {
    name: 'pageLoader',
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

<style lang="scss">
    .page-loader {
        height: 500px;
        > * {
            padding-bottom: 100px;
        }
    }
</style>