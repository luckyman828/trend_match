<template>
    <nav class="navbar">
        <portal-target name="navbar"></portal-target>
    </nav>
</template>

<script>
export default {
    name: 'play.TheNavbar',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.navbar {
    grid-area: navbar;
    width: 100%;
    align-items: center;
    display: flex;
    padding: 0 60px;
    background: $bgModule;
    border-bottom: $borderModule;
    box-shadow: $shadowModule;
    position: relative;
    @media screen and (max-width: $screenSm) {
        padding: 0 20px;
    }
    > * {
        width: 100%;
    }
}
</style>
