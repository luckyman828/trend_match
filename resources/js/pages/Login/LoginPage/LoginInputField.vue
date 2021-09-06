<template>
    <div class="login-input-field" :class="{ 'has-label': !!label }">
        <div class="inner-label" v-if="label">{{ label }}</div>
        <BaseInput class="input" v-bind="$attrs" @input="$emit('input', $event)" />
        <slot />
    </div>
</template>

<script>
export default {
    props: ['label'],
    name: 'loginInputField',
}
</script>

<style scoped lang="scss">
.login-input-field {
    position: relative;
    height: 48px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 4px 8px;
    background: $bluegrey250;
    border-radius: $borderRadiusEl;
    border: solid 2px $bluegrey250;
    overflow: hidden;
    > *:not(input) {
        z-index: 1;
    }
    &:focus-within {
        border-color: $primary;
    }
    &.has-label {
        .input {
            padding-top: 16px;
        }
    }
    .inner-label {
        font-size: 10px;
        position: absolute;
        top: 4px;
        left: 8px;
        color: $fontSoft;
        pointer-events: none;
    }
    .input {
        padding: 4px 8px;
        font-size: 14px;
        font-weight: 700;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border: none;
        color: $fontBody;
        background: transparent;
        &:focus {
            outline: none;
        }
    }
}
</style>
