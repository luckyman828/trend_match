<template>
  <div class="logout-wrapper signout-button" style="">
        <a href="/logout"
            onclick="event.preventDefault();
            document.getElementById('logout-form').submit();">
            <i class="far fa-sign-out fa-flip-horizontal"></i>
            Sign out
        </a>
        <form id="logout-form" action="/logout" method="POST" style="display: none;">
            <input type="hidden" name="_token" :value="csrfToken">
        </form>
    </div>
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
    a {
        text-decoration: none;
    }
</style>