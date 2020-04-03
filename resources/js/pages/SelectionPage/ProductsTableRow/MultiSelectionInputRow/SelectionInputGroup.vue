<template>
    <div class="selection-input-group" v-if="product" tabindex="0" ref="selectionInputGroup"
    @keyup="keypressHandler($event)">
        <span class="name">{{selection.name}}</span>
        <div class="selection-action-buttons">

            <div class="selection-action">
                <button :class="product[currentAction] != 'Focus' ? 'ghost': 'primary'"
                @click="onUpdateAction(product, 'Focus', selection)">
                    <span>F</span>
                </button>

                <v-popover class="focus" :disabled="product.focus.length <= 0 && product.alignmentFocus.length <= 0">
                    <span>{{product.alignmentFocus.length +product.focus.length}}</span>
                    <template slot="popover">
                        <BaseTooltipList header="Focus Alignment" v-if="product.alignmentFocus.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in product.alignmentFocus" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                        <BaseTooltipList header="Focus Feedback" v-if="product.focus.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in product.focus" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                    </template>
                </v-popover>
            </div>

            <div class="selection-action">
                <button :class="product[currentAction] != 'In' ? 'ghost': 'green'"
                @click="onUpdateAction(product, 'In', selection)">
                    <span>I</span>
                </button>

                <v-popover class="ins" :disabled="product.ins.length <= 0 && product.alignmentIns.length <= 0">
                    <span>{{product.alignmentIns.length + product.ins.length}}</span>
                    <template slot="popover">
                        <BaseTooltipList header="Ins Alignment" v-if="product.alignmentIns.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in product.alignmentIns" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                        <BaseTooltipList header="Ins Feedback" v-if="product.ins.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in product.ins" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                    </template>
                </v-popover>
            </div>

            <div class="selection-action">
                <button :class="product[currentAction] != 'Out' ? 'ghost': 'red'"
                @click="onUpdateAction(product, 'Out', selection)">
                    <span>O</span>
                </button>
                
                <v-popover class="outs" :disabled="product.outs.length <= 0 && product.alignmentOuts.length <= 0">
                    <span>{{product.alignmentOuts.length + product.outs.length}}</span>
                    <template slot="popover">
                        <BaseTooltipList header="Outs Alignment" v-if="product.alignmentOuts.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in product.alignmentOuts" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                        <BaseTooltipList header="Outs Feedback" v-if="product.outs.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in product.outs" :key="index"
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
                this.onUpdateAction(this.product, 'In', this.selection)
            if (key == 'KeyO')
                this.onUpdateAction(this.product, 'Out', this.selection)
            if (key == 'KeyF' || key == 'KeyU')
                this.onUpdateAction(this.product, 'Focus', this.selection)
        }
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