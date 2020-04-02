<template>
    <div class="multi-selection-input-row flex-table-row">
        <SelectionInputButtons v-for="theSelection in currentSelections" :key="theSelection.id"
        :selection="theSelection" :product="product" :currentAction="currentAction"
        @updateAction="(product, action, selection) => $emit('updateAction', product, action, selection)"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SelectionInputButtons from './SelectionInputButtons'
export default {
    name: 'multiSelectionInputRow',
    props: [
        'product',
        'currentAction',
    ],
    components: {
        SelectionInputButtons
    },
    computed: {
        ...mapGetters('selections', ['getCurrentSelections']),
        currentSelections() {
            return this.getCurrentSelections
        },
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.multi-selection-input-row {
    height: 108px;
    padding: 8px;
    display: flex;
    align-items: center;
}
.selection-wrapper {
    margin-left: 20px;
    text-align: center;
    &:first-child {
        margin-left: 4px;
    }
    .selection-actions {
        display: flex;
        .selection-action {
            button {
                width: 32px;
                max-width: 32px;
                border-radius: 0;
            }
            &:first-child button {
                border-radius: 4px 0 0 4px;
            }
            &:last-child button {
                border-radius: 0 4px 4px 0;
            }

        }
    }
    
}

</style>