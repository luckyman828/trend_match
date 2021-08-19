<template>
    <form class="verification-code-form flex-list flex-v space-md" @submit.prevent="onSubmit">
        <div class="flex-list space-md center-v">
            <div class="true-square lg rounded">
                <i class="key-icon fas fa-key primary"></i>
            </div>
            <div class="flex-list flex-v lh-xs space-sm">
                <div class="ft-20 ft-bd color-dark">Enter verification code</div>
                <div class="color-grey ft-12 ft-md">
                    We sent a 6-digit verification code to <strong>{{ email }}</strong>
                </div>
            </div>
        </div>
        <LoginInputField
            id="verification-code"
            label="Verification code"
            :pattern="/^[0-9]*$/"
            required
            autocomplete="one-time-code"
            v-model="code"
        />

        <div class="flex-list flex-v lh-sm space-xs">
            <div class="ft-bd ft-12">Did you not receive an email?</div>
            <div class="ft-12">Try checking your spam folder</div>
        </div>

        <BaseButton
            :type="submitDisabled ? 'button' : 'submit'"
            :disabled="submitDisabled"
            class="submit-button full-width"
            buttonClass="button primary full-width lg"
        >
            <span class="ft-bd ft-14" v-if="!isSubmitting">Verify</span>
            <BaseLoader v-else msg="Submitting" />
        </BaseButton>

        <div class="error-wrapper" v-if="error">
            <i class="far fa-exclamation-triangle"></i>
            <span>{{ error }}</span>
        </div>

        <div class="flex-list flex-v space-sm">
            <button v-if="!resendingEmail" class="button no-bg" type="button" @click="onResendEmail">
                <i class="far fa-reply"></i>
                <span>Re-send verification code</span>
            </button>
            <BaseLoader v-else msg="re-sending e-mail" />

            <router-link class="button no-bg" :to="{ name: 'recoverPassword' }">Enter a different e-mail</router-link>
        </div>
    </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LoginInputField from './LoginInputField'

export default {
    name: 'verificationCodeScreen',
    components: { LoginInputField },
    data: function() {
        return {
            code: '',
            error: false,
            resendingEmail: false,
            isSubmitting: false,
        }
    },
    computed: {
        ...mapGetters('auth', {
            email: 'getPasswordRecoveryEmail',
        }),
        submitDisabled() {
            return this.code.length < 6
        },
    },
    methods: {
        ...mapActions('auth', ['recoverPassword', 'verifyRecoveryCode']),
        async onResendEmail() {
            this.resendingEmail = true
            await this.recoverPassword(this.email)
            this.resendingEmail = false
        },
        async onSubmit(e) {
            this.isSubmitting = true
            await this.verifyRecoveryCode(this.code)
                .then(success => {
                    if (success) {
                        this.$router.push({ name: 'setNewPassword' })
                    } else {
                        this.error = 'Invalid code'
                    }
                })
                .catch(err => {
                    console.log('something went wrong')
                })
            this.isSubmitting = false
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.verification-code-form {
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
}
</style>
