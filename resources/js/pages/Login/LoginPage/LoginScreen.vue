<template>
    <form class="login-form flex-list flex-v space-md" @submit.prevent="attemptLogin">
        <div class="flex-list space-md center-v">
            <div class="square lg rounded">
                <i class="key-icon fas fa-key primary"></i>
            </div>
            <div class="flex-list flex-v lh-xs space-sm">
                <div class="ft-20 ft-bd color-dark">Log in</div>
                <div class="color-grey ft-12 ft-md">Welcome back to Kollekt</div>
            </div>
        </div>
        <LoginInputField
            label="E-mail"
            id="email"
            type="email"
            name="email"
            required
            autocomplete="email"
            v-model="email"
        />

        <LoginInputField
            label="Password"
            id="password"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            required
            autocomplete="current-password"
            v-model="password"
        >
            <button class="white" type="button" @click="showPassword = !showPassword">
                <i class="fas" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'" />
            </button>
        </LoginInputField>

        <router-link class="button invisible" :to="{ name: 'recoverPassword' }">
            <span>Forgot your password</span>
            <i class="far fa-question-circle"></i>
        </router-link>

        <div class="error-wrapper" v-if="error">
            <i class="far fa-exclamation-triangle"></i>
            <span>{{ error }}</span>
        </div>

        <BaseButton
            :type="submitDisabled ? 'button' : 'submit'"
            :disabled="submitDisabled"
            class="submit-button full-width"
            buttonClass="button primary full-width lg"
        >
            <span class="ft-bd ft-14">Log in</span>
        </BaseButton>
    </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { triggerAppRedirection } from '../../../helpers/routeGuards'
import LoginInputField from './LoginInputField'

export default {
    name: 'loginScreen',
    components: { LoginInputField },
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
        submitDisabled() {
            return this.email.length < 5 || this.email.search('@') <= 0 || this.password.length < 8
        },
    },
    methods: {
        ...mapActions('auth', ['login']),
        attemptLogin() {
            this.login({ email: this.email, password: this.password })
                .then(async success => {
                    if (success) {
                        // Go to the url the user attempted to go to (nextUrl), if any
                        if (this.nextUrl && this.nextUrl.search('login') < 0) {
                            this.$router.push(this.nextUrl)
                        }
                        // Else redirect to the available space if any
                        else {
                            const newRoute = await triggerAppRedirection()
                            this.$router.push(newRoute)
                        }
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
    height: 100%;
    .key-icon {
        font-size: 18px !important;
        margin-left: 14px !important;
        margin-right: 14px !important;
    }

    .error-wrapper {
        color: $fail;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
            color: $fail;
            margin-right: 8px;
        }
    }

    .show-pass {
        cursor: pointer;
        &:hover {
            color: $font;
        }
    }
    .submit-button {
        margin-top: auto !important;
    }
}
</style>
