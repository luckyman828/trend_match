<template>
    <BaseTableInnerRow class="folder">
        <td v-if="fileToEdit && fileToEdit.id == folder.id" class="title">
            <i v-if="folder.id" class="fas fa-folder"></i>
            <i v-else class="far fa-folder"></i>
            <BaseInputField
                inputClass="small"
                :focusOnMount="true"
                :selectOnFocus="true"
                :type="'text'"
                :actionOnBlur="fileToEdit.id ? 'Submit' : 'Cancel'"
                v-model="fileToEdit.name"
                @submit="onSubmitEdit"
                @cancel="onCancelEdit"
            />
        </td>

        <Draggable
            v-else
            :forceFallback="true"
            fallbackClass="sortable-drag"
            :fallbackTolerance="10"
            :group="{ name: 'folders', pull: 'clone', put: false }"
            @start="$emit('drag-start', folder)"
            @end="$emit('drag-end')"
        >
            <td class="title clickable" @click.exact="dragActive != true && setCurrentFolder(folder)">
                <i v-if="!folder.id" class="far fa-folder"></i>
                <i
                    v-else
                    class="fas"
                    :class="
                        dragActive == true && dragHoverId == folder.id && filesToMove[0].id != folder.id
                            ? 'fa-folder-open'
                            : 'fa-folder'
                    "
                ></i>
                <span>{{ folder.name }}</span>
            </td>
        </Draggable>
        <td class="action">
            <button class="no-bg ghost-hover primary pill sm" @click="setCurrentFolder(folder)">
                <span>Open folder</span>
            </button>
        </td>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import Draggable from 'vuedraggable'
export default {
    name: 'baseTableInnerRow',
    components: {
        Draggable,
    },
    props: ['folder', 'fileToEdit', 'dragActive', 'dragHoverId'],
    methods: {
        ...mapActions('files', ['insertOrUpdateFile', 'removeUnsavedFiles', 'setCurrentFolder']),
        ...mapMutations('files', ['REMOVE_UNSAVED_FILES']),
        onCancelEdit() {
            this.REMOVE_UNSAVED_FILES()
            this.$emit('update:fileToEdit', {})
        },
        async onSubmitEdit() {
            this.REMOVE_UNSAVED_FILES()
            this.insertOrUpdateFile({ file: this.fileToEdit, addToState: !this.folder.id ? true : false })
            this.$emit('update:fileToEdit', {})
        },
    },
}
</script>

<style></style>
