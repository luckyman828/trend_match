<template>
    <div class="root-play-b2c">
        <transition name="fade">
            <router-view :key="$route.path"></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'PLAYB2CRoot',
}
</script>

<style></style>
