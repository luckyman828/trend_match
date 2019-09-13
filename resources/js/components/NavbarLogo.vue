<template>
    <router-link to="/collection" class="logo link">
        <img class="hide-screen-sm" src="/images/kollekt-logo-color-1.svg" />
        <img class="show-screen-sm" src="/images/kollekt_logo_small.svg" />
    </router-link>
</template>

<script>
export default {
    name: 'navbarLogo',

}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .logo {
        @media screen and (max-width: $screenSmall) {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @media screen and (min-width: $screenSmall + 1) {
            padding: 24px 20px 16px;
        }
    }
</style>