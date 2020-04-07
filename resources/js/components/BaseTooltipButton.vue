<template>
    <i v-tooltip="msg" class="far fa-info-circle"></i>
</template>

<script>
export default {
    name: 'tooltipButton',
    props: [
        'msg'
    ]
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    i:hover {
        font-weight: 900;
        color: $font;
    }
</style>