<template>
    <div class="variant-name-input">
        <button
            v-if="!editActive"
            class="display invisible ghost-hover full-width"
            @click="onActivateEdit"
            v-tooltip="`Color: <strong>${variant.color}</strong><br>Variant: <strong>${variant.variant}</strong>`"
        >
            <span class="name">{{ variant.name }}</span>
            <i class="far fa-pen"></i>
        </button>
        <div class="edit-wrapper flex-list flex-v" v-else>
            <BaseInputField
                ref="colorInput"
                v-model="tempVariantClone.color"
                label="Color"
                inputClass="sm"
                :focusOnMount="true"
                :selectOnFocus="true"
                @submit="$refs.variantInput.focus()"
                @cancel="onCancel"
            />
            <BaseInputField
                ref="variantInput"
                v-model="tempVariantClone.variant"
                label="Variant"
                inputClass="sm"
                :selectOnFocus="true"
                @submit="onSubmit"
                @cancel="onCancel"
            />
            <div class="flex-list button-list">
                <button class="ghost primary" @click="onCancel">
                    <span>Cancel</span>
                </button>
                <button class="primary" @click="onSubmit">
                    <span>Save</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'variantNameInput',
    props: ['variant'],
    data: function() {
        return {
            editActive: false,
            tempVariantClone: null,
        }
    },
    methods: {
        onActivateEdit() {
            this.tempVariantClone = JSON.parse(JSON.stringify(this.variant))
            this.editActive = true
        },
        onSubmit() {
            const variant = this.variant
            const clone = this.tempVariantClone
            variant.color = clone.color
            variant.variant = clone.variant

            // Calculate the new name
            const nameComponents = []
            if (clone.color) nameComponents.push(clone.color)
            if (clone.variant) nameComponents.push(clone.variant)
            const newName = nameComponents.join([' - '])
            variant.name = newName
            this.editActive = false
            this.$emit('submit')
        },
        onCancel() {
            this.editActive = false
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.display {
    justify-content: space-between;
    i {
        opacity: 0;
    }
    &:hover {
        i {
            opacity: 1;
        }
    }
    .name {
        max-width: calc(100% - 32px);
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
    }
}
.input-field {
    display: inline-block;
}
.button-list {
    > * {
        flex: 1;
    }
}
</style>
