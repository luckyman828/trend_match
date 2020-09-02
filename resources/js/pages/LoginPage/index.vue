<template>
    <div class="login-page">
        <img src="/images/graphs.svg" class="bg-left">
        <img src="/images/graphs.svg" class="bg-right">
        <div class="container">
            <div class="inner">
                <img class="logo" src="/images/kollekt-logo.svg">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'loginPage',
    data: function () { return {
        email: '',
        password: '',
        error: false,
        showPassword: false,
    }},
    computed: {
        nextUrl() {
            return this.$route.params.nextUrl
        }
    },
    methods: {
        ...mapActions('auth', ['login']),
        attemptLogin () {
            this.login({email: this.email, password: this.password}).then((success) => {
                if (success) {
                    // Go to the url the user attempted to go to (nextUrl), if any
                    const urlToGoTo = this.nextUrl ? this.nextUrl : '/'
                    this.$router.push(urlToGoTo)
                } else {
                    this.error = 'Wrong e-mail or password'
                }
                // this.$router.push('/')
            }).catch(err => {
                this.error = 'Something went wrong. Please refresh the page and try again.\nIf you continue to see this issue, please contact Kollekt support.'
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.login-page {
    background: $dark05;
    min-height: 100vh;
    position: relative;
    .bg-left, .bg-right {
        position: fixed;
        bottom: 0;
        width: 50%;
        &.bg-left {
            left: 0;
        }
        &.bg-right {
            right: 0;
        }
    }
    .container {
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        height: 100%;
        max-width: 800px;
        background: white;
        z-index: 1;
        padding: 60px 0;
        .inner {
            max-width: 400px;
            width: 100%;
            margin: auto;
            text-align: center;
        }
    }
}
    
</style>