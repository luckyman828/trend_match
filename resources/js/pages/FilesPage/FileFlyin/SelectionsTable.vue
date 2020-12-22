<template>
    <div class="selections-table" v-click-outside="rowClick">
        <BaseFlexTable
            class="flex-table-root"
            :contentStatus="readyStatus"
            :loadingMsg="loadingMsg"
            errorMsg="error loading selections"
            :errorCallback="() => initData()"
        >
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:right>
                        <BaseButton
                            buttonClass="ghost sm"
                            :disabled="authUserWorkspaceRole != 'Admin' || fileSelectionMagicLinkSent"
                            v-tooltip="'Send a link to all selection members of this file'"
                            @click="onSendMagicLinkToAll"
                        >
                            <template v-if="!fileSelectionMagicLinkSent">
                                <i class="far fa-paper-plane"></i>
                                <span>Send link</span>
                            </template>
                            <template v-else>
                                <i class="far fa-check"></i>
                                <span>Link sent</span>
                            </template>
                        </BaseButton>

                        <BaseButton
                            buttonClass="ghost sm"
                            :disabled="authUserWorkspaceRole != 'Admin'"
                            disabledTooltip="Only admins can hide/unhide selections"
                            @click="onToggleAllSelectionsLocked(allSelections)"
                        >
                            <i class="far fa-lock"></i>
                            <span>Lock/Undlock all</span>
                        </BaseButton>

                        <BaseButton
                            buttonClass="ghost sm"
                            :disabled="authUserWorkspaceRole != 'Admin'"
                            disabledTooltip="Only admins can lock/unlock selections"
                            @click="onToggleAllSelectionsVisibility(allSelections)"
                        >
                            <i class="far fa-eye"></i>
                            <span>Hide/Show all</span>
                        </BaseButton>

                        <div class="pill sm">
                            <span
                                ><strong>{{ getSelectionsTree.length }}</strong> selections</span
                            >
                        </div>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox
                        :value="selectedSelections.length > 0"
                        :modelValue="true"
                        @change="
                            checked => (checked ? (selectedSelections = allSelections) : (selectedSelections = []))
                        "
                    />
                </BaseTableHeader>
                <BaseTableHeader class="locked"></BaseTableHeader>
                <BaseTableHeader class="expand"></BaseTableHeader>
                <BaseTableHeader class="title">Name</BaseTableHeader>
                <BaseTableHeader class="budget">Budget</BaseTableHeader>
                <BaseTableHeader class="budget-spend">Spend</BaseTableHeader>
                <!-- <BaseTableHeader :sortKey="'items'" :currentSortKey="sortKey" @sort="onSort">Items</BaseTableHeader>
                <BaseTableHeader :sortKey="'in'" :currentSortKey="sortKey" @sort="onSort">In</BaseTableHeader>
                <BaseTableHeader :sortKey="'out'" :currentSortKey="sortKey" @sort="onSort">Out</BaseTableHeader>
                <BaseTableHeader :sortKey="'nd'" :currentSortKey="sortKey" @sort="onSort">ND</BaseTableHeader> -->
                <BaseTableHeader class="currency">Currency</BaseTableHeader>
                <!-- <BaseTableHeader class="teams">Teams</BaseTableHeader> -->
                <BaseTableHeader class="users">Users</BaseTableHeader>
                <BaseTableHeader class="status">Status</BaseTableHeader>
                <BaseTableHeader class="presentation">Presentation</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <div class="body">
                    <!-- Show Selections -->
                    <template v-if="getSelectionsTree.length > 0">
                        <SelectionsTableRow
                            v-for="selection in getSelectionsTree"
                            :key="selection.id"
                            :ref="'selection-row-' + selection.id"
                            :selection="selection"
                            :depth="0"
                            :path="[selection.id]"
                            :moveSelectionActive="moveSelectionActive"
                            :file="currentFile"
                            :selectionToEdit="selectionToEdit"
                            :selectedSelections="selectedSelections"
                            v-model="selectedSelections"
                            :focusId="focusSelection ? focusSelection.id : null"
                            @submitToEdit="clearToEdit"
                            @cancelToEdit="
                                clearUnsaved($event)
                                clearToEdit()
                            "
                            @showSelectionUsersFlyin="$emit('showSelectionUsersFlyin', $event)"
                            @showContext="showContextMenuSelection"
                            @endMoveSelection="endMoveSelection"
                            @showSettingsContext="showSettingsContext"
                            @onClick="rowClick"
                            @showSelectionCurrencyContext="showSelectionCurrencyContext"
                        />
                    </template>
                    <!-- No selections  -->
                    <template v-else>
                        <div class="setup-wrapper">
                            <!-- Admin -->
                            <template v-if="authUserWorkspaceRole == 'Admin'">
                                <button class="primary lg" @click="onShowCloneSetupContext">
                                    <i class="fas fa-clone"></i>
                                    <span>Copy Setup From Existing File</span>
                                </button>
                                <button class="primary ghost lg" @click="onNewSelection({ type: 'Master' })">
                                    <i class="fas fa-plus"></i>
                                    <span>Manually add new Master Selection</span>
                                </button>
                            </template>
                            <!-- No Access -->
                            <template v-else>
                                <h3>You don't have access to any selections in this file</h3>
                            </template>
                        </div>
                    </template>
                </div>
            </template>
            <template v-slot:footer>
                <td>
                    <BaseButton
                        buttonClass="primary invisible"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can create new masters"
                        v-tooltip="'Create a new Master'"
                        @click="onNewSelection({ type: 'Master' })"
                    >
                        <i class="far fa-crown"></i><span>Add Master</span>
                    </BaseButton>
                </td>
                <td>
                    <BaseButton
                        buttonClass="primary invisible"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can create new selections"
                        v-tooltip="'Create a new selection. Will be added under the currently focused selection.'"
                        @click="
                            onNewSelection({
                                type: 'Normal',
                                parent: focusSelection,
                            })
                        "
                    >
                        <i class="far fa-poll"></i><span>Add Selection</span>
                    </BaseButton>
                </td>
                <td>
                    <BaseButton
                        buttonClass="primary invisible"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can create new chapters"
                        v-tooltip="'Create a new chapter. Will be added under the currently focused selection.'"
                        @click="
                            onNewSelection({
                                type: 'Chapter',
                                parent: focusSelection,
                            })
                        "
                    >
                        <i class="far fa-project-diagram"></i><span>Add Chapter</span>
                    </BaseButton>
                </td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuSelection" class="context-selection">
            <template v-slot v-if="!!contextSelection">
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-users"
                        :disabled="
                            !(
                                !contextSelection.is_presenting ||
                                (contextSelection.your_role == 'Owner' && contextSelection.type == 'Master')
                            )
                        "
                        disabledTooltip="Selection is in presentation mode. To join the presentation login to the Kollekt mobile app"
                        hotkey="KeyG"
                        @click="
                            $router.push({
                                name: 'selection',
                                params: { fileId: contextSelection.file_id, selectionId: contextSelection.id },
                            })
                        "
                    >
                        <span><u>G</u>o to selection </span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        :disabled="contextSelection.selectionLinkSent"
                        :iconClass="contextSelection.selectionLinkSent ? 'far fa-check' : 'far fa-paper-plane'"
                        hotkey="KeyL"
                        @click="onSendSelectionLink(contextSelection)"
                    >
                        <span v-if="!contextSelection.selectionLinkSent">Send selection <u>L</u>ink</span>
                        <span v-else>Link sent</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem
                        iconClass="far fa-link"
                        hotkey="KeyL"
                        @click="onGetSelectionLink(contextSelection.id)"
                    >
                        <span>C<u>o</u>py Selection link</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-pen"
                        hotkey="KeyR"
                        @click="selectionToEdit = { selection: contextSelection, field: 'name' }"
                    >
                        <u>R</u>ename
                    </BaseContextMenuItem>

                    <BaseContextMenuItem
                        iconClass="far fa-user-cog"
                        hotkey="KeyM"
                        @click="$emit('showSelectionUsersFlyin', contextSelection)"
                    >
                        <u>M</u>embers and Access
                    </BaseContextMenuItem>

                    <BaseContextMenuItem iconClass="far fa-plus" hotkey="KeyC">
                        <template>
                            <span><u>C</u>reate</span>
                        </template>

                        <template v-slot:submenu>
                            <div class="item-group">
                                <BaseContextMenuItem
                                    iconClass="far fa-poll"
                                    hotkey="KeyS"
                                    @click="onNewSelection({ parent: contextSelection, type: 'Normal' })"
                                >
                                    <span><u>S</u>election</span>
                                </BaseContextMenuItem>

                                <BaseContextMenuItem
                                    iconClass="far fa-project-diagram"
                                    hotkey="KeyC"
                                    :disabled="contextSelection.type != 'Master'"
                                    disabledTooltip="Can only create Master sub-selections on another Master selection"
                                    @click="onNewSelection({ parent: contextSelection, type: 'Chapter' })"
                                >
                                    <span><u>C</u>hapter</span>
                                </BaseContextMenuItem>
                            </div>
                        </template>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        v-if="contextSelection.type == 'Chapter'"
                        iconClass="far fa-filter"
                        hotkey="KeyF"
                        @click="onShowChapterFilterModal(contextSelection)"
                    >
                        <span>Chapter <u>F</u>ilter</span>
                    </BaseContextMenuItem>
                    <BaseContextMenuItem
                        iconClass="far fa-cog"
                        hotkey="KeyS"
                        @click="showSettingsContext(contextMouseEvent, contextSelection)"
                    >
                        <u>S</u>ettings
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-trash-alt"
                        hotkey="KeyD"
                        @click="onDeleteSelection(contextSelection, contextSelectionParent)"
                    >
                        <u>D</u>elete selection
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelectedSelections" class="context-selection">
            <template v-slot:header>
                <span>Choose action for {{ selectedSelections.length }} selections</span>
            </template>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-times" hotkey="KeyC" @click="selectedSelections = []">
                    <span><u>C</u>lear Selected</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-cog"
                    hotkey="KeyS"
                    @click="showSettingsContext(contextMouseEvent, contextSelection)"
                >
                    <u>S</u>ettings
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    iconClass="far fa-lock"
                    hotkey="KeyL"
                    @click="onToggleAllSelectionsLocked(selectedSelections)"
                >
                    <span><u>L</u>ock / Unlock</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    iconClass="far fa-eye"
                    hotkey="KeyH"
                    @click="onToggleAllSelectionsVisibility(selectedSelections)"
                >
                    <span><u>H</u>ide / Unhide</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-trash-alt"
                    hotkey="KeyD"
                    @click="onDeleteSelection(contextSelection, contextSelectionParent)"
                >
                    <u>D</u>elete selections
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuMove" class="context-move">
            <div
                class="item-group"
                v-if="
                    contextSelectionComponent &&
                        selectionToMove &&
                        !contextSelectionComponent.path.includes(selectionToMove.id)
                "
            >
                <BaseContextMenuItem
                    iconClass="far fa-arrow-left"
                    hotkey="KeyM"
                    @click="endMoveSelection(contextSelection, contextSelectionComponent)"
                >
                    <u>M</u>ove here
                </BaseContextMenuItem>
            </div>
            <div class="item-group" v-else-if="contextSelectionComponent && selectionToMove">
                <BaseContextMenuItem iconClass="far fa-exclamation-circle" :disabled="true">
                    <span>Cannot place inside self</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-times" hotkey="KeyC" @click="clearMoveSelection">
                    <u>C</u>ancel
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuOptions" class="context-options" columns="4" @hide="settingsSelections = []">
            <template v-slot:header v-if="contextSelection">
                <span
                    >Settings: {{ contextSelection.name }}
                    <template v-if="settingsSelections.length > 1">
                        + {{ settingsSelections.length - 1 }} more</template
                    >
                </span>
            </template>
            <template v-slot="slotProps" v-if="settingsSelections.length > 0">
                <!-- If loading -->
                <div class="loading-wrapper" v-if="loadingSelectionSettings">
                    <BaseLoader />
                </div>
                <!-- if ready -->
                <div class="columns" v-else>
                    <!-- Feedback -->
                    <div class="item-group">
                        <div class="item-group">
                            <strong class="header">Feedback Actions</strong>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Up</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        parentLevelOptions.find(
                                            x => x.value == contextSelection.settings.feedback.broadcast.parent_level
                                        ).label
                                    "
                                    @click="
                                        showParentLevelContext($event, contextSelection.settings.feedback.broadcast)
                                    "
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Down</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        childLevelOptions.find(
                                            x => x.value == contextSelection.settings.feedback.broadcast.child_level
                                        ).label
                                    "
                                    @click="showChildLevelContext($event, contextSelection.settings.feedback.broadcast)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast to Siblings</label>
                                <BaseCheckboxInputField v-model="contextSelection.settings.feedback.broadcast.sibling">
                                    <span>Broadcast to Siblings</span>
                                </BaseCheckboxInputField>
                            </div>
                        </div>

                        <div class="item-group">
                            <div class="item-wrapper">
                                <label class="settings-label">Listen Up</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        parentLevelOptions.find(
                                            x => x.value == contextSelection.settings.feedback.listen.parent_level
                                        ).label
                                    "
                                    @click="showParentLevelContext($event, contextSelection.settings.feedback.listen)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen Down</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        childLevelOptions.find(
                                            x => x.value == contextSelection.settings.feedback.listen.child_level
                                        ).label
                                    "
                                    @click="showChildLevelContext($event, contextSelection.settings.feedback.listen)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen to Siblings</label>
                                <BaseCheckboxInputField v-model="contextSelection.settings.feedback.listen.sibling">
                                    <span>Listen to Siblings</span>
                                </BaseCheckboxInputField>
                            </div>
                        </div>
                        <div class="item-group">
                            <div class="item-wrapper">
                                <label class="settings-label">Limit who can see feedback</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        displayLevelOptions.find(
                                            x => x.value == contextSelection.settings.feedback_visible
                                        ).label
                                    "
                                    @click="
                                        showDisplayLevelContext($event, contextSelection.settings, 'feedback_visible')
                                    "
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                            <div class="item-wrapper">
                                <label class="settings-label"
                                    >Display feedback authors for
                                    <i
                                        class="far fa-info-circle"
                                        v-tooltip="
                                            'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'
                                        "
                                    ></i>
                                    :</label
                                >
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        displayAuthorOptions.find(
                                            x => x.value == contextSelection.settings.anonymize_feedback
                                        ).label
                                    "
                                    @click="
                                        showDisplayAuthorContext(
                                            $event,
                                            contextSelection.settings,
                                            'anonymize_feedback'
                                        )
                                    "
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                        </div>
                    </div>
                    <!-- Actions -->
                    <div class="item-group">
                        <div class="item-group">
                            <strong class="header">Alignment Actions</strong>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Up</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        parentLevelOptions.find(
                                            x => x.value == contextSelection.settings.action.broadcast.parent_level
                                        ).label
                                    "
                                    @click="showParentLevelContext($event, contextSelection.settings.action.broadcast)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Down</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        childLevelOptions.find(
                                            x => x.value == contextSelection.settings.action.broadcast.child_level
                                        ).label
                                    "
                                    @click="showChildLevelContext($event, contextSelection.settings.action.broadcast)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast to Siblings</label>
                                <BaseCheckboxInputField v-model="contextSelection.settings.action.broadcast.sibling">
                                    <span>Broadcast to Siblings</span>
                                </BaseCheckboxInputField>
                            </div>
                        </div>

                        <div class="item-group">
                            <div class="item-wrapper">
                                <label class="settings-label">Listen Up</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        parentLevelOptions.find(
                                            x => x.value == contextSelection.settings.action.listen.parent_level
                                        ).label
                                    "
                                    @click="showParentLevelContext($event, contextSelection.settings.action.listen)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen Down</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        childLevelOptions.find(
                                            x => x.value == contextSelection.settings.action.listen.child_level
                                        ).label
                                    "
                                    @click="showChildLevelContext($event, contextSelection.settings.action.listen)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen to Siblings</label>
                                <BaseCheckboxInputField v-model="contextSelection.settings.action.listen.sibling">
                                    <span>Listen to Siblings</span>
                                </BaseCheckboxInputField>
                            </div>
                        </div>

                        <div class="item-group">
                            <div class="item-wrapper">
                                <label class="settings-label">Limit who can see alignment actions</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        displayLevelOptions.find(
                                            x => x.value == contextSelection.settings.action_visible
                                        ).label
                                    "
                                    @click="
                                        showDisplayLevelContext($event, contextSelection.settings, 'action_visible')
                                    "
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                            <div class="item-wrapper">
                                <label class="settings-label"
                                    >Display alignment authors for
                                    <i
                                        class="far fa-info-circle"
                                        v-tooltip="
                                            'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'
                                        "
                                    ></i>
                                    :</label
                                >
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        displayAuthorOptions.find(
                                            x => x.value == contextSelection.settings.anonymize_action
                                        ).label
                                    "
                                    @click="
                                        showDisplayAuthorContext($event, contextSelection.settings, 'anonymize_action')
                                    "
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                        </div>
                    </div>
                    <!-- Comments -->
                    <div class="item-group">
                        <div class="item-group">
                            <strong class="header">Comments</strong>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Up</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        parentLevelOptions.find(
                                            x => x.value == contextSelection.settings.comment.broadcast.parent_level
                                        ).label
                                    "
                                    @click="showParentLevelContext($event, contextSelection.settings.comment.broadcast)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Down</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        childLevelOptions.find(
                                            x => x.value == contextSelection.settings.comment.broadcast.child_level
                                        ).label
                                    "
                                    @click="showChildLevelContext($event, contextSelection.settings.comment.broadcast)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast to Siblings</label>
                                <BaseCheckboxInputField v-model="contextSelection.settings.comment.broadcast.sibling">
                                    <span>Broadcast to Siblings</span>
                                </BaseCheckboxInputField>
                            </div>
                        </div>

                        <div class="item-group">
                            <div class="item-wrapper">
                                <label class="settings-label">Listen Up</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        parentLevelOptions.find(
                                            x => x.value == contextSelection.settings.comment.listen.parent_level
                                        ).label
                                    "
                                    @click="showParentLevelContext($event, contextSelection.settings.comment.listen)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen Down</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        childLevelOptions.find(
                                            x => x.value == contextSelection.settings.comment.listen.child_level
                                        ).label
                                    "
                                    @click="showChildLevelContext($event, contextSelection.settings.comment.listen)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen to Siblings</label>
                                <BaseCheckboxInputField v-model="contextSelection.settings.comment.listen.sibling">
                                    <span>Listen to Siblings</span>
                                </BaseCheckboxInputField>
                            </div>
                        </div>

                        <div class="item-group">
                            <div class="item-wrapper">
                                <label class="settings-label">Limit who can see comments</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        displayLevelOptions.find(
                                            x => x.value == contextSelection.settings.comment_visible
                                        ).label
                                    "
                                    @click="
                                        showDisplayLevelContext($event, contextSelection.settings, 'comment_visible')
                                    "
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                            <div class="item-wrapper">
                                <label class="settings-label"
                                    >Display comment authors for
                                    <i
                                        class="far fa-info-circle"
                                        v-tooltip="
                                            'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'
                                        "
                                    ></i>
                                    :</label
                                >
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        displayAuthorOptions.find(
                                            x => x.value == contextSelection.settings.anonymize_comment
                                        ).label
                                    "
                                    @click="
                                        showDisplayAuthorContext($event, contextSelection.settings, 'anonymize_comment')
                                    "
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                        </div>
                    </div>
                    <!-- Requests -->
                    <div class="item-group">
                        <div class="item-group">
                            <strong class="header">Requests</strong>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Up</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        parentLevelOptions.find(
                                            x => x.value == contextSelection.settings.request.broadcast.parent_level
                                        ).label
                                    "
                                    @click="showParentLevelContext($event, contextSelection.settings.request.broadcast)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Down</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        childLevelOptions.find(
                                            x => x.value == contextSelection.settings.request.broadcast.child_level
                                        ).label
                                    "
                                    @click="showChildLevelContext($event, contextSelection.settings.request.broadcast)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast to Siblings</label>
                                <BaseCheckboxInputField v-model="contextSelection.settings.request.broadcast.sibling">
                                    <span>Broadcast to Siblings</span>
                                </BaseCheckboxInputField>
                            </div>
                        </div>

                        <div class="item-group">
                            <div class="item-wrapper">
                                <label class="settings-label">Listen Up</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        parentLevelOptions.find(
                                            x => x.value == contextSelection.settings.request.listen.parent_level
                                        ).label
                                    "
                                    @click="showParentLevelContext($event, contextSelection.settings.request.listen)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen Down</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        childLevelOptions.find(
                                            x => x.value == contextSelection.settings.request.listen.child_level
                                        ).label
                                    "
                                    @click="showChildLevelContext($event, contextSelection.settings.request.listen)"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen to Siblings</label>
                                <BaseCheckboxInputField v-model="contextSelection.settings.request.listen.sibling">
                                    <span>Listen to Siblings</span>
                                </BaseCheckboxInputField>
                            </div>
                        </div>

                        <div class="item-group">
                            <div class="item-wrapper">
                                <label class="settings-label">Limit who can see requests</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        displayLevelOptions.find(
                                            x => x.value == contextSelection.settings.request_visible
                                        ).label
                                    "
                                    @click="
                                        showDisplayLevelContext($event, contextSelection.settings, 'request_visible')
                                    "
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                            <div class="item-wrapper">
                                <label class="settings-label"
                                    >Display request authors for
                                    <i
                                        class="far fa-info-circle"
                                        v-tooltip="
                                            'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'
                                        "
                                    ></i>
                                    :</label
                                >
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        displayAuthorOptions.find(
                                            x => x.value == contextSelection.settings.anonymize_request
                                        ).label
                                    "
                                    @click="
                                        showDisplayAuthorContext($event, contextSelection.settings, 'anonymize_request')
                                    "
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                            <div class="item-wrapper">
                                <label class="settings-label">Can make tickets</label>
                                <BaseInputField
                                    disabled="true"
                                    type="select"
                                    :value="
                                        ticketLevelOptions.find(x => x.value == contextSelection.settings.ticket_level)
                                            .label
                                    "
                                    @click="showTicketLevelContext($event, contextSelection.settings, 'ticket_level')"
                                >
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="item-group footer item-wrapper"
                    style="display: flex; justify-content: space-between; width: 100%;"
                >
                    <!-- <div class="item-wrapper" > -->
                    <div>
                        <button class="ghost primary" @click="onCloneSettings">
                            <i class="far fa-clone"></i><span>Clone settings from another Selection</span>
                        </button>
                    </div>
                    <div style="text-align: right;">
                        <button
                            class="primary"
                            @click="
                                onSaveSelectionSettings()
                                slotProps.hide()
                            "
                        >
                            <span>Save</span>
                        </button>
                        <button class="invisible ghost-hover" @click="slotProps.hide()"><span>Cancel</span></button>
                    </div>
                    <!-- </div> -->
                </div>

                <BaseContextMenu ref="contextParentLevel" v-slot="slotProps">
                    <BaseSelectButtons
                        type="radio"
                        :submitOnChange="true"
                        v-model="contextSelectionOption.parent_level"
                        @submit="slotProps.hide"
                        :options="parentLevelOptions"
                        :optionNameKey="'label'"
                        :optionValueKey="'value'"
                    />
                </BaseContextMenu>

                <BaseContextMenu ref="contextChildLevel" v-slot="slotProps">
                    <BaseSelectButtons
                        type="radio"
                        :submitOnChange="true"
                        v-model="contextSelectionOption.child_level"
                        @submit="slotProps.hide"
                        :options="childLevelOptions"
                        :optionNameKey="'label'"
                        :optionValueKey="'value'"
                    />
                </BaseContextMenu>

                <BaseContextMenu ref="contextDisplayLevel" v-slot="slotProps">
                    <BaseSelectButtons
                        type="radio"
                        :submitOnChange="true"
                        v-model="contextSelectionSettings[contextSelectionSettingsKey]"
                        @submit="slotProps.hide"
                        :options="displayLevelOptions"
                        :optionNameKey="'label'"
                        :optionValueKey="'value'"
                    />
                </BaseContextMenu>

                <BaseContextMenu ref="contextAuthorLevel" v-slot="slotProps">
                    <BaseSelectButtons
                        type="radio"
                        :submitOnChange="true"
                        v-model="contextSelectionSettings[contextSelectionSettingsKey]"
                        @submit="slotProps.hide"
                        :options="displayAuthorOptions"
                        :optionNameKey="'label'"
                        :optionValueKey="'value'"
                    />
                </BaseContextMenu>

                <BaseContextMenu ref="contextTicketLevel" v-slot="slotProps">
                    <BaseSelectButtons
                        type="radio"
                        :submitOnChange="true"
                        v-model="contextSelectionSettings[contextSelectionSettingsKey]"
                        @submit="slotProps.hide"
                        :options="ticketLevelOptions"
                        :optionNameKey="'label'"
                        :optionValueKey="'value'"
                    />
                </BaseContextMenu>

                <BaseContextMenu ref="contextCloneSettings" class="context-clone-settings">
                    <template v-slot:header>
                        <span>Select selections to copy settings from</span>
                    </template>
                    <template v-slot="innerSlotProps">
                        <div class="item-group">
                            <BaseSelectButtons
                                type="radio"
                                search="true"
                                :options="allSelections.filter(x => x.id != contextSelection.id)"
                                optionNameKey="name"
                                v-model="selectionToCloneSettingsFrom"
                                :submitOnChange="true"
                            />
                        </div>
                        <div class="item-group">
                            <div class="item-wrapper">
                                <button
                                    class="primary"
                                    @click="
                                        cloneSettings()
                                        innerSlotProps.hide()
                                    "
                                >
                                    <span>Clone</span>
                                </button>
                                <button
                                    class="invisible ghost-hover"
                                    style="margin-left: 8px;"
                                    @click="innerSlotProps.hide()"
                                >
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    </template>
                </BaseContextMenu>
            </template>
        </BaseContextMenu>

        <div ref="moveSelectionIndicator" class="move-selection-indicator" :class="{ active: moveSelectionActive }">
            <span>Click selection to move to</span>
        </div>

        <BaseContextMenu ref="contextMenuCloneSetup" class="context-move">
            <template v-slot:header>
                <span>Select file to copy selections from</span>
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons
                        type="radio"
                        search="true"
                        :options="allFiles.filter(x => x.type == 'File' && x.id != currentFile.id)"
                        optionNameKey="name"
                        optionDescriptionKey="parentName"
                        v-model="fileToClone"
                        :submitOnChange="true"
                    />
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button
                            class="primary"
                            @click="
                                onClone(fileToClone)
                                slotProps.hide()
                            "
                        >
                            <span>Clone</span>
                        </button>
                        <button class="invisible ghost-hover" style="margin-left: 8px;" @click="slotProps.hide()">
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu
            v-if="contextSelection"
            ref="contextCurrency"
            header="Change Selection Currency"
            v-model="contextSelection.currency"
            unsetOption="Clear"
            :unsetValue="null"
            type="radio"
            :options="availableCurrencies"
            :search="true"
            @submit="updateSelection(contextSelection)"
        />

        <BaseDialog
            ref="deleteSelectionDialog"
            type="confirm"
            :confirmText="selectedSelections.length > 1 ? 'Yes, delete them' : 'Yes, delete it'"
            :cancelText="selectedSelections.length > 1 ? 'No, keep them' : 'No, keep it'"
            confirmColor="red"
        >
            <div class="icon-graphic">
                <i class="far fa-poll primary lg"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-trash lg dark"></i>
            </div>
            <h3>
                Really delete {{ selectedSelections.length > 1 ? selectedSelections.length : 'this' }} selection{{
                    selectedSelections.length > 1 ? 's' : ''
                }}?
            </h3>
            <p>All input of the selection{{ selectedSelections.length > 1 ? 's' : '' }} will be permanently deleted.</p>
            <p><strong>Please beware:</strong> All sub-selections will be deleted as well.</p>
        </BaseDialog>

        <ChapterFilterModal
            :selection="contextSelection"
            :show="showChapterFilterModal"
            @close="showChapterFilterModal = false"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import SelectionsTableRow from './SelectionsTableRow'
import ChapterFilterModal from './ChapterFilterModal'
import sortArray from '../../../mixins/sortArray'

export default {
    name: 'selectionsTable',
    components: {
        SelectionsTableRow,
        ChapterFilterModal,
    },
    mixins: [sortArray],
    data: function() {
        return {
            focusSelection: null,
            showChapterFilterModal: false,
            loadingData: false,
            fileSelectionMagicLinkSent: false,
            selectedSelections: [],
            sortKey: null,
            selectionToEdit: null,
            contextSelection: null,
            contextSelectionComponent: null,
            contextSelectionParent: null,
            contextMouseEvent: null,
            moveSelectionActive: false,
            selectionToMove: null,
            selectionToMoveParent: null,
            fileToClone: null,
            loadingSelectionSettings: false,
            contextSelectionOption: null,
            contextSelectionSettings: null,
            contextSelectionSettingsKey: null,
            selectionToCloneSettingsFrom: null,
            parentLevelOptions: [
                {
                    value: 'Ancestors',
                    label: 'All',
                },
                {
                    value: 'Parent',
                    label: 'Parent',
                },
                {
                    value: 'None',
                    label: 'None',
                },
            ],
            childLevelOptions: [
                {
                    value: 'Descendants',
                    label: 'All',
                },
                {
                    value: 'Children',
                    label: 'Children',
                },
                {
                    value: 'None',
                    label: 'None',
                },
            ],
            displayLevelOptions: [
                {
                    value: 'Member',
                    label: 'Everyone',
                },
                {
                    value: 'Owner',
                    label: 'Owners',
                },
            ],
            displayAuthorOptions: [
                {
                    value: 'Member',
                    label: 'Everyone',
                },
                {
                    value: 'Owner',
                    label: 'Owners',
                },
                {
                    value: 'None',
                    label: 'No one',
                },
            ],
            ticketLevelOptions: [
                {
                    value: 'Multiple',
                    label: 'True',
                },
                {
                    value: 'None',
                    label: 'False',
                },
                // {
                //     value: 'Single',
                //     label: 'INVALID. PLEASE CHANGE'
                // },
            ],
            cloningSetup: false,
            settingsSelections: [],
        }
    },
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('files', ['currentFile', 'files', 'allFiles', 'getCurrentFileChanged']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        ...mapGetters('selections', [
            'getAuthUserHasSelectionEditAccess',
            'selections',
            'getSelectionsTree',
            'getSelectionsStatus',
            'getSelections',
        ]),
        allSelections() {
            return this.selections
        },
        readyStatus() {
            if (this.getSelectionsStatus == 'error') return 'error'
            if (this.getSelectionsStatus == 'loading' || this.cloningSetup || this.loadingData) return 'loading'
            return 'success'
        },
        loadingMsg() {
            if (this.cloningSetup) return 'Cloning selections'
            return 'Loading selections'
        },
    },
    watch: {
        currentFile(newVal, oldVal) {
            this.initData(true)
        },
    },
    methods: {
        ...mapActions('selections', [
            'fetchSelections',
            'createSelectionTree',
            'insertSelection',
            'updateSelection',
            'addTeamsToSelection',
            'addUsersToSelection',
            'fetchSelection',
            'fetchSelectionSettings',
            'updateSelectionSettings',
            'deleteSelection',
            'sendSelectionLink',
            'getSelectionLink',
        ]),
        ...mapMutations('selections', ['insertSelections', 'DELETE_SELECTION']),
        ...mapActions('presentation', ['fetchFilePresentations']),
        ...mapActions('files', ['fetchAllFiles', 'cloneFileSelections']),
        ...mapMutations('files', ['SET_CURRENT_FILE_CHANGED']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async initData(forceRefresh) {
            if (
                forceRefresh ||
                this.getCurrentFileChanged ||
                (this.getSelectionsStatus != 'success' && this.getSelectionsStatus != 'loading')
            ) {
                this.loadingData = true
                await Promise.all([
                    this.fetchSelections({ fileId: this.currentFile.id }),
                    this.fetchFilePresentations(this.currentFile.id),
                ])
                this.SET_CURRENT_FILE_CHANGED(false)
                this.loadingData = false
            }
        },
        async onGetSelectionLink(selectionId) {
            const link = await this.getSelectionLink(selectionId)
            console.log('the link: ', link)
            this.copyToClipboard(link)
            this.SHOW_SNACKBAR({
                msg: 'Link copied',
                iconClass: 'fa-clipboard-check',
                type: 'success',
            })
        },
        onSort(sortAsc, sortKey) {
            this.sortKey = sortKey
            this.sortArray(this.getSelectionsTree, sortAsc, sortKey)
        },
        rowClick(e, component) {
            if (!component) {
                this.focusSelection = null
                return
            }
            const selection = component.selection
            this.focusSelection = this.focusSelection && this.focusSelection.id == selection.id ? null : selection
            this.contextSelectionComponent = component
            if (this.moveSelectionActive) {
                e.stopPropagation()
                this.endMoveSelection(selection, component)
            }
        },
        async showSettingsContext(e, selection) {
            if (this.contextSelection) {
                this.contextSelection = selection
                Vue.set(this.contextSelection, selection)
            } else {
                this.contextSelection = selection
            }

            // Load the selections settings
            this.loadingSelectionSettings = true
            await this.fetchSelectionSettings(selection)
            this.loadingSelectionSettings = false

            const contextMenu = this.$refs.contextMenuOptions

            // If the parsed selection is part of the selected selection, edit settings for all of them
            if (this.selectedSelections.find(x => x.id == selection.id)) {
                this.settingsSelections = this.selectedSelections
            }

            // If the parsed selection is not part of the selected selections, only display settings for that one
            else {
                this.settingsSelections = [selection]
            }

            // this.contextSelection = selection
            // Position the contextual menu
            this.$nextTick(() => {
                contextMenu.show(e)
            })
        },
        showSelectionCurrencyContext({ selection, e }) {
            this.contextSelection = selection
            this.$nextTick(() => {
                this.$refs.contextCurrency.show(e)
            })
        },
        showParentLevelContext(e, option) {
            this.contextSelectionOption = option
            this.$refs.contextChildLevel.hide()
            this.$refs.contextDisplayLevel.hide()
            this.$refs.contextAuthorLevel.hide()
            this.$refs.contextTicketLevel.hide()
            this.$refs.contextParentLevel.show(e)
        },
        showChildLevelContext(e, option) {
            this.contextSelectionOption = option
            this.$refs.contextParentLevel.hide()
            this.$refs.contextDisplayLevel.hide()
            this.$refs.contextAuthorLevel.hide()
            this.$refs.contextTicketLevel.hide()
            this.$refs.contextChildLevel.show(e)
        },
        showDisplayLevelContext(e, settings, key) {
            this.contextSelectionSettings = settings
            this.contextSelectionSettingsKey = key
            this.$refs.contextParentLevel.hide()
            this.$refs.contextChildLevel.hide()
            this.$refs.contextAuthorLevel.hide()
            this.$refs.contextTicketLevel.hide()
            this.$refs.contextDisplayLevel.show(e)
        },
        showDisplayAuthorContext(e, settings, key) {
            this.contextSelectionSettings = settings
            this.contextSelectionSettingsKey = key
            this.$refs.contextParentLevel.hide()
            this.$refs.contextChildLevel.hide()
            this.$refs.contextDisplayLevel.hide()
            this.$refs.contextTicketLevel.hide()
            this.$refs.contextAuthorLevel.show(e)
        },
        showTicketLevelContext(e, settings, key) {
            this.contextSelectionSettings = settings
            this.contextSelectionSettingsKey = key
            this.$refs.contextParentLevel.hide()
            this.$refs.contextChildLevel.hide()
            this.$refs.contextDisplayLevel.hide()
            this.$refs.contextAuthorLevel.hide()
            this.$refs.contextTicketLevel.show(e)
        },
        onCloneSettings(e) {
            this.$refs.contextCloneSettings.show(e)
        },
        async cloneSettings() {
            // Fetch the settings of the selection to clone from
            const settingsToClone = await this.fetchSelectionSettings(this.selectionToCloneSettingsFrom)
            // Set the settings on the context selection
            this.$set(this.contextSelection, 'settings', settingsToClone)
        },
        onSaveSelectionSettings() {
            // Send API request to update the selections settings.
            if (this.settingsSelections.length > 1) {
                this.settingsSelections.map(selection => {
                    // Set the selection settings of this selection to a copy of the context selection's
                    // Use Vue.set to instantiate 'settings' as a reactive property on the selection
                    Vue.set(selection, 'settings', JSON.parse(JSON.stringify(this.contextSelection.settings)))
                })
                this.updateSelectionSettings({ selections: this.settingsSelections })
            } else {
                this.updateSelectionSettings({ selections: [this.contextSelection] })
            }
        },
        showContextMenuSelection(e, selection, component, parent) {
            if (!this.getAuthUserHasSelectionEditAccess(selection)) return
            e.preventDefault()
            // Set the current context menu item
            if (this.selectedSelections.length > 0) {
                this.contextSelection = this.selectedSelections[0]
            } else {
                this.contextSelection = selection
            }
            this.contextSelectionComponent = component
            this.contextSelectionParent = parent
            // Save a reference to the clicked element
            this.contextMouseEvent = e

            // Show the move context instead if we are in the proces of moving something
            if (this.moveSelectionActive) {
                this.showContextMenuMove(e)
            } else {
                let selectionContext = this.$refs.contextMenuSelection
                if (this.selectedSelections.length > 1) {
                    selectionContext = this.$refs.contextMenuSelectedSelections
                }
                // Position the contextual menu
                selectionContext.show(e)
            }
        },
        onShowChapterFilterModal(selection) {
            this.showChapterFilterModal = true
            this.contextSelection = selection
        },
        onMoveSelection(selection, parent) {
            this.selectionToMove = selection
            this.selectionToMoveParent = parent
            this.moveSelectionActive = true

            // Add event listener to listen for mousemove
            document.addEventListener('mousemove', this.moveSelectionMouseFollowHandler)
            // Call the event handler to set the initial position
            this.moveSelectionMouseFollowHandler(this.contextMouseEvent)
            // Add event listener to listen for right clicks to show a special context menu
            document.addEventListener('contextmenu', this.moveSelectionClickHandler)
        },
        endMoveSelection(selection, component) {
            if (this.moveSelectionActive) {
                // Add the selection to the selected selection
                selection.children.push(this.selectionToMove)

                // Remove the selection from it's old position
                const parent = this.selectionToMoveParent
                if (parent) {
                    const index = parent.children.findIndex(x => x.id == this.selectionToMove.id)
                    parent.children.splice(index, 1)
                } else {
                    const index = this.getSelectionsTree.findIndex(x => x.id == this.selectionToMove.id)
                    this.getSelectionsTree.splice(index, 1)
                }

                // Expand the component
                component.childrenExpanded = true

                // Remove event listener to listen for mousemove
                document.removeEventListener('mousemove', this.moveSelectionMouseFollowHandler)
                // Remove event listener to listen for right clicks to show a special context menu
                document.removeEventListener('contextmenu', this.moveSelectionClickHandler)

                // --- Send request to API --- //

                // Reset the selection to move
                this.clearMoveSelection()
            }
        },
        clearMoveSelection() {
            // Reset the selection to move
            this.selectionToMove = null
            this.selectionToMoveParent = null
            this.moveSelectionActive = false
        },
        moveSelectionMouseFollowHandler(e) {
            const el = this.$refs.moveSelectionIndicator
            el.style.left = `${e.clientX + 20}px`
            el.style.top = `${e.clientY}px`
        },
        moveSelectionClickHandler(e) {
            this.contextSelection = null
            this.contextSelectionParent = null
            this.contextSelectionComponent = null
            this.showContextMenuMove(e)
        },
        showContextMenuMove(e) {
            e.preventDefault()
            e.stopPropagation()
            const moveContext = this.$refs.contextMenuMove
            this.contextMouseEvent = e
            // Position the contextual menu
            moveContext.show(e)
        },
        async onNewSelection({ parent, type }) {
            // First check that we don't already have an unsaved new selection
            if (this.getSelectionsTree.find(x => x.id == null)) return
            // Else instantiate a new master object in the table
            const newSelection = {
                id: null,
                file_id: this.currentFile.id,
                name: type == 'Master' ? 'New Master' : type == 'Chapter' ? 'New Chapter' : 'New Selection',
                type,
                currency: null,
                user_count: 0,
                team_count: 0,
                children: [],
                visible_from: null,
                visible_to: null,
                open_from: null,
                open_to: null,
                completed_at: null,
                your_role: null,
                is_presenting: null,
                budget: 0,
                budget_spend: 0,
            }
            // Push new selection to the parent
            if (parent) {
                // If we are creating a sbu selection
                newSelection.parent_id = parent.id
                newSelection.is_presenting = parent.is_presenting
                // Instantiate a children array on the parent
                if (!parent.children) {
                    this.$set(parent, 'children', [])
                }
                // parent.children.push(newSelection)
                this.insertSelections({ selections: [newSelection], method: 'add' })
                // Expand the selection the new selection is added to
                // Loop through the children to find the selectionrow in question
                this.contextSelectionComponent.childrenExpanded = true
            } else {
                // If no parent, we are creating a new master
                newSelection.parent_id = 0
                // this.selections.push(newSelection)
                this.insertSelections({ selections: [newSelection], method: 'add' })
            }
            // Wait for changes to the dom to take effect
            this.$nextTick(() => {
                // Activate title edit of new folder
                this.selectionToEdit = { selection: newSelection, field: 'name' }
            })
        },
        async onDeleteSelection(selection) {
            // Send request to API
            if (await this.$refs.deleteSelectionDialog.confirm()) {
                // If we have a selection, delete all those selections
                if (this.selectedSelections.length > 1) {
                    for (let i = this.selectedSelections.length - 1; i >= 0; i--) {
                        const selectionToDelete = this.selectedSelections[i]
                        this.deleteSelection(selectionToDelete)
                    }
                    // Reset the selected selections
                    this.selectedSelections = []
                }
                // If we don't have a selection just delete the provided selection
                else {
                    this.deleteSelection(selection)
                }
            }
        },
        clearToEdit() {
            // Clear the current edit
            this.selectionToEdit = null
        },
        clearUnsaved({ selection, parent }) {
            // Check if the selection is saved
            if (!selection.id) {
                this.DELETE_SELECTION(selection)
            }
        },
        async onShowCloneSetupContext(e) {
            // Check if we alreday fetched all files -> else fetch them
            // if (this.allFiles.length <= 0) {
            await this.fetchAllFiles()
            // }
            const contextMenu = this.$refs.contextMenuCloneSetup
            contextMenu.show(e)
        },
        async onClone(file) {
            this.cloningSetup = true
            await this.cloneFileSelections({ destination: this.currentFile, from: file })
            this.cloningSetup = false
            // Force refresh the data, to fetch the cloned selections
            this.initData(true)
            // Clone selections and their users to the new file
            // Fetch file selections
            // const selections = await this.fetchSelections({fileId: file.id, addToState: false})
            // // We have to copy the selection structure as well
            // // This means we have to insert one level of selections at a time
            // // Transform the selections into a tree structure
            // const selectionTree = await this.createSelectionTree(selections)

            // // Loop through all selections and upload them
            // for (const rootSelection of selectionTree) {
            //     await this.cloneSelectionTree(rootSelection)
            // }
            // // Update the settings of all the newly created selection to sync relationsships
            // const newSelectionTree = this.getSelectionsTree
            // console.log('end for. New selections:', newSelectionTree)
            // for (const rootSelection of newSelectionTree) {
            //     this.syncSelectionTreeSettings(rootSelection)
            // }
        },
        async cloneSelectionTree(selection) {
            // Recursive function that calls itself for all children of a selection until there are no more children
            // Make a clone of the selection to upload
            const newSelection = JSON.parse(JSON.stringify(selection))
            // Fetch the selection with its teams and users so we can add them to the clone
            const selectionWithTeamsAndUsers = await this.fetchSelection({
                selectionId: selection.id,
                addToState: false,
            })
            // Set the selection ID to null, so we create a new selection
            newSelection.id = null
            await this.insertSelection({ file: this.currentFile, selection: newSelection })
            // Fetch the selections settings (will be added to the selection as a settings object)
            await this.fetchSelectionSettings(selection)
            // Save selection settings to the new selection
            newSelection.settings = selection.settings
            // Upload the fetched users and teams to our new selection
            if (selectionWithTeamsAndUsers.users.length > 0)
                this.addUsersToSelection({
                    selection: newSelection,
                    users: selectionWithTeamsAndUsers.users,
                    ignoreRole: false,
                })
            // Add denied users
            this.addUsersToSelection({
                selection: newSelection,
                users: selectionWithTeamsAndUsers.denied_users.map(user => {
                    user.role = 'Denied'
                    return user
                }),
                ignoreRole: false,
            })

            if (selectionWithTeamsAndUsers.teams.length > 0)
                this.addTeamsToSelection({ selection: newSelection, teams: selectionWithTeamsAndUsers.teams })

            // Loop through the selections children and repeat
            for (const childSelection of selection.children) {
                // Set the parent id
                childSelection.parent_id = newSelection.id
                await this.cloneSelectionTree(childSelection)
            }
        },
        syncSelectionTreeSettings(selection) {
            // Update the selections settings and loop through its tree and do the same
            this.updateSelectionSettings({ selections: [selection] })
            for (const childSelection of selection.children) {
                this.syncSelectionTreeSettings(childSelection)
            }
        },
        onSendSelectionLink(selection) {
            let selectionsToPost = [selection]
            this.sendSelectionLink({ selectionList: selectionsToPost })
            Vue.set(selection, 'selectionLinkSent', true)
        },
        onToggleAllSelectionsLocked(selections) {
            let makeLocked = null
            selections.map(selection => {
                if (selection.is_presenting) return
                let hasChange = false
                if (makeLocked == null) makeLocked = selection.is_open
                // Check if the selection is locked
                if (makeLocked && !selection.is_open) return
                if (!makeLocked && selection.is_open) return

                if (makeLocked) {
                    selection.open_from = new Date('9999')
                    selection.open_to = null
                    hasChange = true
                } else {
                    selection.open_from = null
                    selection.open_to = null
                    hasChange = true
                }
                if (hasChange) this.updateSelection(selection)
            })
        },
        onToggleAllSelectionsVisibility(selections) {
            // Use the first selection to determine if we are opening or closing all
            let makeHidden = null
            selections.map(selection => {
                if (selection.is_presenting) return
                if (makeHidden == null) makeHidden = selection.is_visible
                let hasChange = false

                if (makeHidden && !selection.is_visible) return
                if (!makeHidden && selection.is_visible) return
                // Check if the selection is visible
                if (makeHidden) {
                    // Set To to now
                    selection.visible_from = new Date('9999')
                    selection.visible_to = null
                    hasChange = true
                } else {
                    selection.visible_from = null
                    selection.visible_to = null
                    hasChange = true
                }
                if (hasChange) this.updateSelection(selection)
            })
        },
        onSendMagicLinkToAll() {
            this.fileSelectionMagicLinkSent = true
            this.sendSelectionLink({ selectionList: this.getSelections })
        },
    },
    created() {
        this.initData()
    },
    destroyed() {
        document.removeEventListener('mousemove', this.moveSelectionMouseFollowHandler)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.selections-table {
    // Target child style
    ::v-deep {
        .flex-table tr:not(.table-top-bar) > * {
            flex: 0 1 auto;
        }
        tr {
            > * {
                &.locked {
                    // Title
                    min-width: 16px;
                    max-width: 16px;
                    margin: 0;
                    i {
                        margin: 0;
                    }
                }
                &.expand {
                    // Title
                    min-width: 48px;
                    max-width: 48px;
                }
                &.title {
                    // Title
                    min-width: 220px;
                    max-width: 220px;
                }
                &.teams {
                    margin-left: auto;
                }
                &.budget {
                    min-width: 100px;
                    max-width: 100px;
                    margin-left: auto;
                    text-align: right;
                }
                &.budget-spend {
                    min-width: 64px;
                    max-width: 64px;
                    text-align: right;
                    padding-right: 8px;
                }
                &.currency {
                    min-width: 100px;
                    max-width: 100px;
                    // margin-left: auto;
                }
                &.teams,
                &.users {
                    min-width: 76px;
                    max-width: 76px;
                }
                &.status {
                    // Status
                    min-width: 156px;
                    max-width: 156px;
                    margin-left: auto;
                    // display: flex;
                    // align-items: center;
                    // > *:not(:first-child) {
                    //     margin-left: 4px;
                    // }
                }
                &.presentation {
                    min-width: 116px;
                    max-width: 116px;
                    margin-left: auto;
                }
                // &.items, &.in, &.out, &.nd {
                //     min-width: 72px;
                //     max-width: 72px;
                // }
                &.action {
                    // Actions
                    min-width: 112px;
                    max-width: 112px;
                    margin-left: auto;
                }
            }
            // > td {
            //     &.budget {
            //         text-align: right;
            //     }
            // }
        }
    }
}
.move-selection-indicator {
    position: fixed;
    display: none;
    background: white;
    padding: 2px 8px;
    box-shadow: 0 3px 8px rgba($dark, 0.2);
    font-weight: 700;
    border-radius: 4px;
    &.active {
        display: block;
    }
}
.setup-wrapper {
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: white;
    margin-bottom: 2px;
    button {
        width: 280px;
    }
    > *:not(:last-child) {
        margin-bottom: 24px;
    }
}
.context-menu.context-options {
    .item-wrapper {
        display: block;
    }
    .footer {
        display: flex;
        justify-content: flex-end;
        .input-field {
            max-width: 208px;
        }
    }
}
</style>
