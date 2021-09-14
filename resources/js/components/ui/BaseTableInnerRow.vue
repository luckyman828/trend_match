<template>
    <div class="table-inner-row">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'baseTableInnerRow',
}
</script>

<style lang="scss">
.table-inner-row {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>
