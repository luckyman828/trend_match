<template>
    <strong><slot/></strong>
</template>

<script>
export default {
    name: 'basePopoverHeader'
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

strong {
    padding: 12px 16px;
    font-size: 14px;
    display: block;
    border-bottom: solid 1px $divider;
}

</style>