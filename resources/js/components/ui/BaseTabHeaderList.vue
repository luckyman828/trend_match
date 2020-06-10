<template>
    <div class="tab-header-list">
        <slot/>
    </div>
</template>

<script>
export default {
    name: 'tabHeaderList'
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.tab-header-list {
    display: flex;
    height: 100%;
    border-radius: $borderRadiusEl;
    border: $borderElSoft;
}

</style>