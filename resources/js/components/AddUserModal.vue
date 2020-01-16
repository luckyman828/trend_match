<template>
    <Modal ref="addUserModal" :header="'Add new user to workspace'" v-slot="slotProps" 
    :visible="visible" :visibilityKey="visibilityKey" @hide="hide" @show="show">
        <form>
            <div class="user-wrapper" v-for="(user, index) in usersToAdd" :key="index">
                <div class="controls" v-if="usersToAdd.length > 1">
                    <h3>User {{index+1}}</h3>
                    <button @click="onRemoveUser(index)"><i class="fas fa-user-minus"></i><span>Remove</span></button>
                </div>
                <div class="form-element">
                    <label :for="'new-user-email-'+index">Email</label>
                    <input class="input-wrapper" type="email" :id="'new-user-email-'+index" placeholder="email" autocomplete="off"
                    v-model="usersToAdd[index].email" @paste="onPaste($event, index)">
                </div>
                <div class="form-element">
                    <label :for="'new-user-name-'+index"> Name (optional)</label>
                    <input class="input-wrapper" type="text" :id="'new-user-name-'+index" placeholder="name" autocomplete="off" 
                    v-model="usersToAdd[index].name">
                </div>
                <div class="form-element">
                    <label :for="'new-user-password-'+index">Password</label>
                    <input class="input-wrapper" type="password" :id="'new-user-password-'+index" autocomplete="new-password" 
                    v-model="usersToAdd[index].password">
                </div>
            </div>
            <div class="form-element">
                <button class="dark" @click="onAddUser"><i class="fas fa-user-plus"></i><span>Add user</span></button>
            </div>
            <div class="form-element">
                <button class="lg primary full-width" :disabled="submitDisabled">
                    <span>Add<template v-if="usersToAdd.length > 1"> {{usersToAdd.length}}</template> user<template v-if="usersToAdd.length > 1">(s)</template></span>
                </button>
            </div>
        </form>
    </Modal>
</template>

<script>
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
        }
    }},
    computed: {
        submitDisabled() {

        }
    },
    methods: {
        onAddUser() {
            this.usersToAdd.push(this.userDefaultObject)
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
        }
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

</style>