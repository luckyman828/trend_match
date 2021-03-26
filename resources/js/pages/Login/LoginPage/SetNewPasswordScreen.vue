<template>
    <div class="set-password-screen">
        <h2>Choose a new password</h2>
        <h3>Must be at least 8 characters long</h3>

        <form @submit.prevent="onSubmit">

            <div class="form-element">
                <label for="password">Password</label>
                <BaseInputField id="password" :type="showPassword ? 'text' : 'password'" name="password" 
                required autocomplete="new-password" v-model="password">
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
                    <span>Set password</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'loginScreen',
    data: function () { return {
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
        ...mapActions('auth', ['login', 'setNewPassword']),
        onSubmit () {
            this.isSubmitting = true
            this.setNewPassword(this.password).then((success) => {
                if (success) {
                    this.$router.push({name: 'login'})
                } else {
                    this.error = 'Invalid password: Must be at least 8 characters long'
                }
                // this.$router.push('/')
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

.set-password-screen {
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