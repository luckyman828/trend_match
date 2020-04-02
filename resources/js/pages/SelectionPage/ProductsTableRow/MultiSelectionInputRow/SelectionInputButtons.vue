<template>
    <div class="selection-input-buttons" v-if="selectionProduct">
        <span class="name">{{selection.name}}</span>
        <div class="selection-actions">
            <div class="selection-action">
                <button :class="selectionProduct[currentAction] != 'Focus' ? 'ghost': 'primary'"
                @click="onUpdateAction(selectionProduct, 'Focus', selection)">
                    <span>F</span>
                </button>
                <span></span>
            </div>
            <div class="selection-action">
                <button :class="selectionProduct[currentAction] != 'In' ? 'ghost': 'green'"
                @click="onUpdateAction(selectionProduct, 'In', selection)">
                    <span>I</span>
                </button>
            </div>
            <div class="selection-action">
                <button :class="selectionProduct[currentAction] != 'Out' ? 'ghost': 'red'"
                @click="onUpdateAction(selectionProduct, 'Out', selection)">
                    <span>O</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'selectionInputButtons',
    props: [
        'product',
        'selection',
        'currentAction',
    ],
    data: function() { return {
        selectionProduct: null,
    }},
    methods: {
        onUpdateAction(product, action, selection) {
            this.$emit('updateAction', product, action, selection)
        },
    },
    created() {
        this.selectionProduct = this.selection.products.find(x => x.id == this.product.id)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.selection-input-buttons {
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