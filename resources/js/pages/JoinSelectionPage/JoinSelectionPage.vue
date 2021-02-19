<template>
    <div class="join-selection-page">
        <h3>Enter your e-mail to join the selection</h3>
        <form @submit.prevent class="join-form">
            <BaseInputField
                v-model="newEmail"
                class="form-element"
                label="E-mail"
                placeholder="your-email@example.com"
                name="email"
                @input="checkEmailIsValid"
            />

            <div class="form-element" v-if="accountExists">
                <label for="password">Password</label>
                <BaseInputField
                    ref="passwordInput"
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    name="password"
                    required
                    autocomplete="current-password"
                    v-model="password"
                    :focusOnMount="true"
                >
                    <i
                        class="far show-pass"
                        :class="showPassword ? 'fa-eye' : 'fa-eye-slash'"
                        @click="showPassword = !showPassword"
                    ></i>
                </BaseInputField>
            </div>

            <div class="error-wrapper form-element" v-if="error">
                <i class="far fa-exclamation-triangle"></i>
                <span>{{ error }}</span>
            </div>

            <BaseCheckboxInputField class="form-element" v-model="acceptTerms">
                <span>I accept the terms & conditions</span>
            </BaseCheckboxInputField>

            <!-- V2 -->
            <!-- <vue-recaptcha
                class="form-element"
                sitekey="6LfCa9kZAAAAALX6qHy872UuYkYVhz_tnfdu7HA7"
                :loadRecaptchaScript="true"
                @verify="onCaptchaVerified"
                @expired="onCaptchaExpired"
            /> -->

            <!-- V2 INVISIBLE -->
            <vue-recaptcha
                ref="recaptcha"
                class="form-element"
                sitekey="6Lc-PEgaAAAAAFhgxCaYbmLFaX_vwpAX6yGlt9Hh"
                type="invisible"
                size="invisible"
                badge="bottomleft"
                :loadRecaptchaScript="true"
                @verify="onCaptchaVerified"
                @expired="onCaptchaExpired"
            />

            <BaseButton
                v-if="!verifyingCaptcha"
                buttonClass="form-element primary full-width lg"
                class="full-width"
                :disabled="submitDisabled"
                :disabledTooltip="disabledMsg"
                @click="onSubmit"
            >
                <span>Go to Selection</span>
            </BaseButton>

            <BaseLoader msg="Veryfying" v-else />
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'

export default {
    name: 'joinSelectionPage',
    components: {
        VueRecaptcha,
    },
    data: function() {
        return {
            newEmail: '',
            emailValid: false,
            acceptTerms: false,
            captchaToken: null,
            accountExists: false,
            showPassword: false,
            password: '',
            error: '',
            verifyingCaptcha: false,
        }
    },
    computed: {
        ...mapGetters('selections', {
            selectionId: 'getCurrentSelectionId',
        }),
        submitDisabled() {
            return false
            return !(this.emailValid && this.acceptTerms && this.captchaToken)
        },
        disabledMsg() {
            if (!this.emailValid) return 'E-mail is invalid'
            if (!this.acceptTerms) return 'Please accept the terms & conditions'
            if (!this.captchaToken) return 'You must pass the captcha test'
        },
    },
    methods: {
        ...mapActions('selections', ['joinSelectionViaLink', 'fetchSelection']),
        ...mapActions('files', ['fetchFile']),
        ...mapActions('auth', ['login']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        ...mapMutations('auth', ['ON_SUCCESFUL_LOGIN']),
        checkEmailIsValid(newVal) {
            const email = newVal
            const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const isValid = pattern.test(email)
            this.emailValid = isValid
            return isValid
        },
        async onCaptchaVerified(token) {
            this.captchaToken = token

            // Veirify catpcha and send API request
            const joinResponse = await this.joinSelectionViaLink({
                captchaToken: this.captchaToken,
                selectionId: this.selectionId,
                email: this.newEmail,
            })
            this.verifyingCaptcha = false

            // Existing Account
            if (joinResponse.status == 'AccountExisted') {
                this.SHOW_SNACKBAR({
                    msg: `A user with that e-mail already exists. Please login.`,
                    type: 'info',
                    iconClass: 'fa-info-circle',
                    duration: 10000, // 10 seconds
                })

                this.accountExists = true

                return
            }

            // Succesfully joined
            if (joinResponse.status == 'Success') {
                // Set the corrent workspace and have the user logged in
                const token = joinResponse.user.token.access_token
                const user = joinResponse.user
                this.ON_SUCCESFUL_LOGIN({ token, user })

                return
            }
        },
        onCaptchaExpired() {
            this.captchaToken = null
        },
        // verifyCaptcha

        async onSubmit() {
            // Make sure that submit should actually have been available
            if (this.submitDisabled) return

            if (this.accountExists) {
                this.attemptLogin()
                return
            }

            this.verifyingCaptcha = true
            await this.$refs.recaptcha.execute()
        },

        attemptLogin() {
            this.login({ email: this.newEmail, password: this.password })
                .then(success => {
                    if (success) {
                        // Go to the url the user attempted to go to (nextUrl), if any
                        // const urlToGoTo = this.nextUrl ? this.nextUrl : '/'
                        // this.$router.push(urlToGoTo)
                    } else {
                        this.error = 'Wrong password'
                    }
                    // this.$router.push('/')
                })
                .catch(err => {
                    this.error =
                        'Something went wrong. Please refresh the page and try again.\nIf you continue to see this issue, please contact Kollekt support.'
                })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.join-selection-page {
    padding-top: 32px;
}
.join-form {
    text-align: left;
    max-width: 302px;
    margin: auto;
}
.error-wrapper {
    color: $fail;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    // margin-top: -14px;
    // margin-bottom: -10px;
    i {
        color: $fail;
        margin-right: 8px;
    }
}
</style>
