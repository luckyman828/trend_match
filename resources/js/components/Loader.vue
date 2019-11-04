<template>
    <div class="loader">
        <svg width="50px"  height="50px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" stroke="#bbcedd" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(5.81256 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>
    </div>
</template>

<script>
export default {
    name: 'loader',
}
</script>

<style lang="scss" scoped>
    @import '~@/_variables.scss';

    .loader {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    svg {
        // height: 50px;
        height: 100%;
        max-height: 50px;
        width: 100%;
        margin: 12px 0;
    }
</style>
