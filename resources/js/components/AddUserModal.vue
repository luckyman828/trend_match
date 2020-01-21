<template>
    <Modal ref="addUserModal" :header="'Add new user to workspace'" v-slot="slotProps" 
    :visible="visible" :visibilityKey="visibilityKey" @hide="hide" @show="show">
        <!-- <form @input="validateInput"> -->
        <form novalidate @submit="!submitDisabled && onSubmit($event)">
            <div class="user-wrapper" v-for="(user, index) in usersToAdd" :key="index">
                <div class="controls" v-if="usersToAdd.length > 1">
                    <h3>User {{index+1}}</h3>
                    <button @click="onRemoveUser(index)"><i class="fas fa-user-minus"></i><span>Remove</span></button>
                </div>
                <div class="form-element">
                    <label :for="'new-user-email-'+index">Email *</label>
                    <InputField ref="emailInput" type="email" :id="'new-user-email-'+index" placeholder="email" autocomplete="off"
                    v-model="usersToAdd[index].email" @paste="onPaste($event, index)" @blur="validateInput($event.target)"/>
                </div>
                <div class="form-element">
                    <label :for="'new-user-name-'+index"> Name (optional)</label>
                    <input ref="nameInput" class="input-wrapper" type="text" :id="'new-user-name-'+index" placeholder="name" autocomplete="off" 
                    v-model="usersToAdd[index].name">
                </div>
                <div class="form-element">
                    <label :for="'new-user-password-'+index">Password *</label>
                    <InputField ref="passwordInput" type="text" :id="'new-user-password-'+index" autocomplete="new-password"
                    v-model="usersToAdd[index].password" @blur="validateInput($event.target)"/>
                </div>
            </div>
            <div class="form-element">
                <button type="button" class="dark" @click="onAddUser"><i class="fas fa-user-plus"></i><span>Add user</span></button>
            </div>
            <div class="form-element">
                <button type="submit" class="lg primary full-width" :disabled="submitDisabled" @click="onSubmit">
                    <span>Add<template v-if="usersToAdd.length > 1"> {{usersToAdd.length}}</template> user<template v-if="usersToAdd.length > 1">(s)</template></span>
                </button>
            </div>
        </form>
    </Modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Modal from './Modal'

export default {
    name: 'addUserModal',
    extends: Modal,
    data: function() { return {
        usersToAdd: [{
            email: null,
            name: null,
            password: null,
        }],
        userDefaultObject: {
            email: null,
            name: null,
            password: null,
        },
        submitDisabled: true,
    }},
    props: [
        'users'
    ],
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId']),
    },
    methods: {
        ...mapActions('entities/workspaceUsers', ['addUsersToWorkspace']),
        onAddUser() {
            this.usersToAdd.push(JSON.parse(JSON.stringify(this.userDefaultObject)))
        },
        onRemoveUser(index) {
            this.usersToAdd.splice(index, 1)
        },
        onPaste(e, index) {
            // Get the clipData
            const clipData = e.clipboardData.getData('text/plain')
            clipData.trim('\r\n')
            const rows = clipData.split('\n')
            rows.forEach(row => {
                const cells = row.split('\t')
                if (cells.length > 1) e.preventDefault()
                // If the cell 0 has an @ character, add a user object
                if (cells[0].indexOf('@') >= 0) {
                    const newUser = {email: cells[0], name: cells[1], password: cells[2]}
                    // If no email has been provided for the first user, replace the first user
                    if (this.usersToAdd[index].email && this.usersToAdd[index].email.indexOf('@') >= 0) {
                        this.usersToAdd.push(newUser)
                    } else {
                        this.$set(this.usersToAdd, index, newUser)
                    }
                }
            })
        },
        onSubmit(e) {
            e.preventDefault()
            // Check that the form fields are valid
            const inputIsValid = this.validateInput()
            if (!inputIsValid) return
            // Submit form
            this.addUsersToWorkspace({workspaceId: this.currentWorkspaceId, usersToAdd: this.usersToAdd})
            this.hide()
            
        },
        validateInput(inputField) {
            // inputField is expected to be the inputfield triggering the validation check.
            // This functions will always check all input fields in the form.
            // The function will display error messages for all fields, unless the inputfield argument is provided
            // In this case only the mathcing input field will display an error 
            
            // Can be used to validate input before submit
            // Validate all input fields
            const emailFields = this.$refs.emailInput
            const nameFields = this.$refs.nameFields
            const passwordFields = this.$refs.passwordInput

            // Assume the input to be valid
            let inputValid = true

            // Validate email input
            if (emailFields) emailFields.forEach(field => {
                const showError = inputField ? field.$refs.inputField == inputField : true
                const valid = this.validateEmailField(field, showError)
                if (!valid) inputValid = false
            })

            // Validate email input
            if (passwordFields) passwordFields.forEach(field => {
                // If an input field is provided, check if the field is the current field being checked. Otherwise always return true
                const showError = inputField ? field.$refs.inputField == inputField : true
                const valid = this.validatePasswordField(field, showError)
                if (!valid) inputValid = false
            })
            this.submitDisabled = !inputValid
            return inputValid
        },
        validateEmailField(field, showError) {
            const email = field.value
            // Regular expression to check against:
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const isValidEmail = regex.test(email)
            const emailDoesNotExist = this.users.findIndex(x => x.email == email) < 0
            const valid = isValidEmail && emailDoesNotExist
            if (valid) {
                field.error = false
                return true
            } else {
                if (showError) {
                    if (!isValidEmail) {
                        field.error = 'Email must be of form <i>example@email.com</i>, and must not be blank'
                    } else {
                        field.error = 'A user with this email already exists on the workspace'
                    }
                }
                return false
            }
        },
        validatePasswordField(field, showError) {
            const password = field.value
            const valid = password.length >= 8
            if (valid) {
                field.error = false
                return true
            } else {
                if (showError) field.error = 'Password must be at least <strong>8 characters</strong> long'
                return false
            }
        },
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .modal {
        background: $bg;
    }

    .user-wrapper {
        padding: 20px 32px 40px;
        box-shadow: 0px 3px 6px #0000005A;
        border-radius: 4px;
        margin-bottom: 20px;
        h3 {
            margin: 0;
        }
        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
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