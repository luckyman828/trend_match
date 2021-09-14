<template>
    <div class="value-display flex-list flex-v sm lh-xs">
        <label v-if="label">{{ label }}</label>
        <div class="value ft-12 ft-bd">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseValueDisplay',
    props: ['label'],
}
</script>

<style scoped lang="scss">
.value-display {
    padding: 8px;
    border-radius: $borderRadiusEl;
    label {
        color: $fontSoft;
        font-size: 10px;
    }
}
</style>
