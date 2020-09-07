<template>
    <div class="selection-input-group" v-if="selectionInput" tabindex="0" ref="selectionInputGroup"
    @keyup="keypressHandler($event)">
        <span class="name" v-tooltip="selection.name.length > 18 ? selection.name : ''"
        @click="onViewSingle">
            {{selection.name | truncate(18)}}
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

                <div v-tooltip-trigger="{tooltipComp: distributionTooltipComp, showArg: {selectionInput, type: 'Focus'}}">
                    {{distributionScope == 'Alignment' ? selectionInput.alignmentFocus.length : selectionInput.focus.length}}
                </div>
            </div>

            <div class="selection-action">
                <BaseButton :buttonClass="selectionInput[currentAction] != 'In' ? 'ghost': 'green'" 
                :disabled="!userWriteAccess.actions.hasAccess" 
                v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                @click="onUpdateAction('In', selectionInput)">
                    <!-- <span>I</span> -->
                    <i class="far fa-heart"></i>
                </BaseButton>

                <div v-tooltip-trigger="{tooltipComp: distributionTooltipComp, showArg: {selectionInput, type: 'In'}}">
                    {{distributionScope == 'Alignment' ? selectionInput.alignmentIns.length : selectionInput.ins.length}}
                </div>
            </div>

            <div class="selection-action">
                <BaseButton :buttonClass="selectionInput[currentAction] != 'Out' ? 'ghost': 'red'" 
                :disabled="!userWriteAccess.actions.hasAccess" 
                v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                @click="onUpdateAction('Out', selectionInput)">
                    <!-- <span>O</span> -->
                    <i class="far fa-times-circle"></i>
                </BaseButton>
                
                <div v-tooltip-trigger="{tooltipComp: distributionTooltipComp, showArg: {selectionInput, type: 'Out'}}">
                    {{distributionScope == 'Alignment' ? selectionInput.alignmentOuts.length : selectionInput.outs.length}}
                </div>
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
        'distributionTooltipComp',
        'distributionScope',
    ],
    watch: {
        // Watch for changes to the current focus index 
        focusGroupIndex: function(newVal, oldVal) {
            if (newVal == this.index) {
                console.log('focus this group godammit')
                this.$refs.selectionInputGroup.focus()
            }
        }
    },
    computed: {
        ...mapGetters('selections', ['getAuthUserSelectionWriteAccess']),
        userWriteAccess () {
            return this.getAuthUserSelectionWriteAccess(this.selection, this.product)
        },
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP']),
        async onViewSingle() {
            this.showSelectionProductPDP({product: this.product, selection: this.selection})
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