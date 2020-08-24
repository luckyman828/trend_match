<template>
    <table class="map-fields-table">
        <slot/>
    </table>
</template>

<script>
export default {
    name: 'baseMapFieldsTable'
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

table {
    border-collapse: collapse;
    // margin-bottom: 20px;
    ::v-deep {
        tr {
            > * {
                padding: 4px;
                &.select {
                    padding: 0;
                }
                &:first-child, &.select + * {
                    padding-left: 0;
                }
                &:last-child {
                    padding-right: 0;
                }
            }
        }
    }
}

</style>