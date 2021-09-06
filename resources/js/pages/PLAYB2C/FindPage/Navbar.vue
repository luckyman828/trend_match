<template>
    <Portal to="navbar">
        <div class="navbar-files flex-list equal-width">
            <div class="items-left truncate">
                <img v-if="workspace.logo" :src="workspace.logo" alt="workspace logo" class="logo" />
                <div v-else class="text-logo truncate ft-16 ft-bd ft-uppercase">{{ workspace.title }}</div>
            </div>
            <div class="items-center center-h">
                <BaseSearchFieldV2
                    class="search"
                    :arrayToSearch="allPresentations"
                    v-model="presentationsFilteredBySearch"
                    :searchKey="['name']"
                    placeholderText="Search for Presentation"
                    :hotkeyEnabled="true"
                />
            </div>
            <div class="item-right flex-list flex-end-h">
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
        ...mapGetters('workspaces', {
            authUserWorkspaceRole: 'authUserWorkspaceRole',
            workspace: 'getCurrentWorkspace',
        }),
        ...mapGetters('playPresentations', {
            allPresentations: 'getPresentations',
        }),
        presentationsFilteredBySearch: {
            get() {
                return this.$store.getters['playPresentations/getPresentationsFilteredBySearch']
            },
            set(value) {
                this.$store.commit('playPresentations/SET_PRESENTATIONS_FILTERED_BY_SEARCH', value)
            },
        },
    },
    methods: {
        async onNewPresentation() {
            this.showNewPresentationModal = true
        },
    },
}
</script>

<style scoped lang="scss">
.navbar-files {
    display: flex;
    justify-content: space-between;
    grid-area: navbar;
    > * {
        display: flex;
        align-items: center;
    }
    .search {
        min-width: 232px;
    }
}
</style>
