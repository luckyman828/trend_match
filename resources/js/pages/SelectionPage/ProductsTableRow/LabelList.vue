<template>
    <div class="label-list flex-list" v-horizontal-scroll>
        <button
            class="list-item pill xs"
            :class="[{ 'primary-hover': hasWriteAccess }]"
            v-for="labelInput in product.labelInput"
            :key="labelInput.label"
            v-tooltip-trigger="{
                tooltipRef: labelPopoverRef,
                showArg: { labelInput, product },
                disabled: multiSelectionMode,
            }"
            @click="toggleVote(labelInput.label)"
        >
            <span>{{ getLabelIndex(labelInput.label) + 1 }} - {{ labelInput.label }}</span>
        </button>
        <v-popover ref="popover" trigger="click" v-if="hasWriteAccess" @update:open="onShowPopover">
            <button class="primary ghost pill xs add-button">
                <i class="far fa-plus"></i>
                <span>Add Label</span>
            </button>
            <BaseContextMenu :inline="true" slot="popover" tabindex="0" ref="contextMenu">
                <div class="item-group">
                    <BaseSelectButtons
                        :options="availableLabels"
                        v-model="product.yourLabels"
                        type="select"
                        :submitOnChange="true"
                        ref="selectButtons"
                        :focusOptionIndex="popoverOptionIndex"
                    >
                        <template v-slot:before="slotProps">
                            <span>{{ getLabelIndex(slotProps.option) + 1 }} - </span>
                        </template>
                    </BaseSelectButtons>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary full-width" v-close-popover>
                            <span>Done</span>
                        </button>
                    </div>
                </div>
            </BaseContextMenu>
        </v-popover>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'labelList',
    props: ['product', 'labelPopoverRef'],
    data: function() {
        return {
            isOpen: false,
            popoverOptionIndex: -1,
        }
    },
    computed: {
        ...mapGetters('auth', {
            authUser: 'authUser',
        }),
        ...mapGetters('workspaces', {
            availableLabels: 'getAvailableProductLabels',
            workspaceRole: 'authUserWorkspaceRole',
        }),
        ...mapGetters('selections', {
            selectionMode: 'getCurrentSelectionMode',
            getUserWriteAccess: 'getAuthUserSelectionWriteAccess',
            selection: 'getCurrentSelection',
            multiSelectionMode: 'getMultiSelectionModeIsActive',
        }),
        ...mapGetters('files', {
            file: 'getCurrentFile',
        }),
        availableLabelsFiltered() {
            // const labels = this.availableLabels.slice().filter(x => {
            //     const alreadyAdded = this.product.yourLabels.includes(x)
            //     return !alreadyAdded
            // })
            return this.availableLabels
        },
        hasWriteAccess() {
            const userWriteAccess = this.getUserWriteAccess(this.selection, this.product)
            return userWriteAccess && userWriteAccess.actions
        },
    },
    methods: {
        ...mapActions('actions', ['updateCurrentProductAction']),
        ...mapMutations('products', ['UPDATE_FEEDBACKS', 'UPDATE_ACTIONS']),
        onRemoveLabel(index) {
            this.product.yourLabels.splice(index, 1)
            this.onUpdateLabels()
        },
        getLabelIndex(label) {
            return this.availableLabels.indexOf(label)
        },
        toggleVote(label) {
            const labelIndex = this.product.yourLabels.findIndex(yourLabel => yourLabel == label)
            if (labelIndex < 0) {
                this.product.yourLabels.push(label)
            } else {
                this.product.yourLabels.splice(labelIndex, 1)
            }
            this.onUpdateLabels()
        },
        async onUpdateLabels() {
            const labels = this.product.yourLabels
            // Make sure the product is In/Focus
            if (labels.length > 0 && !['Focus', 'In'].includes(this.product.yourAction)) {
                if (this.selectionMode == 'Feedback') {
                    this.UPDATE_FEEDBACKS({
                        actions: [this.product.yourActionObject],
                        newAction: 'In',
                        user: this.authUser,
                    })
                } else {
                    this.UPDATE_ACTIONS({
                        actions: [this.product.yourActionObject],
                        newAction: 'In',
                        user: this.authUser,
                    })
                }
            }
            await this.updateCurrentProductAction(this.product)
        },
        onShowPopover(isOpen) {
            if (this.isOpen) this.onUpdateLabels()
            this.isOpen = isOpen

            // If now visible
            if (isOpen) {
                this.popoverOptionIndex = -1
                document.addEventListener('keydown', this.keydownHandler)
            } else {
                document.removeEventListener('keydown', this.keydownHandler)
            }
        },
        keydownHandler(e) {
            const key = e.key
            if (key == 'ArrowUp' || key == 'ArrowDown') {
                e.preventDefault()
                e.stopPropagation()
                if (key == 'ArrowUp' && this.popoverOptionIndex > 0) this.popoverOptionIndex--
                if (key == 'ArrowDown' && this.popoverOptionIndex < this.availableLabels.length - 1)
                    this.popoverOptionIndex++
            }
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.label-list {
    position: absolute;
    left: 0;
    top: -36px;
    max-width: calc(100vw - 460px);
    padding-bottom: 6px;
    overflow-x: auto;
    cursor: default;
    .list-item {
        flex-shrink: 0;
    }
    .add-button {
        display: none;
        &:hover {
            i {
                color: white !important;
            }
        }
        tr:hover & {
            display: inline-flex;
        }
    }
    .list-item,
    .add-button {
        > span {
            font-weight: 400;
        }
    }
}
</style>
