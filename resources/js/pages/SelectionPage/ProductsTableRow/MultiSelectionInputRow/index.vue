<template>
    <div class="multi-selection-input-row flex-table-row">
        <SelectionInputGroup
            v-for="(selectionInput, index) in product.selectionInputList.filter(selectionInput =>
                getCurrentSelections.find(selection => selectionInput.selection_id == selection.id)
            )"
            :key="selectionInput.selection.id"
            :selection="selectionInput.selection"
            :product="product"
            :selectionInput="selectionInput"
            :index="index"
            :currentAction="currentAction"
            :focusGroupIndex="focusGroupIndex"
            :distributionTooltipRef="distributionTooltipRef"
            :distributionScope="distributionScope"
            @updateAction="onUpdateAction"
        />
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import SelectionInputGroup from './SelectionInputGroup'
export default {
    name: 'multiSelectionInputRow',
    props: ['product', 'currentAction', 'focusGroupIndex', 'distributionTooltipRef', 'distributionScope'],
    components: {
        SelectionInputGroup,
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', ['getCurrentSelections']),
    },
    methods: {
        ...mapMutations('actions', ['UPDATE_ACTIONS']),
        onUpdateAction(action, selectionInput) {
            // Update all actions
            // this.product.selectionInputList.forEach(selectionInput => {
            //     this.UPDATE_ACTIONS({
            //         product: selectionInput,
            //         action: selectionInput.action == action ? 'None' : action,
            //         selection,
            //         user: this.authUser,
            //         type: 'Alignment'
            //     })
            // })
            // console.log('on updaet action', product, action, selection)
            this.$emit('updateAction', action, selectionInput)
        },
    },
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
