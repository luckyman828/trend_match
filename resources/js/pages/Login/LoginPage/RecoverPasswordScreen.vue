<template>
    <div class="recover-password-screen">
        <h2>Lost your pasword?</h2>
        <h3>We will help you get access again</h3>
        <form @submit.prevent="onSubmit">
            <div class="form-element">
                <label for="email">E-mail Address</label>
                <!-- <input id="email" type="email" class="input-wrapper" name="email" required autocomplete="email"> -->
                <BaseInputField id="email" type="email" name="email" required autocomplete="email"
                v-model="email"/>
            </div>

            <div class="form-element" style="text-align: center;">
                <router-link class="text-link" :to="{name: 'login'}">Got your login details? Go to login</router-link>
            </div>

            <div class="error-wrapper" v-if="error">
                <i class="far fa-exclamation-triangle"></i>
                <span>{{error}}</span>
            </div>

            <div class="form-element">
                <button v-if="!isSubmitting" type="submit" class="button dark full-width xl">
                    <span>Get recovery code</span>
                </button>
                <BaseLoader v-else msg="Submitting"/>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'resoverPasswordScreen',
    data: function () { return {
        email: '',
        error: false,
        isSubmitting: false,
    }},
    methods: {
        ...mapActions('auth', ['recoverPassword']),
        async onSubmit () {
            this.isSubmitting = true
            await this.recoverPassword(this.email).then((success) => {
                if (success) {
                    this.$router.push({name: 'verificationCode'})
                } else {
                    this.error = 'We don\' recognize that e-mail.'
                }
            }).catch(err => {
                this.error = 'Something went wrong. Please refresh the page and try again.\nIf you continue to see this issue, please contact Kollekt support.'
            })
            this.isSubmitting = false
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.recover-password-screen {
    h2 {
        margin-top: 10vh;
    }
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