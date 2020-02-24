<template>
    <BaseFlyin ref="fileSingleFlyin" :show="show" @close="$emit('close')">
        <template v-slot:header v-if="file && show">
            <BaseFlyinHeader :title="'File Overview: '+file.name" :next="nextFile" :prev="prevFile"
            @close="$emit('close')" @next="showNext" @prev="showPrev">
                <div class="item-group">
                    <button class="ghost editable" @click="$emit('showFileOwnersFlyin', file)">
                        <i class="far fa-user-shield"></i>
                        <span>{{file.owner_count || 0}} File owners</span>
                    </button>
                    <button class="ghost" @click="goToEditSingle"><span>View / Edit products</span></button>
                </div>
            </BaseFlyinHeader>
        </template>
        <template v-if="file && show" v-slot>
            <div class="file-single">
                <SelectionsTable :selections="currentFile.selections" @showSelectionUsersFlyin="showSelectionUsersFlyin($event)"/>

                <SelectionUsersFlyin :selection="currentSelection" :show="SelectionUsersFlyinVisible"
                @close="SelectionUsersFlyinVisible = false"/>
            </div>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
        currentSelection: null,
        SelectionUsersFlyinVisible: false,
    }},
    computed: {
        ...mapGetters('files', ['nextFile', 'prevFile', 'currentFile']),
    },
    methods: {
        ...mapActions('files', ['setCurrentFile']),
        showSelectionUsersFlyin(selection) {
            this.currentSelection = selection
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
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

</style>