<template>
    <div class="product-labels">
        <h3>Product labels</h3>
        <i>Define the labels available for your products</i>
        <div class="form-element">
            <button class="ghost primary form-element" @click="onAddLabel">
                <i class="far fa-plus"></i><span>Add label</span>
            </button>
            <Draggable class="label-list flex-list flex-v form-element" v-model="workspace.available_labels">
                <div
                    class="label-list-item flex-list"
                    v-for="(label, index) in workspace.available_labels"
                    :key="index"
                >
                    <div class="square no-bg dark delete-button">
                        <span>{{ index + 1 }}</span>
                    </div>
                    <BaseEditInputWrapper
                        ref="input"
                        v-model="workspace.available_labels[index]"
                        :oldValue="workspace.available_labels[index]"
                        @submit="onUpdateWorkspaceDetails"
                    />
                    <div class="square handle"><i class="far fa-grip-vertical"></i></div>
                    <button class="delete-button no-bg ghost-hover" @click="onDeleteLabel(index)">
                        <i class="far fa-trash"></i>
                    </button>
                </div>
            </Draggable>
            <button class="ghost primary form-element" @click="onAddLabel" v-if="workspace.available_labels.length > 0">
                <i class="far fa-plus"></i><span>Add label</span>
            </button>
        </div>
        <button class="primary full-width lg" @click="onUpdateWorkspaceDetails"><span>Save Labels</span></button>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
export default {
    name: 'productLablesForm',
    components: {
        Draggable,
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
        onDeleteLabel(index) {
            this.workspace.available_labels.splice(index, 1)
            this.onUpdateWorkspaceDetails()
        },
        onAddLabel() {
            this.workspace.available_labels.push('New label')
            this.$nextTick(() => {
                this.$refs.input[this.workspace.available_labels.length - 1].setActive()
            })
        },
    },
}
</script>

<style scoped lang="scss">
.label-list-item {
    padding: 4px;
    border-radius: 4px;
    &:hover {
        background: white;
    }
    > *:not(.edit-input-wrapper) {
        margin-top: 4px;
    }
    .handle {
        cursor: grab;
    }
}
</style>
