<template>
    <div class="custom-property-list-item flex-list sm">
        <div class="list-item">
            <label>Display name</label>
            <BaseEditInputWrapper
                v-model="property.display_name"
                :oldValue="property.display_name"
                @submit="$emit('update')"
            />
        </div>
        <div class="list-item">
            <label>Type</label>
            <BaseDropdownInputField
                v-model="property.type"
                :oldValue="property.type"
                :options="['String', 'Array']"
                type="radio"
                @input="$emit('update')"
            />
        </div>
        <div class="list-item">
            <label>Belongs to</label>
            <BaseDropdownInputField
                v-model="property.belong_to"
                :oldValue="property.belong_to"
                :options="['Product', 'Variant']"
                type="radio"
                @input="$emit('update')"
            />
        </div>
        <button class="delete-button invisible ghost-hover" @click="$emit('delete')">
            <i class="far fa-trash"></i>
        </button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'customPropertyListItem',
    props: ['property'],
    computed: {
        ...mapGetters('workspaces', {
            workspace: 'currentWorkspace',
        }),
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.custom-property-list-item {
    .delete-button {
        margin-top: 26px;
    }
}
</style>
