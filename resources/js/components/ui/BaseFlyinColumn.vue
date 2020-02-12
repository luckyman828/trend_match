<template>
    <div class="fly-in-column" :class="{'has-header': $slots.header != null}">
        <div class="header" v-if="$slots.header != null">
            <slot name="header"/>
        </div>
        <div class="body">
            <slot/>
        </div>
    </div>
</template>

<script>

export default {
    name: 'baseFlyinColumn',
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .fly-in-column {
        overflow-y: hidden;
        &:not(:last-child) {
            border-right: solid 2px $divider;
        }
        &.has-header {
            display: grid;
            grid-template-rows: 60px 1fr;
        }
    }
    .header {
        height: 60px;
        padding: 8px 16px;
        border-bottom: solid 2px $divider;
        background: white;
    }
    .body {
        padding: 16px 16px 64px;
        overflow-y: auto;
        height: 100%;
    }
</style>
