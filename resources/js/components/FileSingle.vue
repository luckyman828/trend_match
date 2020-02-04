<template>
    <FlyIn ref="fileSingleFlyin" :visibleOverwrite="show" @close="$emit('close')">
        <template v-slot:header v-if="file">
            <FlyinHeader :title="file.title" :next="nextFileId" :prev="prevFileId"
            @close="$emit('close')" @next="showNext" @prev="showPrev">
                <div class="item-group">
                    <button class="ghost editable" @click="$emit('showFileOwnersFlyin', file)">
                        <i class="far fa-user shield"></i>
                        <span>{{file.owners.length}} File owners</span>
                    </button>
                    <button class="ghost"><span>Edit products</span></button>
                </div>
            </FlyinHeader>
        </template>
        <template v-if="file" v-slot>
            <div class="file-single">
                <SubfilesTable :subfiles="file.subfiles" @showSelectionUsersFlyin="showSelectionUsersFlyin($event)"
                @showSelectionOwnersFlyin="showSelectionOwnersFlyin"/>

                <FlyIn ref="selectionUsersFlyin" :visibleOverwrite="SelectionUsersFlyinVisible">
                    <template v-slot:header>
                        <FlyinHeader v-if="SelectionUsersFlyinVisible" :title="currentSelection.name + ' Feedback Users'" disableNavigation=true 
                        @close="SelectionUsersFlyinVisible = false"/>
                    </template>
                    <template v-slot>
                        <SelectionUsersTable v-if="SelectionUsersFlyinVisible" :selection="currentSelection"/>
                    </template>
                </FlyIn>

                <FlyIn ref="selectionOwnersFlyin" :visibleOverwrite="SelectionOwnersFlyinVisible">
                    <template v-slot:header>
                        <FlyinHeader v-if="SelectionOwnersFlyinVisible" :title="currentSelection.name + ' Owners'" disableNavigation=true 
                        @close="SelectionOwnersFlyinVisible = false"/>
                    </template>
                    <template v-slot>
                        <SelectionOwnersTable v-if="SelectionOwnersFlyinVisible" :selection="currentSelection"/>
                    </template>
                </FlyIn>
            </div>
        </template>
    </FlyIn>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SubfilesTable from './SubfilesTable'
import SelectionUsersTable from './SelectionUsersTable'
import SelectionOwnersTable from './SelectionOwnersTable'

export default {
    name: 'fileSingle',
    props: [
        'file',
        'show'
    ],
    components: {
        SubfilesTable,
        SelectionUsersTable,
        SelectionOwnersTable,
    },
    data: function(){ return {
        currentSelection: null,
        SelectionOwnersFlyinVisible: false,
        SelectionUsersFlyinVisible: false,
    }},
    computed: {
        ...mapGetters('entities/collections', ['nextFileId', 'prevFileId']),
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
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

</style>