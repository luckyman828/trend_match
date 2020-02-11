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
        .body {
            max-height: 186px;
            overflow-x: hidden;
            overflow-y: auto;
            background: $darkAlt;
            &:not(:first-child) {
                background: $darkAlt2;
            }
        }
    }

</style>