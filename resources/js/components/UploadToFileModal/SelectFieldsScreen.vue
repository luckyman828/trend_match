<template>
    <form @submit.prevent class="select-fields">

        <h3>Select fields to replace</h3>

        <div class="form-element">
            <BaseCheckboxInputField class="replace-all" 
            :value="!fields.find(x => !x.enabled) && replacePrices"
            @input="toggleAll">
                <span>Replace all</span>
            </BaseCheckboxInputField>
        </div>

        <div class="form-element">
            <div class="col-2">
                <BaseCheckboxInputField v-for="(field, index) in fields" :key="index" 
                v-model="field.enabled">
                    <span>{{field.displayName}}</span>
                </BaseCheckboxInputField>
            </div>
        </div>

        <div class="form-element">
            <BaseCheckboxInputField class="replace-all" 
            :value="replaceAssortments" @input="$emit('update:replaceAssortments', $event)">
                <span>Replace assortments</span>
            </BaseCheckboxInputField>
        </div>

        <div class="form-element">
            <BaseCheckboxInputField class="replace-all" 
            :value="replacePrices" @input="$emit('update:replacePrices', $event)">
                <span>Replace prices</span>
            </BaseCheckboxInputField>
        </div>

        <div class="form-controls">
            <button type="button" class="lg primary full-width"
            @click="$emit('goToNextScreen')">
                <span>Next: Map fields</span>
            </button>
        </div>
    </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'selectFieldsScreen',
    props: [
        'fields',
        'replacePrices',
        'replaceAssortments',
    ],
    data: function () { return {
    }},
    computed: {
        
    },
    methods: {
        toggleAll(boolean) {
            this.fields.map(x => x.enabled = boolean)
            this.$emit('update:replacePrices', boolean)
            this.$emit('update:replaceAssortments', boolean)
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .select-fields {
        .form-controls {
            margin-top: 32px;
        }
    }

</style>