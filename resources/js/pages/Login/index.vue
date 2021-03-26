<template>
    <div class="root-login">
        <div
            class="background-cover"
            v-if="getLoginBackgroundImage"
            :style="`background-image: url(${getLoginBackgroundImage}); filter: brightness(0.8);`"
        />
        <div
            class="background-cover"
            v-else
            :style="`background-image: url(/images/pexels-godisable-jacob-794064.jpg); filter: brightness(0.7);`"
        ></div>

        <div class="login-card">
            <div class="inner flex-list flex-v">
                <img class="logo" :src="getLoginLogo ? getLoginLogo : '/images/logo/logo_kollekt_blue.svg'" />

                <div class="form-wrapper">
                    <!-- <transition name="fade"> -->
                    <router-view :key="$route.path"></router-view>
                    <!-- </transition> -->
                </div>
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
    data() {
        return {
            localRoute: '/',
        }
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
    background: #b08818;
    min-height: 100vh;
    position: relative;
    scroll-behavior: smooth;
    min-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
        display: block;
        max-height: 40px;
        width: 80px;
        height: 20px;
        object-fit: contain;
        margin: 0 auto;
    }

    .login-card {
        width: 100%;
        height: 420px;
        max-width: 364px;
        background: white;
        z-index: 1;
        box-shadow: $shadowModule;
        border-radius: $borderRadiusModule;
        border: $borderModule;
        overflow: hidden;
        .inner {
            height: 100%;
            padding: 16px 32px 32px;
            overflow-y: auto;
            .form-wrapper {
                padding-top: 32px;
                flex: 1;
            }
        }
    }
}
</style>
