<template>
    <div class="shape-wrapper">
        <div v-bind="$attrs" :class="shapeClass" class="base-shape">
            <slot />

            <!-- Target Area -->
            <div class="target-area" v-if="targetAreaPadding" :style="'padding: ' + targetAreaPadding"></div>
        </div>
        <slot name="outside" />
    </div>
</template>

<script>
export default {
    name: 'baseShape',
    props: ['shapeClass', 'targetAreaPadding'],
}
</script>

<style scoped lang="scss">
.shape-wrapper {
    position: relative;
    display: inline-flex;

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
    .top-right {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(35%, -35%);
    }
}
</style>
