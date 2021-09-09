<template>
    <div class="flyin-column" :class="{ 'has-header': $slots.header != null }">
        <div class="header flex-list center-v ft-12 ft-bd" v-if="$slots.header != null">
            <slot name="header" />
        </div>
        <div class="body">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseFlyinColumn',
}
</script>

<style scoped lang="scss">
.flyin-column {
    overflow-y: hidden;
    &:not(:last-child) {
        border-right: $borderDivider;
    }
    &.has-header {
        display: flex;
        flex-direction: column;
    }
}
.header {
    height: 40px;
    padding: 0 16px;

    border-bottom: $borderDivider;
    background: white;
}
.body {
    padding: 16px 16px 64px;
    overflow-y: auto;
    height: 100%;
    flex: 1;
}
</style>
