<template>
    <div class="tooltip-list">
        <BasePopoverListHeader v-if="header" :header="header" />

        <table class="body">
            <slot />
        </table>
    </div>
</template>

<script>
export default {
    name: 'basePopoverList',
    props: ['header'],
}
</script>

<style scoped lang="scss">
.tooltip-list {
    &:not(:last-child) {
        margin-bottom: 12px;
    }
    .body {
        width: 100%;
        border-collapse: collapse;
        min-width: 200px;
        max-width: 300px;
        // max-height: 186px;
        overflow-x: hidden;
        overflow-y: auto;
        // background: $whtie;
        // &:not(:first-child) {
        //     background: $darkAlt2;
        // }
    }
}
</style>
