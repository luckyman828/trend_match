<template>
    <div class="verification-code-screen">
        <h2>Enter verification code</h2>
        <h3>We sent a 6-digit verification code to <strong>{{email}}</strong></h3>
        <form @submit.prevent="onSubmit">
            <div class="form-element">
                <label for="verification-code">Verification code</label>
                <!-- <input id="email" type="email" class="input-wrapper" name="email" required autocomplete="email"> -->
                <BaseInputField id="verification-code" type="number" required autocomplete="one-time-code"
                v-model="code"/>
            </div>

            <div class="form-element retry-actions" style="text-align: center;">
                <p><strong>Did you not receive an email?</strong></p>
                <p>Try checking your spam folder</p>

                <button v-if="!resendingEmail" class="text-link" 
                @click="onResendEmail">
                    <span>Re-send verification code</span>
                </button>
                <BaseLoader v-else msg="re-sending e-mail"/>

                <router-link class="text-link" :to="{name: 'recoverPassword'}">Enter a different e-mail</router-link>
            </div>

            <div class="error-wrapper" v-if="error">
                <i class="far fa-exclamation-triangle"></i>
                <span>{{error}}</span>
            </div>

            <div class="form-element">
                <button v-if="!isSubmitting" type="submit" class="button dark full-width xl"
                @click="onSubmit">
                    <span>Verify</span>
                </button>
                <BaseLoader v-else/>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'verificationCodeScreen',
    data: function () { return {
        code: null,
        error: false,
        resendingEmail: false,
        isSubmitting: false,
    }},
    computed: {
        ...mapGetters('auth', {
            email: 'getPasswordRecoveryEmail'
        }),
    },
    methods: {
        ...mapActions('auth', ['recoverPassword', 'verifyRecoveryCode']),
        async onResendEmail () {
            this.resendingEmail = true
            await this.recoverPassword(this.email)
            this.resendingEmail = false
        },
        async onSubmit() {
            this.isSubmitting = true
            await this.verifyRecoveryCode(this.code).then(success => {
                if (success) {
                    this.$router.push({name: 'setNewPassword'})
                } else {
                    this.error = 'Invalid code'
                }
            }).catch(err => {
                console.log('something went wrong')
            })
            this.isSubmitting = false
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.verification-code-screen {
    h2 {
        margin-top: 10vh;
    }
    .retry-actions {
        display: flex;
        flex-direction: column;
        .text-link {
            margin-top: 20px;
        }
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