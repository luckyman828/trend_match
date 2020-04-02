<template>
    <div class="selection-input-group" v-if="selectionProduct" tabindex="0" ref="selectionInputGroup"
    @keyup="keypressHandler($event)">
        <span class="name">{{selection.name}}</span>
        <div class="selection-action-buttons">

            <div class="selection-action">
                <button :class="selectionProduct[currentAction] != 'Focus' ? 'ghost': 'primary'"
                @click="onUpdateAction(selectionProduct, 'Focus', selection)">
                    <span>F</span>
                </button>

                <v-popover class="focus" :disabled="product.focus.length <= 0 && product.alignmentFocus.length <= 0">
                    <span>{{selectionProduct.alignmentFocus.length +product.focus.length}}</span>
                    <template slot="popover">
                        <BaseTooltipList header="Focus Alignment" v-if="selectionProduct.alignmentFocus.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionProduct.alignmentFocus" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                        <BaseTooltipList header="Focus Feedback" v-if="selectionProduct.focus.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionProduct.focus" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                    </template>
                </v-popover>
            </div>

            <div class="selection-action">
                <button :class="selectionProduct[currentAction] != 'In' ? 'ghost': 'green'"
                @click="onUpdateAction(selectionProduct, 'In', selection)">
                    <span>I</span>
                </button>

                <v-popover class="ins" :disabled="selectionProduct.ins.length <= 0 && selectionProduct.alignmentIns.length <= 0">
                    <span>{{selectionProduct.alignmentIns.length + selectionProduct.ins.length}}</span>
                    <template slot="popover">
                        <BaseTooltipList header="Ins Alignment" v-if="selectionProduct.alignmentIns.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionProduct.alignmentIns" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                        <BaseTooltipList header="Ins Feedback" v-if="selectionProduct.ins.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionProduct.ins" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                    </template>
                </v-popover>
            </div>

            <div class="selection-action">
                <button :class="selectionProduct[currentAction] != 'Out' ? 'ghost': 'red'"
                @click="onUpdateAction(selectionProduct, 'Out', selection)">
                    <span>O</span>
                </button>
                
                <v-popover class="outs" :disabled="selectionProduct.outs.length <= 0 && selectionProduct.alignmentOuts.length <= 0">
                    <span>{{selectionProduct.alignmentOuts.length + selectionProduct.outs.length}}</span>
                    <template slot="popover">
                        <BaseTooltipList header="Outs Alignment" v-if="selectionProduct.alignmentOuts.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionProduct.alignmentOuts" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                        <BaseTooltipList header="Outs Feedback" v-if="selectionProduct.outs.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionProduct.outs" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                    </template>
                </v-popover>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'selectionInputGroup',
    props: [
        'index',
        'product',
        'selection',
        'currentAction',
        'focusGroupIndex',
    ],
    data: function() { return {
        selectionProduct: null,
    }},
    watch: {
        // Watch for changes to the current focus index 
        focusGroupIndex: function(newVal, oldVal) {
            if (newVal == this.index) {
                console.log('focus me')
                this.$refs.selectionInputGroup.focus()
            }
        }
    },
    methods: {
        onUpdateAction(product, action, selection) {
            this.$emit('updateAction', product, action, selection)
        },
        keypressHandler(event) {
            const key = event.code
            if (key == 'KeyI')
                this.onUpdateAction(this.selectionProduct, 'In', this.selection)
            if (key == 'KeyO')
                this.onUpdateAction(this.selectionProduct, 'Out', this.selection)
            if (key == 'KeyF' || key == 'KeyU')
                this.onUpdateAction(this.selectionProduct, 'Focus', this.selection)
        }
    },
    created() {
        this.selectionProduct = this.selection.products.find(x => x.id == this.product.id)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.selection-input-group {
    margin-left: 20px;
    text-align: center;
    &:first-child {
        margin-left: 4px;
    }
    .selection-action-buttons {
        display: flex;
        .selection-action {
            button {
                width: 32px;
                max-width: 32px;
                border-radius: 0;
                margin: 8px 0 4px;
            }
            &:first-child button {
                border-radius: 4px 0 0 4px;
            }
            &:last-child button {
                border-radius: 0 4px 4px 0;
            }
            .v-popover .trigger {
                cursor: pointer;
            }
        }
    }
}

</style>