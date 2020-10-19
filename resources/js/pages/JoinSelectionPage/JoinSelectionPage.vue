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
import { mapGetters } from 'vuex'
export default {
    name: 'joinSelectionPage',
    data: function() {
        return {
            newEmail: '',
            emailValid: false,
            acceptTerms: false,
        }
    },
    computed: {
        submitDisabled() {
            return !(this.emailValid && this.acceptTerms)
        },
        disabledMsg() {
            if (!this.emailValid) return 'E-mail is invalid'
            if (!this.acceptTerms) return 'Please accept the terms & conditions'
        },
    },
    methods: {
        checkEmailIsValid(newVal) {
            const email = newVal
            const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const isValid = pattern.test(email)
            this.emailValid = isValid
            return isValid
        },
        onSubmit() {},
    },
}
</script>

<style lang="scss" scoped>
.join-selection-page {
    padding-top: 10vh;
}
.join-form {
    text-align: left;
}
</style>
