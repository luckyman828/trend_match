<template>
    <div class="snackbar-spawner">
        <BaseSnackbar v-for="snackbar in getSnackbars.slice().reverse()"
        :snackbar="snackbar" :key="snackbar.id"/>
        <button class="primary" style="margin-top: 32px"
        @click="onSpawnSnackbar">
            <span>Spawn snackbar</span>
        </button>

        <BaseDialog ref="baseDialog" confirmColor="primary">
            <div class="graphic" style="width: 188px; display: flex; justify-content: space-between; margin: auto;">
                <i class="lg far fa-file primary"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg far fa-trash dark"></i>
            </div>
            <h3>You are about to delete a Selection</h3>
            <p>This wil permanently delete the following</p>
        </BaseDialog>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'theSnackbarSpawner',
    computed: {
        ...mapGetters('alerts', ['getSnackbars']),
    },
    methods: {
        onSpawnSnackbar() {
            this.$root$refs.baseDialog.confirm().then((bool) => { if (bool) {
                console.log(bool)
            }})
        },
        async onSpawnSnackbar() {
            if (await this.$refs.baseDialog.confirm()) {
                this.testAlert('IT WORKED!')
            }
        },
        testAlert(msg) {
            console.log(msg)
        }
    }
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