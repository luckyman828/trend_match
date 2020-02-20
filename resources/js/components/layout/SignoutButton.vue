<template>
    <button class="logout-wrapper signout-button" @click="logout">
        <i class="far fa-sign-out fa-flip-horizontal"></i>
        Sign out
    </button>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'signoutButton',
    methods: {
        ...mapActions('auth', ['logout']),
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    button.link.signout-button {
        height: 80px;
    }
</style>