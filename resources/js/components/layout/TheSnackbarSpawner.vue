<template>
    <div class="snackbar-spawner">
        <BaseSnackbar v-for="snackbar in getSnackbars.slice().reverse()"
        :snackbar="snackbar" :key="snackbar.id"/>
        <button class="primary" style="margin-top: 32px"
        @click="onSpawnSnackbar">
            <span>Spawn snackbar</span>
        </button>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'theSnackbarSpawner',
    computed: {
        ...mapGetters('alerts', ['getSnackbars']),
    },
}
</script>

<style scoped lang="scss">
.snackbar-spawner {
    position: fixed;
    z-index: 99;
    right: 16px;
    bottom: 32px;
    display: flex;
    flex-direction: column;
}
</style>