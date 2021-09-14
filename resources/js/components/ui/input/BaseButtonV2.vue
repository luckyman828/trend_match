<template>
    <button
        class="button-wrapper"
        v-bind="$attrs"
        :class="[buttonClass, { disabled: disabled }]"
        v-tooltip="disabled ? disabledTooltip : tooltip"
        @click="!disabled && $emit('click', $event)"
    >
        <slot />

        <!-- Target Area -->
        <div class="target-area" v-if="targetAreaPadding" :style="'padding: ' + targetAreaPadding"></div>
    </button>
</template>

<script>
export default {
    name: 'baseButtonV2',
    props: ['buttonClass', 'disabled', 'tooltip', 'targetAreaPadding', 'disabledTooltip'],
}
</script>

<style scoped lang="scss">
.button-wrapper {
    position: relative;
    // Target Area
    .target-area {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        height: 100%;
        width: 100%;
        box-sizing: content-box;
    }
}
</style>
