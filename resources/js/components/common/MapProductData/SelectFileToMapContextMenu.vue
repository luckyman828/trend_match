<template>
    <BaseContextMenu ref="contextMenu" class="context-select-field">
        <template v-slot:header>
            Select field to map
        </template>
        <template v-slot="slotProps">
            <div class="item-group">
                <BaseSelectButtons v-if="availableFiles"
                    v-model="fileToMap.file" 
                    :type="'radio'" 
                    :options="availableFiles"
                    optionNameKey="fileName"
                    :submitOnChange="true" 
                    :search="true" 
                    @submit="($event, file) => {onSubmit($event, file);slotProps.hide()}"
                />
            </div>
        </template>
    </BaseContextMenu>
</template>

<script>
export default {
    name: 'selectFileToMapContextMenu',
    props: [
        'fileToMap',
        'availableFiles',
    ],
    computed: {
    },
    methods: {
        show(e) {
            this.$refs.contextMenu.show(e)
        },
        onSubmit(fieldName, file) {
            
        },
    }
}
</script>

<style>

</style>