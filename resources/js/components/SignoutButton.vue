<template>
  <a class="logout-wrapper signout-button" href="/logout"
        onclick="event.preventDefault();
        document.getElementById('logout-form').submit();">
        <i class="far fa-sign-out fa-flip-horizontal"></i>
        Sign out
        <form id="logout-form" action="/logout" method="POST" style="display: none;">
            <input type="hidden" name="_token" :value="csrfToken">
        </form>
    </a>
</template>

<script>
export default {
    name: 'signoutButton',
    computed: {
        csrfToken () {
            return window.Laravel.csrfToken
        }
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    a.link.signout-button {
        text-decoration: none;
        color: $primary;
    }
</style>