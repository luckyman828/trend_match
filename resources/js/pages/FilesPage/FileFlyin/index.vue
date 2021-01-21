<template>
    <BaseFlyin
        ref="fileSingleFlyin"
        :show="show"
        :disableKeyHandler="SelectionUsersFlyinVisible"
        @close="$emit('close')"
    >
        <template v-slot:header v-if="file && show">
            <BaseFlyinHeader
                :next="nextFile"
                :prev="prevFile"
                :disableNavigation="SelectionUsersFlyinVisible"
                @close="$emit('close')"
                @next="showNext"
                @prev="showPrev"
            >
                <template v-slot:left>
                    <h3>File Overview: {{ file.name }}</h3>
                </template>
                <template v-slot:right>
                    <div class="item-group">
                        <BaseButton
                            buttonClass="ghost"
                            :disabled="authUserWorkspaceRole != 'Admin'"
                            disabledTooltip="Only admins can manage file editors"
                            @click="showEditorsFlyin"
                        >
                            <i class="far fa-user-cog"></i>
                            <span>Manage editors</span>
                        </BaseButton>

                        <BaseButton
                            buttonClass="ghost"
                            :disabled="authUserWorkspaceRole != 'Admin' && !file.editable"
                            disabledTooltip="Only admins and editors can edit files"
                            @click="goToEditSingle"
                        >
                            <i class="far fa-tshirt">
                                <i class="fas fa-pen pos-right pos-bottom"></i>
                            </i>
                            <span>Edit products</span>
                        </BaseButton>

                        <v-popover trigger="click">
                            <BaseButton buttonClass="ghost">
                                <i class="far fa-ellipsis-v"></i>
                            </BaseButton>
                            <BaseContextMenu slot="popover" :inline="true">
                                <div class="item-group">
                                    <BaseContextMenuItem
                                        iconClass="far fa-video"
                                        hotkey="KeyV"
                                        :disabled="authUserWorkspaceRole != 'Admin'"
                                        disabledTooltip="Only admins can manage video presentations"
                                        @click="
                                            $router.push({ name: 'editVideoPresentation', params: { fileId: file.id } })
                                        "
                                    >
                                        <span>Go to <u>V</u>ideo Presentation</span>
                                    </BaseContextMenuItem>
                                </div>
                                <div class="item-group">
                                    <BaseContextMenuItem
                                        iconClass="far fa-chart-bar"
                                        hotkey="KeyL"
                                        @click="
                                            $router.push({ name: 'liveResults', params: { fileId: currentFile.id } })
                                        "
                                    >
                                        <span>Go to <u>L</u>ive Results</span>
                                    </BaseContextMenuItem>
                                </div>
                            </BaseContextMenu>
                        </v-popover>
                    </div>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-if="file && show" v-slot>
            <div class="file-single">
                <SelectionsTable @showSelectionUsersFlyin="showSelectionUsersFlyin" />

                <SelectionUsersFlyin
                    :selection="currentSelection"
                    :show="SelectionUsersFlyinVisible"
                    @close="SelectionUsersFlyinVisible = false"
                />
            </div>

            <FileEditorsFlyin
                v-if="show"
                :show="showFileEditorsFlyin"
                @close="showFileEditorsFlyin = false"
                :file="file"
            />
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import SelectionsTable from './SelectionsTable'
import FileEditorsFlyin from './FileEditorsFlyin'
import SelectionUsersFlyin from '../../../components/SelectionUsersFlyin'

export default {
    name: 'fileFlyin',
    props: ['file', 'show'],
    components: {
        SelectionsTable,
        SelectionUsersFlyin,
        FileEditorsFlyin,
    },
    data: function() {
        return {
            showFileEditorsFlyin: false,
        }
    },
    // watch: {
    //     currentFile(newVal) {
    //         console.log('new file', newVal)
    //     }
    // },
    computed: {
        ...mapGetters('files', ['nextFile', 'prevFile', 'currentFile']),
        ...mapGetters('selections', [
            'selectionsStatus',
            'currentSelection',
            'getSelectionUsersFlyinIsVisible',
            'getSelections',
        ]),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        SelectionUsersFlyinVisible: {
            get() {
                return this.getSelectionUsersFlyinIsVisible
            },
            set(value) {
                this.SET_SELECTION_USERS_FLYIN_VISIBLE(value)
            },
        },
    },
    methods: {
        ...mapActions('selections', ['updateSelection']),
        ...mapMutations('files', ['SET_CURRENT_FILE']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS', 'SET_SELECTION_USERS_FLYIN_VISIBLE']),
        showSelectionUsersFlyin(selection) {
            this.SET_CURRENT_SELECTIONS([selection])
            this.SelectionUsersFlyinVisible = true
        },
        showEditorsFlyin() {
            this.showFileEditorsFlyin = true
        },
        showNext() {
            if (this.nextFile) this.SET_CURRENT_FILE(this.nextFile)
        },
        showPrev() {
            if (this.prevFile) this.SET_CURRENT_FILE(this.prevFile)
        },
        goToEditSingle() {
            this.$router.push({ name: 'editFile', params: { fileId: this.file.id } })
        },
        onToggleAllSelectionsLocked(selections) {
            let makeLocked = null
            selections.map(selection => {
                if (selection.is_presenting) return
                let hasChange = false
                if (makeLocked == null) makeLocked = selection.is_open
                // Check if the selection is locked
                if (makeLocked && !selection.is_open) return
                if (!makeLocked && selection.is_open) return

                if (makeLocked) {
                    selection.open_from = new Date('9999')
                    selection.open_to = null
                    hasChange = true
                } else {
                    selection.open_from = null
                    selection.open_to = null
                    hasChange = true
                }
                if (hasChange) this.updateSelection(selection)
            })
        },
        onToggleAllSelectionsVisibility(selections) {
            // Use the first selection to determine if we are opening or closing all
            let makeHidden = null
            selections.map(selection => {
                if (selection.is_presenting) return
                if (makeHidden == null) makeHidden = selection.is_visible
                let hasChange = false

                if (makeHidden && !selection.is_visible) return
                if (!makeHidden && selection.is_visible) return
                // Check if the selection is visible
                if (makeHidden) {
                    // Set To to now
                    selection.visible_from = new Date('9999')
                    selection.visible_to = null
                    hasChange = true
                } else {
                    selection.visible_from = null
                    selection.visible_to = null
                    hasChange = true
                }
                if (hasChange) this.updateSelection(selection)
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
</style>
