<template>
    <div class="selections-table-row">
        <tr
            class="selection bg-theme-white bg-theme-hover"
            :class="[{ 'is-hidden': isHidden }, { 'has-focus': hasFocus }]"
            @contextmenu="
                emitShowContext($event)
                onClick($event)
            "
            @click="onClick"
        >
            <td class="select">
                <BaseCheckbox
                    ref="selectBox"
                    :value="selection"
                    :modelValue="localSelectedSelections"
                    v-model="localSelectedSelections"
                />
            </td>
            <td class="expand" :class="{ active: childrenExpanded }" @click.stop="toggleExpanded" :style="indent">
                <span class="square invisible" v-if="selection.children.length > 0">
                    <i class="fas fa-caret-down"></i>
                </span>
            </td>
            <!-- Editing -->
            <td
                class="title"
                v-if="
                    selectionToEdit && selectionToEdit.selection.id == selection.id && selectionToEdit.field == 'name'
                "
                :style="selectionWidth"
            >
                <SelectionIcon :selection="selection" />
                <BaseEditInputWrapper
                    activateOnMount="true"
                    type="text"
                    :value="selectionToEdit.selection.name"
                    :oldValue="selection.name"
                    v-model="selectionToEdit.selection.name"
                    @submit="
                        $emit('submitToEdit')
                        onUpdateSelection(selection)
                    "
                    @cancel="$emit('cancelToEdit', { selection, parent })"
                />
            </td>
            <!-- Viewing -->
            <td
                v-else
                class="title"
                :class="{
                    clickable: isClickable,
                }"
                @click="isClickable && onGoToSelection()"
                :style="selectionWidth"
            >
                <SelectionIcon :selection="selection" />
                <div class="inner" :title="selection.name" :class="{ 'has-chapter': displayChapter }">
                    <SelectionChapterPill v-if="displayChapter" class="chapter" :selection="selection" />
                    <span>{{ selection.name }}</span>
                </div>
            </td>
            <td class="currency">
                <button
                    class="ghost pill editable sm"
                    @click="$event => $emit('showSelectionCurrencyContext', { selection, e: $event })"
                    v-if="userHasEditAccess"
                >
                    <span>{{ selection.currency || 'Not set' }}</span>
                </button>
                <span v-else>{{ selection.currency || 'Not set' }}</span>
            </td>
            <td class="budget">
                <v-popover
                    trigger="click"
                    @apply-show="onShowBudgetInput"
                    ref="budgetInputPopover"
                    :disabled="selection.type == 'Summed'"
                >
                    <BaseButton
                        v-if="userHasEditAccess"
                        buttonClass="ghost pill editable sm"
                        :disabled="selection.type == 'Summed' || !userHasEditAccess"
                    >
                        <span>{{ theSelectionBudget || 'Set budget' | thousandSeparated }}</span>
                    </BaseButton>
                    <div slot="popover" class="budget-input-wrapper">
                        <BaseInputField
                            ref="budgetInput"
                            v-model.number="newBudget"
                            inputClass="small"
                            :selectOnFocus="true"
                            @keyup.enter.native="
                                onUpdateBudget(selection)
                                $refs.budgetInputPopover.hide()
                            "
                        />
                        <span class="currency">{{ selection.currency }}</span>
                    </div>
                </v-popover>
            </td>

            <td class="budget-spend" :class="{ over: budgetSpendPercentage > 100 }">
                <span v-if="theSelectionBudget > 0">
                    {{ separateThousands(theSelectionSpend.toFixed(0)) }} {{ selection.currency }} ({{
                        budgetSpendPercentage
                    }}%)
                </span>
            </td>

            <td class="qty">
                <span>{{ selection.total_quantity }} pcs.</span>
            </td>

            <td class="users">
                <button
                    class="ghost pill sm"
                    v-if="userHasEditAccess"
                    @click="$emit('showSelectionUsersContext', { selection, e: $event })"
                >
                    <i class="far fa-user"></i><span>{{ selection.user_count }}</span>
                </button>
                <span v-else>-</span>
            </td>
            <td class="action">
                <BaseButton buttonClass="invisible pill ghost-hover primary sm" @click="onGoToSelection">
                    <span>Open</span>
                    <!-- <span v-else>Join Presentation</span> -->
                </BaseButton>
                <button v-if="userHasEditAccess" class="invisible circle ghost-hover sm" @click="emitShowContext">
                    <i class="far fa-ellipsis-h"></i>
                </button>
            </td>
        </tr>
        <template v-if="childrenExpanded">
            <selectionsTableRow
                v-for="selectionChild in selection.children"
                :parent="selection"
                :selection="selectionChild"
                :path="path.concat(selection.id)"
                :selectionToEdit="selectionToEdit"
                :key="selectionChild.id"
                :depth="selectionDepth"
                :moveSelectionActive="moveSelectionActive"
                :selectedSelections="selectedSelections"
                v-model="localSelectedSelections"
                :focusId="focusId"
                @submitToEdit="$emit('submitToEdit')"
                @cancelToEdit="$emit('cancelToEdit', $event)"
                @showContext="emitEmissionShowContext"
                @emitOnClick="emitOnClick"
                @showSelectionUsersContext="$emit('showSelectionUsersContext', $event)"
                @showSelectionCurrencyContext="$emit('showSelectionCurrencyContext', $event)"
                @showSettingsContext="
                    ($event, selection) => {
                        $emit('showSettingsContext', $event, selection)
                    }
                "
            />
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectionsTableRow from './SelectionsTableRow'
import SelectionIcon from '../../../../components/common/SelectionIcon'
import SelectionChapterPill from '../../../../components/common/SelectionChapterPill'

export default {
    name: 'selectionsTableRow',
    components: {
        selectionsTableRow: SelectionsTableRow,
        SelectionIcon,
        SelectionChapterPill,
    },
    props: [
        'selection',
        'depth',
        'selectionToEdit',
        'parent',
        'moveSelectionActive',
        'path',
        'file',
        'selectedSelections',
        'focusId',
    ],
    data: function() {
        return {
            childrenExpanded: true,
            newBudget: 0,
        }
    },
    computed: {
        ...mapGetters('selections', ['getAuthUserHasSelectionEditAccess', 'getSelectionPresentationGroups']),
        ...mapGetters('selections', {
            allSelections: 'getSelections',
        }),
        ...mapGetters('auth', ['authUser']),
        localSelectedSelections: {
            get() {
                return this.selectedSelections
            },
            set(localSelectedSelections) {
                this.$emit('input', localSelectedSelections)
            },
        },
        indent() {
            const baseIndent = 48
            const indentAmount = 24
            return {
                maxWidth: `${this.depth * indentAmount + baseIndent}px`,
                minWidth: `${this.depth * indentAmount + baseIndent}px`,
            }
        },
        selectionWidth() {
            const baseWidth = 220
            const indentAmount = 24
            return {
                maxWidth: `${baseWidth - this.depth * indentAmount}px`,
                minWidth: `${baseWidth - this.depth * indentAmount}px`,
            }
        },
        isHidden() {
            return !this.userHasEditAccess && !this.selection.is_visible
        },
        displayChapter() {
            return (
                this.selection.parent_chapter &&
                this.selection.type != 'Chapter' &&
                !this.allSelections.find(x => this.selection.parent_chapter.id == x.id)
            )
        },
        selectionDepth() {
            // If the selection is not visible to the user, then set the depth equal to the previous depth
            if (this.isHidden) return this.depth
            else return this.depth + 1
        },
        userHasEditAccess() {
            return this.getAuthUserHasSelectionEditAccess(this.selection)
        },
        budgetSpendPercentage() {
            return ((this.theSelectionSpend / this.theSelectionBudget) * 100).toFixed(1)
        },
        presentationGroupIndex() {
            return this.getSelectionPresentationGroups.findIndex(x => x == this.selection.presentation_id)
        },
        isClickable() {
            if (this.selection.your_role == 'None') return false
            if (this.selection.is_presenting) {
                return this.selection.presentation.presenter.id == this.authUser.id
            }
            return true
        },
        hasFocus() {
            return this.selection.id == this.focusId
        },
        theSelectionBudget() {
            return this.selection.type == 'Summed'
                ? this.allSelections.reduce((total, curr) => (total += curr.budget), 0)
                : this.selection.budget
        },
        theSelectionSpend() {
            return this.selection.type == 'Summed'
                ? this.allSelections.reduce((total, curr) => (total += curr.budget_spend), 0)
                : this.selection.budget_spend
        },
    },
    methods: {
        ...mapActions('selections', [
            'insertSelection',
            'updateSelection',
            'togglePresenterMode',
            'updateSelectionBudget',
            'stopPresentation',
            'updateSelectionSettings',
            'fetchSelectionSettings',
        ]),
        toggleExpanded() {
            this.childrenExpanded = !this.childrenExpanded
        },
        onShowBudgetInput() {
            this.newBudget = this.selection.budget
            setTimeout(() => {
                // For some reason this.$nextTick() doesn't work here
                this.$refs.budgetInput.focus()
            }, 100)
        },
        onGoToSelection() {
            if (!this.moveSelectionActive) {
                this.$router.push({
                    name: 'buy.selection',
                    params: { selectionId: this.selection.id },
                })
            }
        },
        onClick(e) {
            if (this.path.length <= 1) {
                this.$emit('onClick', e, this)
            }
            this.$emit('emitOnClick', e, this)
        },
        emitOnClick(e, component) {
            if (this.path.length <= 1) {
                this.$emit('onClick', e, component)
            }
            this.$emit('emitOnClick', e, component)
        },
        emitShowContext(mouseEvent) {
            this.$emit('showContext', mouseEvent, this.selection, this, this.parent)
        },
        emitEmissionShowContext(mouseEvent, selection, component, parent) {
            // This is the event that goes to the selectionsTable component
            this.$emit('showContext', mouseEvent, selection, component, parent)
        },
        onToggleLocked(selection) {
            // Check if the selection is locked
            if (selection.is_open) {
                selection.open_from = new Date('9999')
                // Set To to now
                selection.open_to = null
            } else {
                selection.open_from = null
                selection.open_to = null
            }
            this.updateSelection(selection)
        },
        onToggleHidden(selection) {
            // Check if the selection is visible
            if (selection.is_visible) {
                // Set To to now
                selection.visible_from = new Date('9999')
                selection.visible_to = null
            } else {
                selection.visible_from = null
                selection.visible_to = null
            }
            this.updateSelection(selection)
        },
        async onUpdateSelection(selection) {
            // Check if we are inserting or updating
            if (!selection.id) {
                // NEW SELECTION
                await this.insertSelection({ file: this.file, selection, addToState: false })
                // Fetch the default settings for the new selection
                await this.fetchSelectionSettings(selection)
                // Set default selection settings
                if (selection.type == 'Summed') {
                    selection.settings.action.listen.child_level = 'Children'
                    selection.settings.comment.listen.child_level = 'Children'
                } else {
                    selection.settings.action.broadcast.parent_level = 'Parent'
                    selection.settings.comment.broadcast.parent_level = 'Parent'
                    selection.settings.comment.broadcast.sibling = true
                    selection.settings.comment.listen.sibling = true
                }

                this.updateSelectionSettings({ selections: [selection] })
                // END default settings
            } else {
                this.updateSelection(selection)
            }
        },
        onUpdateBudget(selection) {
            selection.budget = this.newBudget
            this.updateSelectionBudget(selection)
            this.newBudget = 0
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.selections-table-row {
    tr {
        min-height: 56px;
    }
}

.selection {
    &.is-hidden {
        display: none;
    }
    // &.has-focus {
    //     // background: blue;
    //     box-shadow: 0 0 1px 1px $primary inset;
    // }
}

.title {
    display: flex;
    align-items: center;
    i {
        margin-right: 8px;
        &:first-child {
            margin-right: 8px;
        }
    }
    span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: block;
    }
    .inner {
        width: 100%;
        &.has-chapter {
            position: relative;
            padding-top: 16px;
            margin-bottom: -8px;
            .chapter {
                position: absolute;
                top: -6px;
            }
        }
    }
}
.expand {
    i {
        font-size: 14px;
        color: $dark2;
    }
    &.active {
        i {
            transform: rotate(180deg);
            color: $dark15;
        }
    }
    &:hover {
        cursor: pointer;
        i {
            color: $primary;
        }
    }
}
.status {
    ::v-deep {
        button {
            min-width: 72px;
        }
    }
}
.budget-input-wrapper {
    position: relative;
    ::v-deep {
        .input-wrapper {
            border-radius: $borderRadiusEl;
        }
    }
    .currency {
        position: absolute;
        right: 8px;
        bottom: 7px;
    }
}
.budget-spend {
    font-size: 13px;
    cursor: default;
    &:hover {
        font-weight: 700;
    }
    &.over {
        font-weight: 700;
        color: $red;
    }
}
.presentation-button {
    @for $i from 1 through length($groupColors) {
        $color: nth($groupColors, $i);
        &.group-#{$i} {
            background: nth($color, 1);
            border-color: nth($color, 1);
        }
    }
}
.clickable {
    font-weight: 500;
    color: $primary;
}
</style>
