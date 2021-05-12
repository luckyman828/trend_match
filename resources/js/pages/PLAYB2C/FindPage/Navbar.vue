<template>
    <Portal to="navbar">
        <div class="navbar-files flex-list justify">
            <div class="items-left"></div>
            <div class="item-right flex-list">
                <BaseButton
                    buttonClass="dark pill"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create new files'"
                    @click="onNewPresentation"
                >
                    <i class="far fa-file-plus"></i>
                    <span>New presentation</span>
                </BaseButton>
            </div>

            <NewPresentationModal
                v-if="showNewPresentationModal"
                :show="showNewPresentationModal"
                @close="showNewPresentationModal = false"
            />
        </div>
    </Portal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import NewPresentationModal from './NewPresentationModal/'

export default {
    name: 'play.findNavbar',
    components: {
        NewPresentationModal,
    },
    data: function() {
        return {
            showNewPresentationModal: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
    },
    methods: {
        ...mapActions('playPresentations', ['instantiateBasePresentation', 'insertPresentation']),
        ...mapMutations('playPresentation', ['SET_PRESENTATION']),
        async onNewPresentation() {
            // Secretly create a new file
            const newPresentation = await this.instantiateBasePresentation()
            this.SET_PRESENTATION(newPresentation)
            this.showNewPresentationModal = true
            await this.insertPresentation(newPresentation)
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.navbar-files {
    display: flex;
    justify-content: space-between;
    grid-area: navbar;
    > * {
        display: flex;
        align-items: center;
    }
}
</style>
