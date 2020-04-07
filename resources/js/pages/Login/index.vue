<template>
    <div class="login-screen">
        <img src="/images/graphs.svg" class="bg-left">
        <img src="/images/graphs.svg" class="bg-right">
        <div class="container">
            <div class="inner">
                <img class="logo" src="/images/kollekt-logo.svg">
                <h2>Welcome to Kollekt 1.0</h2>
                <h3>Please login to your account.</h3>
                <div class="notice-box">
                    <strong>
                        First time visiting?
                    </strong>
                    <span>
                        Contact <a href="mailto:david@kollekt.dk">david@kollekt.dk</a>, 
                        <br>or call <a href="tel:+4526399574">+45 26 39 95 74</a> to get set up.
                    </span>
                </div>
                <form @submit.prevent="attemptLogin">
                    <div class="form-element">
                        <label for="email">E-mail Address</label>
                        <!-- <input id="email" type="email" class="input-wrapper" name="email" required autocomplete="email"> -->
                        <BaseInputField id="email" type="email" name="email" required autocomplete="email"
                        v-model="email"/>
                    </div>

                    <div class="form-element">
                        <label for="password">Password</label>
                        <!-- <input id="password" type="password" class="input-wrapper" name="password" required autocomplete="current-password"> -->
                        <BaseInputField id="password" :type="showPassword ? 'text' : 'password'" name="password" 
                        required autocomplete="current-password" v-model="password">
                            <i class="far show-pass" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                            @click="showPassword = !showPassword"></i>
                        </BaseInputField>
                    </div>

                    <div class="error-wrapper" v-if="error">
                        <i class="far fa-exclamation-triangle"></i>
                        <span>{{error}}</span>
                    </div>

                    <div class="form-element">
                        <button type="submit" class="button dark full-width xl">
                            <span>Login</span>
                        </button>
                    </div>
                </form>
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

.login-screen {
    .notice-box {
        border-radius: 4px;
        padding: 16px;
        margin-bottom: -32px;
        box-shadow: 0 3px 6px rgba(0,0,0,.2);
        background: $primary;
        color: white;
        strong {
            color: white;
            display: block;
            margin-bottom: 8px;
        }
        a {
            text-decoration: underline;
            font-weight: 500;
            color: white;
        }
    }
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
    h2 {
        margin-top: 10vh;
    }
    form {
        text-align: left;
        margin-top: 10vh;
        button {
            margin-top: 20px;
        }
        .error-wrapper {
            color: $fail;
            font-weight: 500;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: -14px;
            margin-bottom: -10px;
            i {
                color: $fail;
                margin-right: 8px;
            }
        }
    }
    .show-pass {
        cursor: pointer;
        &:hover {
            color: $font;
        }
    }
}
    
</style>