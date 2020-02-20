<template>
    <div class="page-loader">
        <slot v-if="!loading"/>
        <BaseLoader v-else/>
    </div>
</template>

<script>

export default {
    name: 'pageLoader',
    props: [
        'loading'
    ],
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