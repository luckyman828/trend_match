<template>
    <div class="header" v-html="header"></div>
</template>

<script>
export default {
    name: 'tooltipAlt',
    props: [
        'header',
    ],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .header {
        padding: 12px 8px 8px;
        font-size: 12px;
        color: $primary;
        font-weight: 700;
        text-align: center;
    }

</style>