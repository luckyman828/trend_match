<template>
    <BaseContextMenu ref="contextMenu" class="context-select-field">
        <template v-slot:header>
            Select field to map
        </template>
        <template v-slot="slotProps">
            <div class="item-group">
                <BaseSelectButtons v-if="availableFields"
                    v-model="fieldToMap.fieldName" 
                    :type="'radio'" 
                    :unsetOption="'Remove mapping'" 
                    :options="availableFields" 
                    :multipleOptionArrays="true" 
                    optionGroupNameKey="fileName" 
                    optionGroupOptionsKey="headers"
                    :submitOnChange="true" 
                    :search="true" 
                    :allowManualEntry="true"
                    @unset="onUnsetFieldMapping();slotProps.hide()"
                    @submit="($event, file) => {onSubmit($event, file);slotProps.hide()}"
                    @custom-entry="onCustomEntry"
                />
            </div>
        </template>
    </BaseContextMenu>
</template>

<script>
export default {
    name: 'selectFieldToMapContextMenu',
    props: [
        'fieldToMap',
        'availableFields',
    ],
    computed: {
    },
    methods: {
        show(e) {
            this.$refs.contextMenu.show(e)
        },
        onSubmit(fieldName, file) {
            this.fieldToMap.file = file
            this.fieldToMap.autoMatched = false
            this.fieldToMap.customEntry = false
        },
        onUnsetFieldMapping() {
            const field = this.fieldToMap
            field.enabled = true,
            field.error = false
            field.fieldName = null
            field.autoMatched = false
            field.file = null
            field.customEntry = false
        },
        onCustomEntry() {
            this.fieldToMap.customEntry = true
        }
    }
}
</script>

<style>

</style>