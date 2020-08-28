<template>
    <form @submit.prevent class="select-fields">

        <h3>Select fields to add/replace</h3>

        <template v-if="uploadOptions">
            <div class="form-section">
                <div class="form-element">
                    <BaseCheckboxInputField class="replace-all" 
                    :value="replaceAll"
                    @input="toggleAll">
                        <span>Replace all</span>
                    </BaseCheckboxInputField>
                </div>
            </div>

            <div class="form-section">
                <div class="form-element" v-for="(scope, index) in uploadOptions.scopes" :key="index">
                    <BaseCheckboxInputField v-model="scope.enabled">
                        <span>{{scope.displayName}}</span>
                    </BaseCheckboxInputField>
                </div>
            </div>

            <div class="form-section">
                <div class="col-2">
                    <BaseCheckboxInputField v-for="(field, index) in uploadOptions.fields" :key="index" 
                    v-model="field.enabled">
                        <span>{{field.displayName}}</span>
                    </BaseCheckboxInputField>
                </div>
            </div>


            <div class="form-controls">
                <BaseButton type="button" 
                    buttonClass="lg primary full-width"
                    style="width: 100%;"
                    :disabled="continueDisabled"
                    disabledTooltip="No fields selected"
                    @click="$emit('go-to-next-screen')"
                >
                    <span>Next: Map fields</span>
                </BaseButton>
            </div>
        </template>

        <BaseLoader v-else msg="Getting settings ready"/>

    </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'selectFieldsScreen',
    props: [
        'uploadOptions'
    ],
    computed: {
        replaceAll() {
            for (let i = 0; i < this.uploadOptions.fields.length; i++) {
                const field = this.uploadOptions.fields[i]
                if (!field.enabled) return false
            }
            for (let i = 0; i < this.uploadOptions.scopes.length; i++) {
                const scope = this.uploadOptions.scopes[i]
                if (!scope.enabled) return false
            }
            return true
        },
        continueDisabled() {
            for (let i = 0; i < this.uploadOptions.scopes.length; i++) {
                const scope = this.uploadOptions.scopes[i]
                if (scope.enabled) return false
            }
            for (let i = 0; i < this.uploadOptions.fields.length; i++) {
                const field = this.uploadOptions.fields[i]
                if (field.enabled) return false
            }
            return true
        }
    },
    methods: {
        ...mapActions('mapProductData', ['getUploadOptions']),
        toggleAll() {
            const newValue = !this.replaceAll
            this.uploadOptions.fields.map(field => {
                field.enabled = newValue
            })
            this.uploadOptions.scopes.map(scope => {
                scope.enabled = newValue
            })
        }
    },
    async created() {
        // Get default upload options
        if (!this.uploadOptions) {
            const options = await this.getUploadOptions(false)
            this.$emit('update:uploadOptions', options)
        }
    }
}
</script>

<style>

</style>