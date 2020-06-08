<template>
    <div class="shape-wrapper">
        <div v-bind="$attrs" :class="shapeClass" class="base-shape">
            <slot/>

            <!-- Target Area -->
            <div class="target-area" v-if="targetAreaPadding" 
            :style="'padding: '+targetAreaPadding">

            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'baseShape',
    props: [
        'shapeClass',
        'targetAreaPadding',
    ],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

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
}

</style>