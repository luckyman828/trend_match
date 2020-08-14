<template>
    <tr>
        <td class="select"><BaseCheckbox ref="selectBox" :value="user" :modelValue="localSelectedUsers" v-model="localSelectedUsers"/></td>
        <td class="title">
            <i class="fas fa-user"></i>
            <span>{{user.name}}</span>
        </td>
        <td class="email">{{user.email}}</td>
        <td class="action">
            <button class="ghost sm"
            @click="removeUsersFromFile({file, users: [user]})">
                <i class="far fa-user-times"></i>
                <span>Remove user</span>
            </button>
        </td>
    </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'fileEditorsTableRow',
    props: [
        'user',
        'file',
        'selectedUsers',
    ],
    computed: {
        localSelectedUsers: {
            get() { return this.selectedUsers },
            set(localSelectedUsers) {this.$emit('input', localSelectedUsers)}
        },
    },
    methods: {
        ...mapActions('files', ['removeUsersFromFile']),
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';


</style>