<template>
    <form @submit.prevent="onSubmit" class="join-form login-form flex-list flex-v space-md">
        <div class="flex-list space-md center-v">
            <div class="true-square lg rounded">
                <i class="key-icon fas fa-poll primary"></i>
            </div>
            <div class="flex-list flex-v lh-xs space-sm">
                <div class="ft-20 ft-bd color-dark">Join Selection</div>
                <div class="color-grey ft-12 ft-md">
                    {{
                        selectionInfo
                            ? selectionInfo.workspace_title + ': ' + selectionInfo.selection_name
                            : 'Fetching..'
                    }}
                </div>
            </div>
        </div>

        <BaseLoader msg="Veryfying" v-if="verifyingCaptcha" />

        <template v-else>
            <LoginInputField
                v-model="newEmail"
                label="E-mail"
                type="email"
                autocomplete="email"
                name="email"
                required
                @input="checkEmailIsValid"
            />

            <LoginInputField
                v-if="accountExists"
                label="Password"
                id="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                required
                autocomplete="current-password"
                v-model="password"
            >
                <button class="white true-square" type="button" @click="showPassword = !showPassword">
                    <i class="fas" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'" />
                </button>
            </LoginInputField>

            <router-link class="button no-bg" :to="{ name: 'recoverPassword' }">
                <span>Forgot your password</span>
                <i class="far fa-question-circle"></i>
            </router-link>

            <div class="error-wrapper" v-if="error">
                <i class="far fa-exclamation-triangle"></i>
                <span>{{ error }}</span>
            </div>

            <!-- <BaseCheckboxInputField class="checkbox-input-field" v-model="acceptTerms">
                <span>I Accept the terms</span>
                <a href="" target="_blank">Read terms</a>
            </BaseCheckboxInputField> -->

            <BaseButton
                v-if="!verifyingCaptcha"
                :type="submitDisabled ? 'button' : 'submit'"
                :disabled="submitDisabled"
                :disabledTooltip="disabledMsg"
                class="submit-button full-width"
                buttonClass="button primary full-width lg"
            >
                <span class="ft-bd ft-14">Join Selection</span>
            </BaseButton>
        </template>

        <vue-recaptcha
            ref="recaptcha"
            class="form-element"
            sitekey="6Lc-PEgaAAAAAFhgxCaYbmLFaX_vwpAX6yGlt9Hh"
            type="no-bg"
            size="no-bg"
            badge="bottomleft"
            :loadRecaptchaScript="true"
            @verify="onCaptchaVerified"
            @expired="onCaptchaExpired"
        />
    </form>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'
import LoginInputField from '../Login/LoginPage/LoginInputField'

export default {
    name: 'joinSelectionPage',
    components: {
        VueRecaptcha,
        LoginInputField,
    },
    props: ['selectionInfo'],
    data: function() {
        return {
            newEmail: '',
            emailValid: false,
            acceptTerms: true,
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
            this.verifyingCaptcha = false
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
.join-form {
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
    .checkbox-input-field {
        position: relative;
        height: 48px !important;
        width: 100%;
        padding: 4px 16px;
        background: $bluegrey250;
        border-radius: $borderRadiusEl;
        border: solid 2px $bluegrey250;
        overflow: hidden;
        &::v-deep {
            > span {
                display: flex;
                flex: 1;
                justify-content: space-between;
                color: $fontSoft;
                font-weight: 700;
                font-size: 12px;
                padding-left: 8px;
                a {
                    color: $primary;
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
            .checkbox .checkmark,
            .checkbox input[type='checkbox']:checked + .checkmark {
                width: 24px;
                height: 24px;
                border-radius: 4px;
            }
        }
    }
}
</style>
