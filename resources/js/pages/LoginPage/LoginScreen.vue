<template>
    <div class="login-form">
        <!-- <h3>Welcome to Kollekt</h3>
        <p>Login to get started</p> -->
        <div class="notice-box">
            <strong>
                First time visiting?
            </strong>
            <span>
                Contact <a href="mailto:david@kollekt.dk">david@kollekt.dk</a>, <br />or call
                <a href="tel:+4526399574">+45 26 39 95 74</a> to get set up.
            </span>
        </div>
        <form @submit.prevent="attemptLogin">
            <div class="form-element">
                <label for="email">E-mail Address</label>
                <!-- <input id="email" type="email" class="input-wrapper" name="email" required autocomplete="email"> -->
                <BaseInputField id="email" type="email" name="email" required autocomplete="email" v-model="email" />
            </div>

            <div class="form-element">
                <label for="password">Password</label>
                <!-- <input id="password" type="password" class="input-wrapper" name="password" required autocomplete="current-password"> -->
                <BaseInputField
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    name="password"
                    required
                    autocomplete="current-password"
                    v-model="password"
                >
                    <i
                        class="far show-pass"
                        :class="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                        @click="showPassword = !showPassword"
                    ></i>
                </BaseInputField>
            </div>

            <div class="form-element" style="text-align: center;">
                <router-link class="text-link" :to="{ name: 'recoverPassword' }"
                    >Forgot your password? Click here</router-link
                >
            </div>

            <div class="error-wrapper" v-if="error">
                <i class="far fa-exclamation-triangle"></i>
                <span>{{ error }}</span>
            </div>

            <div class="form-element">
                <button type="submit" class="button primary full-width lg">
                    <span>Login</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'loginScreen',
    data: function() {
        return {
            email: '',
            password: '',
            error: false,
            showPassword: false,
        }
    },
    computed: {
        ...mapGetters('routes', {
            nextUrl: 'getNextUrl',
        }),
    },
    methods: {
        ...mapActions('auth', ['login']),
        attemptLogin() {
            this.login({ email: this.email, password: this.password })
                .then(success => {
                    if (success) {
                        // Go to the url the user attempted to go to (nextUrl), if any
                        const urlToGoTo = this.nextUrl ? this.nextUrl : '/'
                        this.$router.push(urlToGoTo)
                    } else {
                        this.error = 'Wrong e-mail or password'
                    }
                    // this.$router.push('/')
                })
                .catch(err => {
                    this.error =
                        'Something went wrong. Please refresh the page and try again.\nIf you continue to see this issue, please contact Kollekt support.'
                })
        },
    },
    created() {
        // Preset the email if one was provided
        const routeEmail = this.$route.params.email
        if (routeEmail) this.email = routeEmail
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.login-form {
    width: 302px;
    > * {
        width: 100%;
    }
    .notice-box {
        border-radius: 4px;
        padding: 16px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        background: $primary;
        color: white;
        margin-top: 28px;
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
    h3 {
        margin-top: 28px;
    }
    form {
        text-align: left;
        margin-top: 32px;
        button {
            // margin-top: 20px;
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
