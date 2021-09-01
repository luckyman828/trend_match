<template>
    <BaseModal :show="show" @close="$emit('close')" classes="sm">
        <div class="form-wrapper">
            <h3>Create new workspace</h3>
            <div class="form-element">
                <label>Workspace name</label>
                <BaseInputField
                    v-model="workspaceName"
                    placeholder="New workspace name. Finish with ENTER"
                    :focusOnMount="true"
                    :selectOnFocus="true"
                    @submit="onSubmit"
                >
                    <button class="circle primary" @click="onSubmit">
                        <i class="far fa-arrow-right"></i>
                    </button>
                </BaseInputField>
            </div>
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'newWorkspaceModal',
    props: ['show'],
    data: function() {
        return {
            workspaceName: '',
        }
    },
    methods: {
        ...mapActions('workspaces', ['insertWorkspace']),
        async onSubmit() {
            const newWorkspace = await this.onNewWorkspace()
            this.$emit('close')
        },
        async onNewWorkspace() {
            // Create a new organization as a wrapper for the workspace first
            const newOrganization = {
                title: this.workspaceName.length > 0 ? this.workspaceName : 'New organization',
            }
            await this.$store.dispatch('organizations/insertOrganization', newOrganization)

            // Create the workspace
            const newWorkspace = {
                title: this.workspaceName.length > 0 ? this.workspaceName : 'New workspace',
                organization_id: newOrganization.id,
            }
            await this.insertWorkspace(newWorkspace)
            this.workspaceName = ''
        },
    },
}
</script>

<style></style>
