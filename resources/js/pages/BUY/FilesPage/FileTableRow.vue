<template>
    <BaseTableInnerRow class="file">
        <td v-if="fileToEdit && fileToEdit.id == file.id" class="title">
            <i v-if="!file.id" class="far fa-file"></i>
            <i v-else class="fas fa-file"></i>
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
            :group="{ name: 'files', pull: 'clone', put: false }"
            @start="$emit('drag-start', file)"
            @end="$emit('drag-end')"
        >
            <td class="title clickable" @click.exact="!dragActive && onShowSingleFile(file)">
                <i v-if="!file.id" class="far fa-file"></i>
                <i v-else class="fas fa-file"></i>
                <span>{{ file.name }}</span>
            </td>
        </Draggable>
        <td class="action">
            <button class="no-bg ghost-hover primary pill sm" @click="onShowSingleFile(file)">
                <span>View file</span>
            </button>
        </td>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import Draggable from 'vuedraggable'
export default {
    name: 'fileTableRow',
    components: {
        Draggable,
    },
    props: ['file', 'fileToEdit', 'dragActive'],
    methods: {
        ...mapActions('files', ['insertOrUpdateFile']),
        ...mapMutations('files', ['REMOVE_UNSAVED_FILES']),
        onCancelEdit() {
            this.REMOVE_UNSAVED_FILES()
            this.$emit('update:fileToEdit', {})
        },
        onShowSingleFile() {
            this.$emit('show-single-file', this.file)
        },
        onSubmitEdit() {
            // this.REMOVE_UNSAVED_FILES()
            this.insertOrUpdateFile({ file: this.fileToEdit, addToState: false })
            this.$emit('update:fileToEdit', {})
        },
    },
}
</script>

<style></style>
