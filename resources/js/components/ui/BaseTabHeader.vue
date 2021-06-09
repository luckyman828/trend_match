<template>
    <div class="tab-header" :class="{ active: active }">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'tabHeader',
    props: ['active'],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.tab-header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    background: $bg;
    height: 100%;
    text-align: center;
    font-weight: 700;
    color: $fontSoft;
    cursor: pointer;
    padding: 2px 3px 2px 4px;
    user-select: none;
    &:first-child {
        border-radius: $borderRadiusEl 0 0 $borderRadiusEl;
    }
    &:last-child {
        border-radius: 0 $borderRadiusEl $borderRadiusEl 0;
        padding: 2px;
    }
    &:not(:last-child) {
        border-right: $borderEl;
    }
    &:hover {
        padding: 0;
        color: $primary;
        border: $borderElHover;
        box-shadow: $shadowEl;
    }
    &:active {
        transform: $transformElActive;
    }
    .count {
        color: $font;
        font-size: 12px;
        font-weight: 500;
        margin-left: 8px;
    }
    &.active {
        background: $primary;
        border: none;
        padding: 2px;
        color: white;
        // background: white;
        // color: $primary;
    }
}
</style>
