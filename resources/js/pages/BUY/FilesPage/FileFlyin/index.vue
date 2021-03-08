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
                            :disabled="authUserWorkspaceRole != 'Admin' && !file.editable"
                            disabledTooltip="Only admins and editors can edit files"
                            @click="goToEditSingle"
                        >
                            <i class="far fa-tshirt">
                                <i class="fas fa-pen pos-right pos-bottom"></i>
                            </i>
                            <span>Edit products</span>
                        </BaseButton>
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
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import SelectionsTable from './SelectionsTable'
import SelectionUsersFlyin from '../../../../components/SelectionUsersFlyin'

export default {
    name: 'fileFlyin',
    props: ['file', 'show'],
    components: {
        SelectionsTable,
        SelectionUsersFlyin,
    },
    data: function() {
        return {}
    },
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
        showNext() {
            if (this.nextFile) this.SET_CURRENT_FILE(this.nextFile)
        },
        showPrev() {
            if (this.prevFile) this.SET_CURRENT_FILE(this.prevFile)
        },
        goToEditSingle() {
            this.$router.push({ name: 'buy.editFile', params: { fileId: this.file.id } })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
</style>
