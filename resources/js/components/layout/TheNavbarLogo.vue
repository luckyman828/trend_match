<template>
    <router-link to="/collection" class="logo link theme-dark">
        <img class="hide-screen-sm" src="/images/kollekt_logo_small.svg" />
        <img
            class="show-screen-sm"
            style="height: 100%; width: 52px; margin-left: -8px"
            src="/images/kollekt_logo_00_1024x1024.svg"
        />
    </router-link>
</template>

<script>
export default {
    name: 'navbarLogo',
}
</script>

<style lang="scss" scoped>
.logo {
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $bgModuleDark;

    @media screen and (min-width: $screenMd + 1) {
        padding: 24px 20px 16px;
    }
}
</style>
