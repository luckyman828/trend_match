<template>
    <div class="file-single">
        <SubfilesTable :subfiles="file.subfiles" @showSelectionUsersFlyin="showSelectionUsersFlyin"
        @showSelectionOwnersFlyin="showSelectionOwnersFlyin"/>

        <FlyIn ref="selectionUsersFlyin">
            <template v-if="currentSelection" v-slot:header="slotProps">
                <FlyinHeader :title="currentSelection.name + ' Feedback Users'" disableNavigation=true @closeFlyin="slotProps.toggle"/>
            </template>
            <template v-if="currentSelection" v-slot>
                <SelectionUsersTable :selection="currentSelection"/>
            </template>
        </FlyIn>

        <FlyIn ref="selectionOwnersFlyin">
            <template v-if="currentSelection" v-slot:header="slotProps">
                <FlyinHeader :title="currentSelection.name + ' Owners'" disableNavigation=true @closeFlyin="slotProps.toggle"/>
            </template>
            <template v-if="currentSelection" v-slot>
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
    },
    methods: {
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
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

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