<template>
    <div class="file-single">
        <FlyinHeader :title="file.title" @closeFlyin="onClose" class="flyin-header">
            <div class="item-group">
                <button class="invisible underline">{{file.subfiles.length}} Subfiles</button>
                <button class="invisible underline">{{file.users.length}} Users</button>
            </div>
            <div class="item-group">
                <button class="ghost icon-left light-2"><i class="far fa-file-edit"></i>Edit</button>
                <button class="square true-square light-2 more" style="margin-left: 16px"><i class="far fa-ellipsis-h"></i></button>
            </div>
            <div class="item-group">
                <button class="circle primary prev" :disabled="!prevFileId" @click="showPrev"><i class="far fa-angle-left"></i></button>
                <button class="circle primary next" :disabled="!nextFileId" @click="showNext"><i class="far fa-angle-right"></i></button>
            </div>
        </FlyinHeader>
        <div class="body">
            <SubfilesTable :subfiles="file.subfiles" @showSelectionUsersFlyin="showSelectionUsersFlyin"
            @showSelectionOwnersFlyin="showSelectionOwnersFlyin"/>
        </div>

        <FlyIn ref="selectionUsersFlyin" v-slot="slotProps">
            <template v-if="currentSelection">
                <FlyinHeader :title="currentSelection.name + ' Feedback Users'" disableNavigation=true @closeFlyin="slotProps.toggle"/>
                <SelectionUsersTable :selection="currentSelection"/>
            </template>
        </FlyIn>

        <FlyIn ref="selectionOwnersFlyin" v-slot="slotProps">
            <template v-if="currentSelection">
                <FlyinHeader :title="currentSelection.name + ' Owners'" disableNavigation=true @closeFlyin="slotProps.toggle"/>
                <SelectionOwnersTable :selection="currentSelection"/>
            </template>
        </FlyIn>
        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SubfilesTable from './SubfilesTable'
import SelectionUsersTable from './SelectionUsersTable'
import SelectionOwnersTable from './SelectionOwnersTable'

export default {
    name: 'fileSingle',
    props: [
        'file'
    ],
    components: {
        SubfilesTable,
        SelectionUsersTable,
        SelectionOwnersTable,
    },
    data: function(){ return {
        currentSelection: null
    }},
    computed: {
        ...mapGetters('entities/collections', ['nextFileId', 'prevFileId']),
    },
    methods: {
        ...mapActions('persist', ['setCurrentFileId']),
        showSelectionUsersFlyin(selection) {
            const flyin = this.$refs.selectionUsersFlyin
            this.currentSelection = selection
            flyin.show()
        },
        showSelectionOwnersFlyin(selection) {
            const flyin = this.$refs.selectionOwnersFlyin
            this.currentSelection = selection
            flyin.show()
        },
        onClose() {
            this.$emit('closeFlyin')
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

    .file-single {
        height: 100%;
        background: $grey;
        .body {
            padding: 16px;
        }
    }
    .flyin-header {
        .item-group {
            display: flex;
            align-items: center;
            &:not(:first-child) {
                margin-left: 36px;
                > *:not(:first-child) {
                    margin-left: 8px;
                }
            }
        }
        button.more i, .circle i {
            font-size: 16px;
        }
    }
</style>