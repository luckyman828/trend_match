<template>
    <form class="set-password-form flex-list flex-v space-md" @submit.prevent="onSubmit">
        <div class="flex-list space-md center-v">
            <div class="true-square lg rounded">
                <i class="key-icon fas fa-key primary"></i>
            </div>
            <div class="flex-list flex-v lh-xs space-sm">
                <div class="ft-20 ft-bd color-dark">Choose a new password</div>
                <div class="color-grey ft-12 ft-md">
                    Must be at least 8 characters long
                </div>
            </div>
        </div>

        <LoginInputField
            id="password"
            name="password"
            label="New Password"
            :type="showPassword ? 'text' : 'password'"
            required
            autocomplete="new-password"
            v-model="password"
        >
            <button class="white true-square" type="button" @click="showPassword = !showPassword">
                <i class="fas" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'" />
            </button>
        </LoginInputField>

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
            <span class="ft-bd ft-14" v-if="!isSubmitting">Set password</span>
            <BaseLoader v-else msg="Submitting" />
        </BaseButton>
    </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LoginInputField from './LoginInputField'

export default {
    name: 'loginScreen',
    components: { LoginInputField },
    data: function() {
        return {
            password: '',
            error: false,
            showPassword: false,
            isSubmitting: false,
        }
    },
    computed: {
        nextUrl() {
            return this.$route.params.nextUrl
        },
        submitDisabled() {
            return this.password.length < 8
        },
    },
    methods: {
        ...mapActions('auth', ['login', 'setNewPassword']),
        onSubmit() {
            this.isSubmitting = true
            this.setNewPassword(this.password)
                .then(success => {
                    if (success) {
                        this.$router.push({ name: 'login' })
                    } else {
                        this.error = 'Invalid password: Must be at least 8 characters long'
                    }
                    // this.$router.push('/')
                })
                .catch(err => {
                    this.error =
                        'Something went wrong. Please refresh the page and try again.\nIf you continue to see this issue, please contact Kollekt support.'
                })
            this.isSubmitting = false
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.set-password-form {
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
