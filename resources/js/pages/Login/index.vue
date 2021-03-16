<template>
    <div class="root-login">
        <div class="main" id="main" ref="main" :class="{ 'hide-crisp': $route.meta.hideCrisp }">
            <div
                class="background-cover"
                v-if="getLoginBackgroundImage"
                :style="`background-image: url(${getLoginBackgroundImage}); filter: brightness(0.8);`"
            ></div>
            <div
                class="background-cover"
                v-else
                :style="`background-image: url(/images/pexels-andrew-neel-3178875.jpg); filter: brightness(0.5);`"
            ></div>
            <div class="inner">
                <img class="logo" :src="getLoginLogo ? getLoginLogo : '/images/kollekt-logo.svg'" />

                <transition name="fade">
                    <router-view :key="$route.path"></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginPage from '../Login/'
export default {
    name: 'LoginRoot',
    components: {
        LoginPage,
    },
    computed: {
        ...mapGetters('auth', [
            'authUser',
            'authStatus',
            'getAuthUserToken',
            'getLoginBackgroundImage',
            'getLoginLogo',
            'getLoginWorkspaceName',
        ]),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.root-login {
    display: block;
    background: $dark05;
    min-height: 100vh;
    position: relative;
    scroll-behavior: smooth;
    min-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    .background-cover {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
    }
    .logo {
        max-height: 40px;
        max-width: 200px;
        object-fit: contain;
    }
    .main {
        max-height: 100vh;
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
        background: $dark;
        position: relative;
        min-height: 100vh;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .inner {
            height: auto;
            max-width: 800px;
            background: white;
            z-index: 1;
            padding: 32px 60px 60px;
            text-align: center;
            box-shadow: $shadowModule;
            border-radius: $borderRadiusModule;
            border: $borderModule;
        }
    }
}
</style>
