<template>
    <div class="custom-product-fields">
        <h3>Custom product properties</h3>
        <i
            >Here you can define custom properties you would like to have available on your products.<br />
            The custom propeties can be used to filter by, and can be included in CSV-exports.</i
        >
        <div class="form-element custom-properties">
            <button class="ghost primary form-element" @click="onAddProperty">
                <i class="far fa-plus"></i><span>Add property</span>
            </button>
            <div class="custom-property-list flex-list flex-v form-element">
                <CustomPropertyListItem
                    v-for="(property, index) in workspace.custom_product_fields"
                    :property="property"
                    :key="index"
                    @update="onUpdateWorkspaceDetails"
                    @delete="onDeleteProperty(index)"
                />
            </div>
            <button
                class="ghost primary form-element"
                @click="onAddProperty"
                v-if="workspace.custom_product_fields.length > 0"
            >
                <i class="far fa-plus"></i><span>Add property</span>
            </button>
        </div>
        <button class="primary full-width lg" @click="onUpdateWorkspaceDetails"><span>Save Properties</span></button>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CustomPropertyListItem from './CustomPropertyListItem'
export default {
    name: 'customProductFieldsForm',
    components: {
        CustomPropertyListItem,
    },
    computed: {
        ...mapGetters('workspaces', {
            workspace: 'currentWorkspace',
        }),
    },
    methods: {
        ...mapActions('workspaces', ['updateWorkspaceDetails']),
        async onUpdateWorkspaceDetails() {
            await this.updateWorkspaceDetails(this.workspace)
        },
        onDeleteProperty(index) {
            this.workspace.custom_product_fields.splice(index, 1)
            this.onUpdateWorkspaceDetails()
        },
        onAddProperty(index) {
            this.workspace.custom_product_fields.push({
                name: 'new_property',
                display_name: 'New property',
                belong_to: 'Product',
                type: 'String',
            })
        },
    },
}
</script>

<style scoped lang="scss"></style>
