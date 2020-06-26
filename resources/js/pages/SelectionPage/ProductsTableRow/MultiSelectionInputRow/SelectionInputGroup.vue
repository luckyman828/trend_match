<template>
    <div class="selection-input-group" v-if="selectionInput" tabindex="0" ref="selectionInputGroup"
    @keyup="keypressHandler($event)">
        <span class="name"
        @click="onViewSingle">
            {{selection.name}}
        </span>
        <div class="selection-action-buttons">

            <div class="selection-action">
                <BaseButton :buttonClass="selectionInput[currentAction] != 'Focus' ? 'ghost': 'primary'"
                :disabled="!userWriteAccess.actions.hasAccess" 
                v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                @click="onUpdateAction('Focus', selectionInput)">
                    <!-- <span>F</span> -->
                    <i class="far fa-star"></i>
                </BaseButton>

                <v-popover class="focus" :disabled="selectionInput.focus.length <= 0 && selectionInput.alignmentFocus.length <= 0">
                    <span>{{selectionInput.alignmentFocus.length +selectionInput.focus.length}}</span>
                    <template slot="popover">
                        <BaseTooltipList header="Focus Alignment" v-if="selectionInput.alignmentFocus.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionInput.alignmentFocus" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                        <BaseTooltipList header="Focus Feedback" v-if="selectionInput.focus.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionInput.focus" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                    </template>
                </v-popover>
            </div>

            <div class="selection-action">
                <BaseButton :buttonClass="selectionInput[currentAction] != 'In' ? 'ghost': 'green'" 
                :disabled="!userWriteAccess.actions.hasAccess" 
                v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                @click="onUpdateAction('In', selectionInput)">
                    <!-- <span>I</span> -->
                    <i class="far fa-heart"></i>
                </BaseButton>

                <v-popover class="ins" :disabled="selectionInput.ins.length <= 0 && selectionInput.alignmentIns.length <= 0">
                    <span>{{selectionInput.alignmentIns.length + selectionInput.ins.length}}</span>
                    <template slot="popover">
                        <BaseTooltipList header="Ins Alignment" v-if="selectionInput.alignmentIns.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionInput.alignmentIns" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                        <BaseTooltipList header="Ins Feedback" v-if="selectionInput.ins.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionInput.ins" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                    </template>
                </v-popover>
            </div>

            <div class="selection-action">
                <BaseButton :buttonClass="selectionInput[currentAction] != 'Out' ? 'ghost': 'red'" 
                :disabled="!userWriteAccess.actions.hasAccess" 
                v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                @click="onUpdateAction('Out', selectionInput)">
                    <!-- <span>O</span> -->
                    <i class="far fa-times-circle"></i>
                </BaseButton>
                
                <v-popover class="outs" :disabled="selectionInput.outs.length <= 0 && selectionInput.alignmentOuts.length <= 0">
                    <span>{{selectionInput.alignmentOuts.length + selectionInput.outs.length}}</span>
                    <template slot="popover">
                        <BaseTooltipList header="Outs Alignment" v-if="selectionInput.alignmentOuts.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionInput.alignmentOuts" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                        <BaseTooltipList header="Outs Feedback" v-if="selectionInput.outs.length > 0">
                            <BaseTooltipListItem v-for="(action, index) in selectionInput.outs" :key="index"
                            :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                        </BaseTooltipList>
                    </template>
                </v-popover>
            </div>

        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'selectionInputGroup',
    props: [
        'index',
        'product',
        'selectionInput',
        'selection',
        'currentAction',
        'focusGroupIndex',
    ],
    watch: {
        // Watch for changes to the current focus index 
        focusGroupIndex: function(newVal, oldVal) {
            if (newVal == this.index) {
                this.$refs.selectionInputGroup.focus()
            }
        }
    },
    computed: {
        ...mapGetters('selections', ['getAuthUserSelectionWriteAccess']),
        userWriteAccess () {
            return this.getAuthUserSelectionWriteAccess(this.selection)
        },
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP']),
        async onViewSingle() {
            this.showSelectionProductPDP({product: this.product, selection: this.selection})
            // Find the newly added selections that we haven't already fethed input for
            const newSelections = selections.filter(selection => !this.getProductSelectionInputList.find(x => x.selection.id == selection.id))
            // Fetch data for all the selections
            if (newSelections.length > 0) {
                await Promise.all(newSelections.map(async selection => {
                    await this.fetchSelectionProducts(selection)
                    await this.fetchSelectionSettings(selection)
                }))
            }
        },
        onUpdateAction(action, selectionInput) {
            this.$emit('updateAction', action, selectionInput)
        },
        keypressHandler(event) {
            const key = event.code
            if (key == 'Enter')
                this.onViewSingle()
            if (this.userWriteAccess.actions.hasAccess) {
                if (key == 'KeyI')
                    this.onUpdateAction('In', this.selectionInput)
                if (key == 'KeyO')
                    this.onUpdateAction('Out', this.selectionInput)
                if (key == 'KeyF' || key == 'KeyU')
                    this.onUpdateAction('Focus', this.selectionInput)
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.selection-input-group {
    margin-left: 20px;
    text-align: center;
    .name {
        cursor: pointer;
        font-weight: 500;
        display: block;
        margin-bottom: -4px;
        font-size: 12px;
        &:hover {
            color: $primary;
        }
    }
    &:first-child {
        margin-left: 4px;
    }
    .selection-action-buttons {
        display: flex;
        user-select: none;
        font-size: 12px;
        ::v-deep {
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
                    &:hover {
                        font-weight: 500;
                    }
                }
            }
        }
    }
}

</style>