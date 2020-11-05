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
            <BaseCheckboxInputField class="form-element" v-model="acceptTerms">
                <span>I accept the terms & conditions</span>
            </BaseCheckboxInputField>

            <vue-recaptcha
                class="form-element"
                sitekey="6LfCa9kZAAAAALX6qHy872UuYkYVhz_tnfdu7HA7"
                :loadRecaptchaScript="true"
                @verify="onCaptchaVerified"
                @expired="onCaptchaExpired"
            />

            <BaseButton
                buttonClass="form-element primary full-width lg"
                class="full-width"
                :disabled="submitDisabled"
                :disabledTooltip="disabledMsg"
                @click="onSubmit"
            >
                <span>Go to Selection</span>
            </BaseButton>
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
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        ...mapMutations('auth', ['ON_SUCCESFUL_LOGIN']),
        checkEmailIsValid(newVal) {
            const email = newVal
            const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const isValid = pattern.test(email)
            this.emailValid = isValid
            return isValid
        },
        onCaptchaVerified(token) {
            this.captchaToken = token
        },
        onCaptchaExpired() {
            this.captchaToken = null
        },
        async onSubmit() {
            // Make sure that submit should actually have been available
            if (this.submitDisabled) return

            // Veirify catpcha and send API request
            const joinReponse = await this.joinSelectionViaLink({
                captchaToken: this.captchaToken,
                selectionId: this.selectionId,
                email: this.newEmail,
            })

            // Existing Account
            if (joinReponse.status == 'AccountExisted') {
                this.SHOW_SNACKBAR({
                    msg: `A user with that e-mail already exists. Please login.`,
                    type: 'info',
                    iconClass: 'fa-info-circle',
                    duration: 10000, // 10 seconds
                })

                // Redirect to login
                this.$router.push({
                    name: 'login',
                    params: {
                        nextUrl: this.$route.fullPath,
                        email: this.newEmail,
                    },
                })
                return
            }

            // Succesfully joined
            if (joinReponse.status == 'Success') {
                // Set the corrent workspace and have the user logged in
                const token = joinReponse.user.token.access_token
                const user = joinReponse.user
                this.ON_SUCCESFUL_LOGIN({ token, user })

                // // Route the user to the selection
                // const selection = await this.fetchSelection({ selectionId: this.selectionId })
                // // Navigate to the selection
                // let routeName = 'selection'
                // // If the file has a video, then navigate to the video
                // const file = await this.fetchFile(selection.file_id)
                // if (file.video_count > 0) {
                //     routeName = 'watchVideoPresentation'
                // }
                // console.log('joni seelction route change')
                // this.$router.push({
                //     name: routeName,
                //     params: { fileId: selection.file_id, selectionId: this.selectionId },
                // })
                return
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.join-selection-page {
    padding-top: 32px;
}
.join-form {
    text-align: left;
    max-width: 302px;
    margin: auto;
}
</style>
