<template>
    <portal to="navbar">
        <div class="navbar-files flex-list justify">
            <div class="items-left"></div>
            <div class="item-right flex-list">
                <BaseButton buttonClass="dark pill" @click="showRenamePresentationModal = true">
                    <i class="far fa-edit"></i>
                    <span>Rename</span>
                </BaseButton>
            </div>

            <RenamePresentationModal :show.sync="showRenamePresentationModal" v-if="showRenamePresentationModal" />
        </div>
    </portal>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RenamePresentationModal from '../../../components/PLAY/RenamePresentationModal'

export default {
    name: 'editVideoPresentationNavbar',
    components: {
        RenamePresentationModal,
    },
    data() {
        return {
            showRenamePresentationModal: false,
        }
    },
    computed: {},
    watch: {},
    methods: {},
}
</script>
