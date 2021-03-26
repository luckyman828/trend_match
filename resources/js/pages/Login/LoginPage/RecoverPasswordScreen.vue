<template>
    <form class="recover-password-form flex-list flex-v space-md" @submit.prevent="onSubmit">
        <div class="flex-list space-md center-v">
            <div class="square lg rounded">
                <i class="key-icon fas fa-key primary"></i>
            </div>
            <div class="flex-list flex-v lh-xs space-sm">
                <div class="ft-20 ft-bd color-dark">Recover password</div>
                <div class="color-grey ft-12 ft-md">Get access again</div>
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

        <router-link class="button invisible" :to="{ name: 'login' }">
            <span>Got your login already</span>
            <i class="far fa-question-circle"></i>
        </router-link>

        <div class="error-wrapper" v-if="error">
            <i class="far fa-exclamation-triangle"></i>
            <span>{{ error }}</span>
        </div>

        <BaseButton
            type="submit"
            :disabled="submitDisabled"
            class="submit-button full-width"
            buttonClass="button primary full-width lg"
        >
            <span class="ft-bd ft-14" v-if="!isSubmitting">Get recovery code</span>
            <BaseLoader v-else msg="Submitting" />
        </BaseButton>
    </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LoginInputField from './LoginInputField'

export default {
    name: 'resoverPasswordScreen',
    components: { LoginInputField },
    data: function() {
        return {
            email: '',
            error: false,
            isSubmitting: false,
        }
    },
    computed: {
        submitDisabled() {
            return this.email.length < 5 || this.email.search('@') <= 0
        },
    },
    methods: {
        ...mapActions('auth', ['recoverPassword']),
        async onSubmit() {
            this.isSubmitting = true
            await this.recoverPassword(this.email)
                .then(success => {
                    if (success) {
                        this.$router.push({ name: 'verificationCode' })
                    } else {
                        this.error = "We don' recognize that e-mail."
                    }
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

.recover-password-form {
    height: 100%;
    .key-icon {
        font-size: 18px !important;
        margin-left: 14px !important;
        margin-right: 14px !important;
    }
    form {
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
    .submit-button {
        margin-top: auto !important;
    }
}
</style>
