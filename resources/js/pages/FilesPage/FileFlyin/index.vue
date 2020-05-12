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
                        disabledTooltip="Only admins can hide/unhide selections"
                        @click="onToggleAllSelectionsLocked">
                        <i class="far fa-lock"></i>
                            <span>Lock/Undlock all selections</span>
                        </BaseButton>
                        
                        <BaseButton buttonClass="ghost" :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can lock/unlock selections"
                        @click="onToggleAllSelectionsVisibility">
                            <i class="far fa-eye"></i>
                            <span>Hide/Show all selections</span>
                        </BaseButton>

                        <BaseButton buttonClass="ghost" :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can edit files"
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
        ...mapGetters('selections', ['loadingSelections', 'selectionsTree', 'currentSelection', 'getSelections']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
    },
    methods: {
        ...mapMutations('files', ['setCurrentFile']),
        ...mapActions('selections', ['fetchSelections', 'updateSelection']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        async fetchData() {
            this.loadingData = true
            await this.fetchSelections({fileId: this.currentFile.id})
            this.loadingData = false
        },
        showSelectionUsersFlyin(selection) {
            this.SET_CURRENT_SELECTIONS([selection])
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
        onToggleAllSelectionsLocked() {
            const selections = this.getSelections
            const makeLocked = selections[0].is_open 
            selections.map(selection => {
                // Check if the selection is locked
                if (makeLocked) {
                    selection.open_from = new Date("9999")
                    // Set To to now
                    selection.open_to = null
                } else {
                    selection.open_from = null
                    selection.open_to = null
                }
                this.updateSelection(selection)
            })
        },
        onToggleAllSelectionsVisibility() {
            // Use the first selection to determine if we are opening or closing all
            const selections = this.getSelections
            const makeHidden = selections[0].is_visible 
            selections.map(selection => {
                // Check if the selection is visible
                if (makeHidden) {
                    // Set To to now
                    selection.visible_from = new Date("9999")
                    selection.visible_to = null
                } else {
                    selection.visible_from = null
                    selection.visible_to = null
                }
                this.updateSelection(selection)
            })
        }
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