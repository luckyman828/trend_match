<template>
    <BaseModal ref="addUserModal" :header="'Add new user to workspace'" 
    :show="show" @close="$emit('close')">
        <form novalidate @submit="!submitDisabled && onSubmit($event)">
            <div class="user-wrapper" v-for="(user, index) in usersToAdd" :key="index"
            :class="user.status" ref="userWrapper">
                <div class="info" v-if="user.status == 'ignore'"
                v-tooltip="'This user already exists and will not have their name or password updated.'">
                    <i class="far fa-info-circle"></i> 
                    <span>User will be ignored</span>
                </div>
                <div class="controls" v-if="usersToAdd.length > 1">
                    <h3>User {{index+1}}</h3>
                    <button @click="onRemoveUser(index)"><i class="fas fa-user-minus"></i><span>Remove</span></button>
                </div>
                <div class="form-element">
                    <label :for="'new-user-email-'+index">Email *</label>
                    <BaseInputField ref="emailInput" type="email" :id="'new-user-email-'+index" placeholder="email" autocomplete="off"
                    :errorTooltip="user.emailErr"
                    v-model="user.email" @paste="onPaste($event, index)" 
                    @input="user.emailErr && validateEmail(user, index)"
                    @blur="validateEmail(user, index)"/>
                </div>
                <!-- <template v-if="user.status != 'ignore'"> -->
                    <div class="form-element">
                        <label :for="'new-user-name-'+index"> Name (optional)</label>
                        <BaseInputField ref="nameInput" type="text" :id="'new-user-name-'+index" placeholder="name" autocomplete="off"
                        :readOnly="user.status == 'ignore'"
                        v-model="user.name"/>
                    </div>
                    <div class="form-element">
                        <label :for="'new-user-password-'+index">Password *</label>
                        <BaseInputField ref="passwordInput" type="text" :id="'new-user-password-'+index" autocomplete="new-password"
                        :errorTooltip="user.passwordErr"
                        :readOnly="user.status == 'ignore'"
                        v-model="user.password" 
                        @input="user.passwordErr && validatePassword(user, index)"
                        @blur="validatePassword(user, index)"/>
                    </div>
                <!-- </template> -->
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

        <BaseDialog ref="ignoredUsersUsersDialog" type="dialog"
        confirmColor="primary" confirmText="Got it">
            <div class="icon-graphic">
                <i class="lg primary far fa-users"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-building"></i>
            </div>
            <h3>Success!</h3>
            <p v-if="usersExistingInForm.length > 0">The form contained <strong>{{usersExistingInForm.length}} duplicates</strong> that have been ignored.</p>
            <p v-if="usersExistingOnWorkspace.length > 0">
                <strong>{{usersExistingOnWorkspace.length}} users</strong> already exist on this workspace.
            </p>
            <p v-if="usersExistingOnAnotherWorkspace.length > 0">
                <strong>{{usersExistingOnAnotherWorkspace.length}} users</strong> already exist on another workspace.
            </p>
            <p v-if="usersExistingOnAnotherWorkspace.length > 0 || usersExistingOnWorkspace.length > 0">We have not updated their name or password:</p>
            <div class="ignored-users-list">
                <li v-for="(user, index) in usersExistingOnWorkspace.concat(usersExistingOnAnotherWorkspace)" :key="index">{{user.name}} ({{user.email}})</li>
            </div>
        </BaseDialog>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'addUserModal',
    data: function() { return {
        usersToAdd: [],
        userDefaultObject: {
            email: '',
            name: '',
            password: '',
            role: 'Member',
            status: null,
            emailErr: null,
            passwordErr: null,
            existsOnWorkspace: false,
            existsInForm: false,
        },
        submitDisabled: false,
        ignoredUsers: [],
        usersExistingOnWorkspace: [],
        usersExistingInForm: [],
        usersExistingOnAnotherWorkspace: [],
    }},
    props: [
        'users',
        'show'
    ],
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
    },
    methods: {
        ...mapActions('users', ['addUsersToWorkspace', 'searchForUser']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        onAddUser() {
            this.usersToAdd.push(JSON.parse(JSON.stringify(this.userDefaultObject)))
            // this.$nextTick(() => { this.$nextTick(() => {
            //     this.validateUsers()
            // })})
        },
        onRemoveUser(index) {
            this.usersToAdd.splice(index, 1)
            // this.$nextTick(() => { this.$nextTick(() => {
            //     this.validateUsers()
            // })})
        },
        onPaste(e, index) {
            // e.preventDefault()
            // Get the clipData
            const clipData = e.clipboardData.getData('text/plain')
            clipData.trim('\r\n')
            const rows = clipData.split('\r\n')
            rows.forEach(row => {
                const cells = row.split('\t')
                // Prevent fancy paste for simple pasting
                if (cells.length <= 1) return
                // Else prevent default pasting
                else e.preventDefault()
                // If the cell 0 has an @ character, add a user object
                if (cells[0].indexOf('@') >= 0) {
                    const newUser = JSON.parse(JSON.stringify(this.userDefaultObject))
                    newUser.email = cells[0]
                    newUser.name = cells[1]
                    newUser.password = cells[2]
                    // If no email has been provided for the first user, replace the first user
                    if (this.usersToAdd[index].email && this.usersToAdd[index].email.indexOf('@') >= 0) {
                        this.usersToAdd.push(newUser)
                    } else {
                        this.$set(this.usersToAdd, index, newUser)
                    }
                }
            })
            this.validateUsers()
            // Scroll to the last user
            this.$nextTick(() => { this.$nextTick(() => {
                this.$refs.userWrapper[this.usersToAdd.length-1].scrollIntoView()
            })})
        },
        async onSubmit(e) {
            e.preventDefault()
            // Check that the form fields are valid
            const userValidation = this.validateUsers()
            if (!userValidation.valid) {
                this.SHOW_SNACKBAR({ 
                    msg: `One or more users have an error`,
                    type: 'info', 
                    iconClass: 'fa-exclamation-circle',
                    callback: () => {
                        const errorIndex = userValidation.errorIndexes[0]
                        const errorEl = this.$refs.userWrapper[errorIndex]
                        errorEl.scrollIntoView()
                        
                    },
                    callbackLabel: 'Go to error'
                })
                return
            }
            // Submit form
            await this.addUsersToWorkspace(this.usersToAdd.filter(x => x.status != 'ignore')).then(async response => {
                if (response) {
                    this.usersExistingOnAnotherWorkspace = response.data.existed_users
                }
                this.usersExistingOnWorkspace = this.usersToAdd.filter(x => x.existsOnWorkspace)
                this.usersExistingInForm = this.usersToAdd.filter(x => x.existsInForm)
                if (this.usersExistingOnWorkspace.length + this.usersExistingInForm.length > 0) {
                    await this.$refs.ignoredUsersUsersDialog.show()
                }
                this.reset()
                this.$emit('close')
            }).catch(err => {
                console.log('error when adding users to worksapce', err)
            })
        },
        validateEmail(user, index) {
            const email = user.email
            // Check if the email is valid
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const isValidEmail = regex.test(email)
            if (!isValidEmail) {
                user.emailErr = 'Email must be of form <i>example@email.com</i>, and must not be blank'
                user.status = 'error'
                return false
            }

            // Check if there is a user earlier in this form with the same email
            const usersBefore = this.usersToAdd.slice(0, index)
            const emailExistsInForm = !!usersBefore.find(x => x.email == email)
            if (emailExistsInForm) {

                user.emailErr = 'Duplicate: A user with this email already exists in this form'
                user.status = 'ignore'
                user.existsInForm = true
                return true
            }

            // Check if the user already exists on the dashboard
            const emailExists = !!this.users.find(x => x.email == email)
            if (emailExists) {
                user.emailErr = 'A user with this email already exists on the workspace'
                user.existsOnWorkspace = true
                user.status = 'ignore'
                return true
            }

            user.emailErr = null
            if (user.email && !user.emailErr && user.password && !user.passwordErr) user.status = 'success'
            return true

        },
        validatePassword(user, index) {
            if (user.status == 'ignore') return true

            const password = user.password
            if (password.length < 8) {
                user.passwordErr = 'Password must be at least <strong>8 characters</strong> long'
                user.status = 'error'
                return false
            }

            if (user.email && !user.emailErr && user.password && !user.passwordErr) user.status = 'success'
            user.passwordErr = null
            return true
        },
        validateUsers() {
            let valid = true
            let errorIndexes = []
            this.usersToAdd.forEach((user, index) => {
                const emailValid = this.validateEmail(user, index)
                const passwordValid = this.validatePassword(user, index)
                if (!emailValid || !passwordValid) {
                    valid = false
                    errorIndexes.push(index)
                }
            })
            // this.submitDisabled = !valid
            return {valid, errorIndexes}
        },
        reset() {
            // this.submitDisabled = true
            this.usersToAdd = [JSON.parse(JSON.stringify(this.userDefaultObject))]
            this.ignoredUsers = []
        }
    },
    created() {
        this.usersToAdd.push(JSON.parse(JSON.stringify(this.userDefaultObject)))
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
        &.ignore {
            border-left: 12px solid $warning;
        }
        &.success {
            border-left: 12px solid $success;
        }
        &.ignore, &.error, &.success {
            padding-left: 20px;
        }
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
.ignored-users-list {
    text-align: left;
    font-size: 13px;
    margin-top: 12px;
}
</style>