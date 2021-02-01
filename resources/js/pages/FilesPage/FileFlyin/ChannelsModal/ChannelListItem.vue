<template>
    <div class="channel-list-item">
        <div style="margin-bottom: 4px">
            <label>Channel name</label>
            <h3>
                <BaseEditable ref="nameInput" v-model="channel.name" @submit="onUpdateChannel" />
            </h3>
        </div>
        <BaseTableV2
            class="channel-table form-element"
            :selectedItems.sync="selectedSelections"
            :items="channel.selections"
            :headers="[{ key: 'name', label: 'Name', sortable: false }]"
        >
            <template v-slot:header>
                <BaseTableHeader>Selection</BaseTableHeader>
                <BaseTableHeader class="center">Alignment</BaseTableHeader>
                <BaseTableHeader class="center">Feedback</BaseTableHeader>
                <BaseTableHeader class="center">Requests</BaseTableHeader>
                <BaseTableHeader class="center">Comments</BaseTableHeader>
                <BaseTableHeader></BaseTableHeader>
            </template>

            <SelectionListItem
                v-for="(selectionRules, index) in channel.selections"
                :key="selectionRules.selection_id"
                :selectionRules="selectionRules"
                :selectedSelections.sync="selectedSelections"
                :index="index"
                @remove="onRemoveSelection"
            />

            <template v-slot:empty>
                <p>No selections</p>
            </template>

            <template v-slot:footer>
                <td>
                    <BaseButton buttonClass="primary invisible" @click="showAddSelectionsContext">
                        <i class="far fa-plus"></i>
                        <span>Add selection(s)</span>
                    </BaseButton>
                </td>
            </template>
        </BaseTableV2>

        <BaseSelectButtonsContextMenu
            ref="contextMenuAddSelections"
            header="Add selections"
            v-model="selectionsToAdd"
            :options="
                availableSelections.map(x => {
                    x.chapterName = x.chapter && x.chapter.id != x.id ? x.chapter.name : ''
                    return x
                })
            "
            :submitDisabled="selectionsToAdd.length <= 0"
            :emitOnChange="true"
            optionNameKey="name"
            optionDescriptionKey="chapterName"
            :search="true"
            :submitText="`Add ${selectionsToAdd.length} user${selectionsToAdd.length > 1 ? 's' : ''}`"
            @submit="
                onAddSelections(selectionsToAdd)
                selectionsToAdd = []
            "
            @cancel="selectionsToAdd = []"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SelectionListItem from './SelectionListItem'
export default {
    name: 'channelListItem',
    components: { SelectionListItem },
    props: ['channel'],
    data: function() {
        return {
            selectedSelections: [],
            selectionsToAdd: [],
        }
    },
    computed: {
        ...mapGetters('files', {
            file: 'getCurrentFile',
        }),
        ...mapGetters('selections', {
            allSelections: 'getSelections',
        }),
        availableSelections() {
            return this.allSelections.filter(selection => {
                return !this.channel.selections.find(x => x.selection_id == selection.id)
            })
        },
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateBroadcastChannel']),
        showAddSelectionsContext(e) {
            let contextMenu = this.$refs.contextMenuAddSelections
            contextMenu.show(e)
        },
        onRemoveSelection(index) {
            this.channel.selections.splice(index, 1)
            this.onUpdateChannel()
        },
        onUpdateChannel() {
            this.insertOrUpdateBroadcastChannel({ file: this.file, broadcastChannel: this.channel, addToState: false })
        },
        onAddSelections(selections) {
            this.channel.selections.push(
                ...selections.map(selection => {
                    return {
                        selection_id: selection.id,
                        broadcast_alignment: false,
                        broadcast_feedback: false,
                        broadcast_request: false,
                        broadcast_comment: false,
                    }
                })
            )
            this.onUpdateChannel()
        },
    },
    mounted() {
        if (!this.channel.id) this.$refs.nameInput.activate()
    },
}
</script>

<style lang="scss">
@import '~@/_variables.scss';
h3 {
    margin: 0;
}

.channel-table {
}
</style>
