<template>
    <BaseFlyin ref="fileSingleFlyin" :show="show" :disableKeyHandler="SelectionUsersFlyinVisible"
    @close="$emit('close')">
        <template v-slot:header v-if="file && show">
            <BaseFlyinHeader :next="nextFile" :prev="prevFile"
            :disableNavigation="SelectionUsersFlyinVisible"
            @close="$emit('close')" @next="showNext" @prev="showPrev">
                <template v-slot:left>
                    <h3>File Overview: {{file.name}}</h3>
                </template>
                <template v-slot:right>
                    <div class="item-group">
                        <!-- <button class="ghost editable" @click="$emit('showFileOwnersFlyin', file)">
                            <i class="far fa-user-shield"></i>
                            <span>{{file.owner_count || 0}} File owners</span>
                        </button> -->
                        <BaseButton buttonClass="ghost" :disabled="authUserWorkspaceRole != 'Admin'"
                        v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can edit files'"
                        @click="goToEditSingle">
                            <span>View / Edit products</span>
                        </BaseButton>
                    </div>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-if="file && show" v-slot>
            <div class="file-single">
                <SelectionsTable v-if="!loadingSelections" :selections="selectionsTree" @showSelectionUsersFlyin="showSelectionUsersFlyin"/>

                <SelectionUsersFlyin v-if="!loadingSelections" :selection="currentSelection" :show="SelectionUsersFlyinVisible"
                @close="SelectionUsersFlyinVisible = false"/>
            </div>
        </template>
    </BaseFlyin>
</template>
f
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import SelectionsTable from './SelectionsTable'
import SelectionUsersFlyin from '../../../components/SelectionUsersFlyin'

export default {
    name: 'fileFlyin',
    props: [
        'file',
        'show'
    ],
    components: {
        SelectionsTable,
        SelectionUsersFlyin,
    },
    data: function(){ return {
        SelectionUsersFlyinVisible: false,
        loadingData: false,
    }},
    watch: {
        show: function(newVal, oldVal) {
            if (newVal) {
                if (!this.loadingData) this.fetchData()
            }
        },
        file: function(newVal, oldVal) {
            if (!oldVal || newVal.id != oldVal.id) {
                if (!this.loadingData) this.fetchData()
            }
        }
    },
    computed: {
        ...mapGetters('files', ['nextFile', 'prevFile', 'currentFile']),
        ...mapGetters('selections', ['loadingSelections', 'selectionsTree', 'currentSelection']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
    },
    methods: {
        ...mapMutations('files', ['setCurrentFile']),
        ...mapActions('selections', ['fetchSelections']),
        ...mapMutations('selections', ['setCurrentSelection']),
        async fetchData() {
            this.loadingData = true
            await this.fetchSelections({fileId: this.currentFile.id})
            this.loadingData = false
        },
        showSelectionUsersFlyin(selection) {
            this.setCurrentSelection(selection)
            this.SelectionUsersFlyinVisible = true
        },
        showNext() {
            if (this.nextFile)
                this.setCurrentFile(this.nextFile)
        },
        showPrev() {
            if (this.prevFile)
                this.setCurrentFile(this.prevFile)
        },
        goToEditSingle() {
            this.$router.push({ name: 'editFile', params: { fileId: this.file.id } })
        },
    },
    created() {
        if (this.currentFile) {
            this.fetchData()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

</style>