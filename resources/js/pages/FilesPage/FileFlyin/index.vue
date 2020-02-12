<template>
    <BaseFlyin ref="fileSingleFlyin" :show="show" @close="$emit('close')">
        <template v-slot:header v-if="file && show">
            <BaseFlyinHeader :title="'File Overview: '+file.title" :next="nextFileId" :prev="prevFileId"
            @close="$emit('close')" @next="showNext" @prev="showPrev">
                <div class="item-group">
                    <button class="ghost editable" @click="$emit('showFileOwnersFlyin', file)">
                        <i class="far fa-user-shield"></i>
                        <span>{{file.owners.length}} File owners</span>
                    </button>
                    <button class="ghost editable" @click="$emit('showFileApproversFlyin', file)">
                        <i class="far fa-user-cog"></i>
                        <span>{{file.approvers.length}} File approvers</span>
                    </button>
                    <button class="ghost" @click="goToEditSingle"><span>View / Edit products</span></button>
                </div>
            </BaseFlyinHeader>
        </template>
        <template v-if="file && show" v-slot>
            <div class="file-single">
                <SelectionsTable :selections="currentFile.selections" @showSelectionUsersFlyin="showSelectionUsersFlyin($event)"
                @showSelectionOwnersFlyin="showSelectionOwnersFlyin"/>

                <SelectionUsersFlyin :selection="currentSelection" :show="SelectionUsersFlyinVisible"
                @close="SelectionUsersFlyinVisible = false"/>

                <SelectionOwnersFlyin :selection="currentSelection" :show="SelectionOwnersFlyinVisible"
                @close="SelectionOwnersFlyinVisible = false"/>
            </div>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectionsTable from './SelectionsTable'
import SelectionOwnersFlyin from '../../../components/SelectionOwnersFlyin'
import SelectionUsersFlyin from '../../../components/SelectionUsersFlyin'

export default {
    name: 'fileFlyin',
    props: [
        'file',
        'show'
    ],
    components: {
        SelectionsTable,
        SelectionOwnersFlyin,
        SelectionUsersFlyin,
    },
    data: function(){ return {
        currentSelection: null,
        SelectionOwnersFlyinVisible: false,
        SelectionUsersFlyinVisible: false,
    }},
    computed: {
        ...mapGetters('entities/collections', ['nextFileId', 'prevFileId', 'currentFile']),
    },
    methods: {
        ...mapActions('persist', ['setCurrentFileId']),
        showSelectionUsersFlyin(selection) {
            this.currentSelection = selection
            this.SelectionUsersFlyinVisible = true
        },
        showSelectionOwnersFlyin(selection) {
            this.currentSelection = selection
            this.SelectionOwnersFlyinVisible = true
        },
        showNext() {
            if (this.nextFileId)
                this.setCurrentFileId(this.nextFileId)
        },
        showPrev() {
            if (this.prevFileId)
                this.setCurrentFileId(this.prevFileId)
        },
        goToEditSingle() {
            this.$router.push({ name: 'editFile', params: { fileId: this.file.id } })
        },
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

</style>