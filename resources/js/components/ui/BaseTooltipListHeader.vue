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
        color: $dark2;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
    }

</style>