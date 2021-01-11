<template>
    <div class="drawer-wrapper" :class="[{ show: show }]">
        <div class="overlay" @click="$emit('close')" />
        <div class="drawer" :class="[`pos-${position}`]">
            <div class="header">
                <slot name="header" />
            </div>
            <div class="body">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseDrawer',
    props: ['show', 'position'],
}
</script>

<style scoped lang="scss">
.drawer-wrapper {
    // position: absolute;
    // width: 100%;
    // height: 100%;
    // left: 0;
    // top: 0;
    // z-index: -1;
    .overlay {
        display: none;
        z-index: 1;
    }
    .drawer {
        height: 548px;
        width: 100%;
        position: absolute;
        background: white;
        transition: transform 0.1s ease-out;
        z-index: 2;
        display: flex;
        flex-direction: column;
        .header {
            padding: 20px 16px;
            // min-height: 80px;
        }
        &.pos-bottom {
            bottom: 0;
            border-radius: 16px 16px 0 0;
            transform: translateY(100%);
            max-height: 72vh;
            .body {
                overflow-y: auto;
            }
        }
    }
    &.show {
        z-index: 1;
        .drawer {
            transform: none;
        }
        .overlay {
            display: block;
        }
    }
}
</style>
