<template>
    <BaseTableInnerRow class="file">
        <td v-if="fileToEdit && fileToEdit.id == file.id" class="title">
            <i v-if="!file.id" class="far fa-file"></i>
            <i v-else class="fas fa-file"></i>
            <BaseInputField inputClass="small"
                :focusOnMount="true" :selectOnFocus="true" :type="'text'"
                actionOnBlur="Cancel"
                v-model="fileToEdit.name"
                @submit="insertOrUpdateFile(fileToEdit)"
                @cancel="onCancelEdit"/>
        </td>
        <Draggable v-else :forceFallback="true" fallbackClass="sortable-drag" :fallbackTolerance="10"
        :group="{ name: 'files', pull: 'clone', put: false }"
        @start="$emit('drag-start', file)" @end="$emit('drag-end')">
            <td class="title clickable" @click.exact="!dragActive && onShowSingleFile(file)">
                <i v-if="!file.id" class="far fa-file"></i>
                <i v-else class="fas fa-file"></i>
                <span>{{file.name}}</span>
            </td>
        </Draggable>
        <td class="action">
            <button class="invisible ghost-hover primary" 
            @click="onShowSingleFile(file)">
                <span>View file</span>
            </button>
        </td>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions } from 'vuex'
import Draggable from 'vuedraggable'
export default {
    name: 'fileTableRow',
    components: {
        Draggable
    },
    props: [
        'file',
        'fileToEdit',
        'dragActive',
    ],
    methods: {
        ...mapActions('files', ['insertOrUpdateFile']),
        onCancelEdit() {
            this.$emit('update:fileToEdit', {})
        },
        onShowSingleFile() {
            this.$emit('show-single-file', this.file)
        }
    }
}
</script>

<style>

</style>