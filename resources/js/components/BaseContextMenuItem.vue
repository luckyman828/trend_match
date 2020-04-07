<template>
    <div class="item context-menu-item" :class="disabled && 'disabled no-close'" tabindex="0"
    @click="!disabled && $emit('click', $event); $emit('close')">
        <div class="icon-wrapper"><i :class="iconClass"></i></div>
        <slot/>
    </div>
</template>

<script>
export default {
    name: 'BaseContextMenuItem',
    props: [
        'iconClass',
        'disabled'
    ]
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.item {
    padding: 8px 16px;
    color: $dark05;
    display: flex;
    align-items: center;
    &:not(.item-wrapper) {
        cursor: pointer;
        &:hover {
            background: $light1;
        }
    }
    .icon-wrapper {
        width: 32px;
        display: block;
        color: $dark15;
        i {
            font-size: 16px;
            i {
                font-size: 9px;
            }
        }
    }
    &.disabled {
        pointer-events: all;
        opacity: .7;
        cursor: default;
    }
}
</style>