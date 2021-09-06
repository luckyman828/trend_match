<template>
    <div class="loading-wrapper">
        <img class="logo" src="/images/kollekt-logo-color-2.svg" alt="Kollekt logo" />
        <BaseLoader />
    </div>
</template>

<script>
export default {
    name: 'rootLoader',
}
</script>

<style lang="scss" scoped>
.loading-wrapper {
    min-height: 100vh;
    width: 100%;
    min-width: 100vw;
    justify-content: center;
    align-items: center;
    display: flex;
    background: $bg;
    flex-direction: column;
    .logo {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 60px;
        width: 120px;
    }
}
</style>
