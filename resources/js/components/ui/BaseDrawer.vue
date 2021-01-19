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
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    pointer-events: none;
    .overlay {
        display: none;
        z-index: 1;
    }
    .drawer {
        height: 548px;
        width: 100%;
        position: absolute;
        background: white;
        transition: transform 0.2s ease-out;
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
        pointer-events: all;
        .drawer {
            transform: none;
        }
        .overlay {
            display: block;
        }
    }
}
</style>
