<template>
    <BaseModal ref="addUserModal" :show="show" @close="$emit('close')" classes="sm">
        <div class="form-wrapper">
            <h3>Add new user to workspace</h3>

            <UserCard
                ref="userCard"
                v-for="(user, index) in usersToAdd"
                :key="index"
                :user="user"
                :index="index"
                :userCount="usersToAdd.length"
                :class="user.status"
                @remove="onRemoveUser(index)"
                @paste="onPaste"
            />

            <div class="form-element">
                <button type="button" class="dark" @click="onAddUser">
                    <i class="fas fa-user-plus"></i><span>Add user</span>
                </button>
            </div>
            <div class="form-element">
                <button type="submit" class="lg primary full-width" :disabled="submitDisabled" @click="onSubmit">
                    <span
                        >Add<template v-if="usersToAdd.length > 1"> {{ usersToAdd.length }}</template> user<template
                            v-if="usersToAdd.length > 1"
                            >(s)</template
                        ></span
                    >
                </button>
            </div>
        </div>

        <BaseDialog ref="ignoredUsersUsersDialog" type="dialog" confirmColor="primary" confirmText="Got it">
            <div class="icon-graphic">
                <i class="lg primary far fa-users"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-building"></i>
            </div>
            <h3>Success!</h3>
            <p>{{ userAddedCount }} users added</p>
            <p v-if="ignoredUsers.length > 0">
                {{ ignoredUsers.length }} user already existed on the workspace and have been ignored.
            </p>
        </BaseDialog>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UserCard from './UserCard'

export default {
    name: 'addUserModal',
    components: { UserCard },
    data: function() {
        return {
            usersToAdd: [],
            userDefaultObject: {
                email: '',
                name: '',
                password: '',
                role: 'Member',
            },
            submitDisabled: false,
            ignoredUsers: [],
            userAddedCount: 0,
        }
    },
    props: ['users', 'show'],
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
    },
    methods: {
        ...mapActions('users', ['addUsersToWorkspace']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        onAddUser() {
            this.usersToAdd.push(JSON.parse(JSON.stringify(this.userDefaultObject)))
            this.validateUsers(false)
        },
        onRemoveUser(index) {
            this.usersToAdd.splice(index, 1)
            this.validateUsers(false)
        },
        onPaste(args) {
            const e = args.e
            const index = args.index
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
                    // If no email has been provided for the user, replace the user
                    if (this.usersToAdd[index].email && this.usersToAdd[index].email.indexOf('@') >= 0) {
                        this.usersToAdd.push(newUser)
                    } else {
                        this.$set(this.usersToAdd, index, newUser)
                    }
                }
            })

            this.$nextTick(() => {
                this.validateUsers()
            })
        },

        async validateUsers(fullValidate) {
            let valid = true
            for (const userCard of this.$refs.userCard) {
                const isValid = await userCard.validateUser(fullValidate)
                if (!isValid) valid = false
            }
            // this.submitDisabled = !valid
            return valid
        },
        async onSubmit(e) {
            e.preventDefault()
            // Check that the form fields are valid
            const usersValidated = this.validateUsers(true)
            if (!usersValidated) {
                this.SHOW_SNACKBAR({
                    msg: `One or more users have an error`,
                    type: 'info',
                    iconClass: 'fa-exclamation-circle',
                })
                return
            }
            // Submit form
            this.ignoredUsers = []
            const usersToAddFiltered = this.usersToAdd.filter((user, index) => {
                const usersBefore = this.usersToAdd.slice(0, index)
                const isDuplicate = !!usersBefore.find(x => x.email.toLowerCase() == user.email.toLowerCase())
                if (isDuplicate) {
                    this.ignoredUsers.push(user)
                    return false
                }
                const existsOnWorkspace = !!this.users.find(x => x.email.toLowerCase() == user.email.toLowerCase())
                if (existsOnWorkspace) {
                    this.ignoredUsers.push(user)
                    return false
                }
                return true
            })
            this.userAddedCount = usersToAddFiltered.length
            await this.addUsersToWorkspace(usersToAddFiltered)
                .then(async response => {
                    if (this.ignoredUsers.length > 0) {
                        await this.$refs.ignoredUsersUsersDialog.show()
                    }
                    this.reset()
                    this.$emit('close')
                })
                .catch(err => {
                    console.log('error when adding users to worksapce', err)
                })
        },
        reset() {
            // this.submitDisabled = true
            this.usersToAdd = [JSON.parse(JSON.stringify(this.userDefaultObject))]
            this.ignoredUsers = []
        },
    },
    created() {
        this.usersToAdd.push(JSON.parse(JSON.stringify(this.userDefaultObject)))
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.ignored-users-list {
    text-align: left;
    font-size: 13px;
    margin-top: 12px;
}
</style>
