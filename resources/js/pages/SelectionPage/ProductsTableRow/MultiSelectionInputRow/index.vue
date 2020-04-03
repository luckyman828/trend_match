<template>
    <div class="multi-selection-input-row flex-table-row">
        <SelectionInputGroup v-for="(selectionInput, index) in product.selectionInputArray" :key="selectionInput.selection.id"
        :selection="selectionInput.selection" :product="selectionInput.product" :index="index"
        :currentAction="currentAction" :focusGroupIndex="focusGroupIndex"
        @updateAction="(product, action, selection) => onUpdateAction(product, action, selection)"/>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import SelectionInputGroup from './SelectionInputGroup'
export default {
    name: 'multiSelectionInputRow',
    props: [
        'product',
        'currentAction',
        'focusGroupIndex',
    ],
    components: {
        SelectionInputGroup
    },
    computed: {
        ...mapGetters('auth', ['authUser'])
    },
    methods: {
        ...mapMutations('actions', ['UPDATE_ACTIONS']),
        onUpdateAction(product, action, selection) {
            this.$emit('updateAction', product, action, selection)
            // Update all actions
            this.product.selectionInputArray.forEach(selectionProductPair => {
                this.UPDATE_ACTIONS({
                    product: selectionProductPair.product,
                    action,
                    selection,
                    user: this.authUser,
                    type: 'Alignment'
                })
            })
        }
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