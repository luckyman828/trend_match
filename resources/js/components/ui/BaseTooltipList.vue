<template>
    <div class="tooltip-list">

        <BaseTooltipListHeader v-if="header" :header="header"/>

        <div class="body">
            <slot/>
        </div>

    </div>
</template>

<script>
export default {
    name: 'baseTooltipList',
    props: [
        'header',
    ],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .tooltip-list {
        &:not(:last-child) {
            margin-bottom: 12px;
        }
        .body {
            max-height: 186px;
            overflow-x: hidden;
            overflow-y: auto;
            // background: $whtie;
            // &:not(:first-child) {
            //     background: $darkAlt2;
            // }
        }
    }

</style>