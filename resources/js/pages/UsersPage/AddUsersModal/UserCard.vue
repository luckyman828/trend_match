<template>
    <div class="user-wrapper" :class="status">
        <div class="info" v-if="existsOnWorkspace" v-tooltip="'User is already on the workspace and will be ignored.'">
            <i class="far fa-info-circle"></i>
            <span>Already on workspace</span>
        </div>
        <div class="info" v-else-if="existsOnKollekt" v-tooltip="`This user's name and password will not be updated.`">
            <i class="far fa-info-circle"></i>
            <span>Already exists on Kollekt</span>
        </div>
        <div class="controls" v-if="userCount > 1">
            <h4>User {{ index + 1 }}</h4>
            <button class="ghost" @click="$emit('remove')"><i class="fas fa-user-minus"></i><span>Remove</span></button>
        </div>
        <div class="form-element">
            <label :for="'new-user-email-' + index">Email *</label>
            <BaseInputField
                ref="emailInput"
                type="email"
                :id="'new-user-email-' + index"
                placeholder="email"
                autocomplete="off"
                :errorTooltip="emailErr"
                :status="status"
                v-model="user.email"
                :selectOnFocus="true"
                @focus="emptyOnFocus = !user.email"
                @paste="$emit('paste', { e: $event, index })"
                @input="onInput"
                @blur="validateUser()"
                @submit="$refs.nameInput && $refs.nameInput.focus()"
            />
        </div>
        <template v-if="!existsOnKollekt && !existsOnWorkspace">
            <div class="form-element">
                <label :for="'new-user-name-' + index"> Name (optional)</label>
                <BaseInputField
                    ref="nameInput"
                    type="text"
                    :id="'new-user-name-' + index"
                    placeholder="name"
                    autocomplete="off"
                    :selectOnFocus="true"
                    v-model="user.name"
                    @submit="$refs.passwordInput && $refs.passwordInput.focus()"
                />
            </div>
            <div class="form-element">
                <label :for="'new-user-password-' + index">Password *</label>
                <BaseInputField
                    ref="passwordInput"
                    type="text"
                    :id="'new-user-password-' + index"
                    autocomplete="new-password"
                    :errorTooltip="passwordErr"
                    v-model="user.password"
                    :selectOnFocus="true"
                    @input="onInput"
                    @blur="validateUser()"
                    @focus="emptyOnFocus = !user.password"
                />
            </div>
        </template>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'userCard',
    props: ['user', 'userCount', 'index'],
    data: function() {
        return {
            queryUsersTimeout: null,
            inputTimeout: null,
            userQueryResults: [],
            existsOnWorkspace: false,
            existsOnKollekt: false,
            emailErr: null,
            passwordErr: null,
            emptyOnFocus: false,
        }
    },
    computed: {
        ...mapGetters('users', {
            workspaceUsers: 'users',
        }),
        userEmail() {
            return this.user.email
        },
        status() {
            if (this.emailErr) return 'error'
            if (this.existsOnWorkspace) return 'warning'
            if (this.existsOnKollekt && this.user.email) return 'success'
            if (!this.passwordErr && this.user.email && this.user.password) return 'success'
        },
    },
    watch: {
        userEmail(newEmail) {
            if (!newEmail || newEmail.length < 3) return
            // Throttle search
            if (this.queryUsersTimeout) clearTimeout(this.queryUsersTimeout)
            this.queryUsersTimeout = setTimeout(() => {
                this.fetchUserQueryResults(newEmail)
            }, 500)
        },
    },
    methods: {
        ...mapActions('users', ['searchForUser']),
        async fetchUserQueryResults(query) {
            this.userQueryResults = await this.searchForUser(query)
            this.validateUser()
        },
        onInput() {
            // Throttle search
            if (this.emptyOnFocus) {
                if (this.queryUsersTimeout) clearTimeout(this.queryUsersTimeout)
                this.queryUsersTimeout = setTimeout(() => {
                    this.validateUser()
                }, 3000)
            } else {
                this.validateUser()
            }
        },
        async validateUser(fullValidate) {
            const user = this.user

            // Assume success
            this.existsOnWorkspace = false
            this.existsOnKollekt = false
            this.emailErr = null
            this.passwordErr = null

            let isValid = true

            // VALIDATE EMAIL
            if (user.email || fullValidate) {
                const emailValid = await this.validateEmail()
                if (!emailValid) isValid = false
            }

            // VALIDATE PASSWORD
            // Only validate password if we have a password and we are not ignoring it
            if (!this.existsOnKollekt && (user.password || fullValidate)) {
                const passwordValid = this.validatePassword()
                if (!passwordValid) isValid = false
            }

            return isValid
        },

        async validateEmail() {
            const email = this.user.email.toLowerCase()
            let isValid = true

            // Check if the email is valid
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const isValidEmail = regex.test(email)
            if (!isValidEmail) {
                this.emailErr = 'Email must be of form <i>example@email.com</i>, and must not be blank'
                return false
            }

            // Check if the user already exists
            this.existsOnKollekt = !!this.userQueryResults.find(x => x.email == email)
            if (this.existsOnKollekt) this.user.password = 'mustBe8Long'

            // Check if the user already exists on the dashboard
            this.existsOnWorkspace = !!this.workspaceUsers.find(x => x.email == email)

            return isValid
        },
        validatePassword() {
            const password = this.user.password
            let isValid = true
            if (password.length < 8) {
                this.passwordErr = 'Password must be at least <strong>8 characters</strong> long'
                isValid = false
            }
            return isValid
        },
    },
    destroyed() {
        if (this.queryUsersTimeout) clearTimeout(this.queryUsersTimeout)
        if (this.inputTimeout) clearTimeout(this.inputTimeout)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.user-wrapper {
    padding: 20px 32px 40px;
    box-shadow: $shadowModule;
    border-radius: $borderRadiusModule;
    border: $borderModule;
    margin-bottom: 20px;
    background: $bgContent;
    .info {
        display: inline-block;
    }
    &.error {
        border-left: 12px solid $danger;
    }
    &.warning {
        border-left: 12px solid $warning;
    }
    &.success {
        border-left: 12px solid $success;
    }
    &.warning,
    &.error,
    &.success {
        padding-left: 20px;
    }
    h4 {
        margin: 0;
    }
    .controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    .form-element {
        &:last-child {
            margin-bottom: 0;
        }
    }
}

.input-wrapper {
    &.error {
        border: solid 2px $fail;
        & + .error-msg {
            display: flex;
        }
    }
}
.error-msg {
    display: none;
    margin-top: 4px;
    font-size: 12px;
    > i {
        margin-right: 6px;
        margin-top: 3px;
    }
}
</style>
