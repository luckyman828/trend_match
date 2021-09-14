<template>
    <div class="display-field">
        <label v-if="label">{{ label }}</label>
        <div class="field">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseDisplayField',
    props: ['label'],
}
</script>

<style lang="scss" scoped>
.display-field {
    .field {
        padding: 8px 16px;
        line-height: 1.6;
        background: $bgEl;
        border-radius: $borderRadiusEl;
        min-height: 38px;
    }
    label {
        font-weight: 700;
        font-size: 12px;
        display: block;
        margin-bottom: 2px;
        &.sm {
            font-size: 8px;
            color: $fontSoft;
            margin-bottom: 2px;
        }
    }
}
</style>
