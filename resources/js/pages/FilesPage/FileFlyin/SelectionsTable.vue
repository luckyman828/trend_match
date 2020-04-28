<template>
    <div class="selections-table">
        <BaseFlexTable class="flex-table-root">
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:right>
                        <span>{{selections.length}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="locked"></BaseTableHeader>
                <BaseTableHeader class="expand"></BaseTableHeader>
                <BaseTableHeader class="title">Name</BaseTableHeader>
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
                    <template v-if="selections.length > 0">
                        <SelectionsTableRow :ref="'selection-row-'+selection.id" v-for="selection in selections" :key="selection.id"
                        :selection="selection" :depth="0" :path="[selection.id]" :moveSelectionActive="moveSelectionActive" :file="currentFile"
                        :selectionToEdit="selectionToEdit" :isMaster="selection.type == 'Master'"
                        @submitToEdit="clearToEdit" @cancelToEdit="clearUnsaved($event);clearToEdit()"
                        @showSelectionUsersFlyin="$emit('showSelectionUsersFlyin',$event)" @showContext="showContextMenuSelection"
                        @endMoveSelection="endMoveSelection" @showSettingsContext="showSettingsContext" @onClick="rowClick"
                        @showSelectionCurrencyContext="showSelectionCurrencyContext"/>
                    </template>
                    <!-- No selections  -->
                    <template v-else>
                        <div class="setup-wrapper">
                            <!-- Admin -->
                            <template v-if="authUserWorkspaceRole == 'Admin'">
                                <button class="primary lg"
                                @click="onShowCloneSetupContext">
                                    <i class="fas fa-clone"></i>
                                    <span>Copy Setup From Existing File</span>
                                </button>
                                <button class="primary ghost lg"
                                @click="onNewSelection()">
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
                    <BaseButton buttonClass="primary invisible" :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create new selections'"
                    @click="onNewSelection()">
                        <i class="far fa-plus"></i><span>Add new: Master Selection</span>
                    </BaseButton>
                </td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuSelection" class="context-selection"
        :hotkeys="['KeyG', 'KeyR', 'KeyM', 'KeyC', 'KeyS', 'KeyD']"
        @keybind-g="$router.push({name: 'selection', params: {fileId: contextSelection.file_id, selectionId: contextSelection.id}})"
        @keybind-r="selectionToEdit = {selection: contextSelection, field: 'name'}"
        @keybind-m="$emit('showSelectionUsersFlyin', contextSelection)"
        @keybind-c="onNewSelection(contextSelection)"
        @keybind-s="showSettingsContext(contextMouseEvent, contextSelection)"
        @keybind-d="onDeleteSelection(contextSelection, contextSelectionParent)">
            <div class="item-group">
                <div class="item" @click="$router.push({name: 'selection', params: {fileId: contextSelection.file_id, selectionId: contextSelection.id}})">
                    <div class="icon-wrapper">
                        <i class="far fa-users"></i>
                    </div>
                    <u>G</u>o to selection 
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="selectionToEdit = {selection: contextSelection, field: 'name'}">
                    <div class="icon-wrapper"><i class="far fa-pen"></i></div>
                    <u>R</u>ename
                </div>
                <div class="item" @click="$emit('showSelectionUsersFlyin', contextSelection)">
                    <div class="icon-wrapper"><i class="far fa-user-cog"></i></div>
                    <u>M</u>embers and Access
                </div>
                <div class="item" @click="onNewSelection(contextSelection)">
                    <div class="icon-wrapper"><i class="far fa-plus"></i></div>
                    <u>C</u>reate sub-selection
                </div>
                <!-- <div class="item" v-if="contextSelection && !contextSelection.master"
                @click="onMoveSelection(contextSelection, contextSelectionParent)">
                    <div class="icon-wrapper"><i class="far fa-file"><i class="fas fa-long-arrow-alt-right"></i></i></div>
                    <u>M</u>ove selection
                </div> -->
            </div>
            <div class="item-group">
                <div class="item" @click.stop="showSettingsContext(contextMouseEvent, contextSelection)">
                    <div class="icon-wrapper"><i class="far fa-cog"></i></div>
                    <u>S</u>ettings
                </div>
            </div>
            <div class="item-group" @click="onDeleteSelection(contextSelection, contextSelectionParent)">
                <div class="item">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>D</u>elete selection
                </div>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuMove" class="context-move">
            <div class="item-group" v-if="contextSelectionComponent && selectionToMove && !contextSelectionComponent.path.includes(selectionToMove.id)"
            @click="endMoveSelection(contextSelection, contextSelectionComponent)">
                <div class="item">
                    <div class="icon-wrapper">
                        <i class="far fa-arrow-left"></i>
                    </div>
                    <u>M</u>ove here
                </div>
            </div>
            <div class="item-group" v-else-if="contextSelectionComponent && selectionToMove">
                <div class="item disabled">
                    <div class="icon-wrapper">
                        <i class="far fa-exclamation-circle"></i>
                    </div>
                    Cannot place inside self
                </div>
            </div>
            <div class="item-group" @click="clearMoveSelection">
                <div class="item">
                    <div class="icon-wrapper"><i class="far fa-times"></i></div>
                    <u>C</u>ancel
                </div>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuOptions" class="context-options" columns="4">
            <template v-slot:header v-if="contextSelection">
                Settings: {{contextSelection.name}}
            </template>
            <template v-slot="slotProps">
                <!-- If loading -->
                <div class="loading-wrapper" v-if="loadingSelectionSettings">
                    <BaseLoader/>
                </div>
                <!-- if ready -->
                <div class="columns" v-else>
                    <!-- Feedback -->
                    <div class="item-group">
                        <div class="item-group">
                            <strong class="header">Feedback Actions</strong>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Up</label>
                                <BaseInputField disabled=true type="select" 
                                :value="parentLevelOptions.find(x => x.value == contextSelection.settings.feedback.broadcast.parent_level).label"
                                @click="showParentLevelContext($event, contextSelection.settings.feedback.broadcast)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Down</label>
                                <BaseInputField disabled=true type="select" 
                                :value="childLevelOptions.find(x => x.value == contextSelection.settings.feedback.broadcast.child_level).label"
                                @click="showChildLevelContext($event, contextSelection.settings.feedback.broadcast)">
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
                                <BaseInputField disabled=true type="select" 
                                :value="parentLevelOptions.find(x => x.value == contextSelection.settings.feedback.listen.parent_level).label"
                                @click="showParentLevelContext($event, contextSelection.settings.feedback.listen)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen Down</label>
                                <BaseInputField disabled=true type="select" 
                                :value="childLevelOptions.find(x => x.value == contextSelection.settings.feedback.listen.child_level).label"
                                @click="showChildLevelContext($event, contextSelection.settings.feedback.listen)">
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
                                <BaseInputField disabled=true type="select" 
                                :value="displayLevelOptions.find(x => x.value == contextSelection.settings.feedback_visible).label"
                                @click="showDisplayLevelContext($event, contextSelection.settings, 'feedback_visible')">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                            <div class="item-wrapper">
                                <label class="settings-label">Display feedback authors for
                                    <i class="far fa-info-circle" 
                                    v-tooltip="'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'"></i>
                                :</label>
                                <BaseInputField disabled=true type="select" 
                                :value="displayLevelOptions.find(x => x.value == contextSelection.settings.anonymize_feedback).label"
                                @click="showDisplayLevelContext($event, contextSelection.settings, 'anonymize_feedback')">
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
                                <BaseInputField disabled=true type="select" 
                                :value="parentLevelOptions.find(x => x.value == contextSelection.settings.action.broadcast.parent_level).label"
                                @click="showParentLevelContext($event, contextSelection.settings.action.broadcast)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Down</label>
                                <BaseInputField disabled=true type="select" 
                                :value="childLevelOptions.find(x => x.value == contextSelection.settings.action.broadcast.child_level).label"
                                @click="showChildLevelContext($event, contextSelection.settings.action.broadcast)">
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
                                <BaseInputField disabled=true type="select" 
                                :value="parentLevelOptions.find(x => x.value == contextSelection.settings.action.listen.parent_level).label"
                                @click="showParentLevelContext($event, contextSelection.settings.action.listen)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen Down</label>
                                <BaseInputField disabled=true type="select" 
                                :value="childLevelOptions.find(x => x.value == contextSelection.settings.action.listen.child_level).label"
                                @click="showChildLevelContext($event, contextSelection.settings.action.listen)">
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
                                <BaseInputField disabled=true type="select" 
                                :value="displayLevelOptions.find(x => x.value == contextSelection.settings.action_visible).label"
                                @click="showDisplayLevelContext($event, contextSelection.settings, 'action_visible')">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                            <div class="item-wrapper">
                                <label class="settings-label">Display alignment authors for
                                    <i class="far fa-info-circle" 
                                    v-tooltip="'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'"></i>
                                :</label>
                                <BaseInputField disabled=true type="select" 
                                :value="displayLevelOptions.find(x => x.value == contextSelection.settings.anonymize_action).label"
                                @click="showDisplayLevelContext($event, contextSelection.settings, 'anonymize_action')">
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
                                <BaseInputField disabled=true type="select" 
                                :value="parentLevelOptions.find(x => x.value == contextSelection.settings.comment.broadcast.parent_level).label"
                                @click="showParentLevelContext($event, contextSelection.settings.comment.broadcast)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Down</label>
                                <BaseInputField disabled=true type="select" 
                                :value="childLevelOptions.find(x => x.value == contextSelection.settings.comment.broadcast.child_level).label"
                                @click="showChildLevelContext($event, contextSelection.settings.comment.broadcast)">
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
                                <BaseInputField disabled=true type="select" 
                                :value="parentLevelOptions.find(x => x.value == contextSelection.settings.comment.listen.parent_level).label"
                                @click="showParentLevelContext($event, contextSelection.settings.comment.listen)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen Down</label>
                                <BaseInputField disabled=true type="select" 
                                :value="childLevelOptions.find(x => x.value == contextSelection.settings.comment.listen.child_level).label"
                                @click="showChildLevelContext($event, contextSelection.settings.comment.listen)">
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
                                <BaseInputField disabled=true type="select" 
                                :value="displayLevelOptions.find(x => x.value == contextSelection.settings.comment_visible).label"
                                @click="showDisplayLevelContext($event, contextSelection.settings, 'comment_visible')">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                            <div class="item-wrapper">
                                <label class="settings-label">Display comment authors for
                                    <i class="far fa-info-circle" 
                                    v-tooltip="'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'"></i>
                                :</label>
                                <BaseInputField disabled=true type="select" 
                                :value="displayLevelOptions.find(x => x.value == contextSelection.settings.anonymize_comment).label"
                                @click="showDisplayLevelContext($event, contextSelection.settings, 'anonymize_comment')">
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
                                <BaseInputField disabled=true type="select" 
                                :value="parentLevelOptions.find(x => x.value == contextSelection.settings.request.broadcast.parent_level).label"
                                @click="showParentLevelContext($event, contextSelection.settings.request.broadcast)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Broadcast Down</label>
                                <BaseInputField disabled=true type="select" 
                                :value="childLevelOptions.find(x => x.value == contextSelection.settings.request.broadcast.child_level).label"
                                @click="showChildLevelContext($event, contextSelection.settings.request.broadcast)">
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
                                <BaseInputField disabled=true type="select" 
                                :value="parentLevelOptions.find(x => x.value == contextSelection.settings.request.listen.parent_level).label"
                                @click="showParentLevelContext($event, contextSelection.settings.request.listen)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>

                            <div class="item-wrapper">
                                <label class="settings-label">Listen Down</label>
                                <BaseInputField disabled=true type="select" 
                                :value="childLevelOptions.find(x => x.value == contextSelection.settings.request.listen.child_level).label"
                                @click="showChildLevelContext($event, contextSelection.settings.request.listen)">
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
                                <BaseInputField disabled=true type="select" 
                                :value="displayLevelOptions.find(x => x.value == contextSelection.settings.request_visible).label"
                                @click="showDisplayLevelContext($event, contextSelection.settings, 'request_visible')">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                            <div class="item-wrapper">
                                <label class="settings-label">Display request authors for
                                    <i class="far fa-info-circle" 
                                    v-tooltip="'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'"></i>
                                :</label>
                                <BaseInputField disabled=true type="select" 
                                :value="displayLevelOptions.find(x => x.value == contextSelection.settings.anonymize_request).label"
                                @click="showDisplayLevelContext($event, contextSelection.settings, 'anonymize_request')">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="item-group footer">
                    <div class="item-wrapper" style="display: flex; justify-content: space-between; width: 100%;">
                        <div>
                            <button class="ghost primary"
                            @click="onCloneSettings">
                                <i class="far fa-clone"></i><span>Clone settings from another Selection</span>
                            </button>
                        </div>
                        <div style="text-align: right;">
                            <button class="primary" @click="onSaveSelectionSettings(); slotProps.hide()"><span>Save</span></button>
                            <button class="invisible ghost-hover" @click="slotProps.hide()"><span>Cancel</span></button>
                        </div>
                    </div>
                </div>

                <BaseContextMenu ref="contextParentLevel" v-slot="slotProps">
                    <BaseSelectButtons type="radio" :submitOnChange="true"
                    v-model="contextSelectionOption.parent_level" @submit="slotProps.hide"
                    :options="parentLevelOptions" :optionNameKey="'label'"
                    :optionValueKey="'value'"/>
                </BaseContextMenu>

                <BaseContextMenu ref="contextChildLevel" v-slot="slotProps">
                    <BaseSelectButtons type="radio" :submitOnChange="true"
                    v-model="contextSelectionOption.child_level" @submit="slotProps.hide"
                    :options="childLevelOptions" :optionNameKey="'label'"
                    :optionValueKey="'value'"/>
                </BaseContextMenu>

                <BaseContextMenu ref="contextDisplayLevel" v-slot="slotProps">
                    <BaseSelectButtons type="radio" :submitOnChange="true"
                    v-model="contextSelectionSettings[contextSelectionSettingsKey]" @submit="slotProps.hide"
                    :options="displayLevelOptions" :optionNameKey="'label'"
                    :optionValueKey="'value'"/>
                </BaseContextMenu>

                <BaseContextMenu ref="contextCloneSettings" class="context-clone-settings">
                    <template v-slot:header>
                        <span>Select selections to copy settings from</span>
                    </template>
                    <template v-slot="innerSlotProps">
                        <div class="item-group">
                            <BaseSelectButtons type="radio" search="true" :options="allSelections.filter(x => x.id != contextSelection.id)"
                            optionNameKey="name" v-model="selectionToCloneSettingsFrom" :submitOnChange="true"/>
                        </div>
                        <div class="item-group">
                            <div class="item-wrapper">
                                <button class="primary" @click="cloneSettings(); innerSlotProps.hide()"><span>Clone</span></button>
                                <button class="invisible ghost-hover" style="margin-left: 8px;"
                                @click="innerSlotProps.hide()">
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    </template>
                </BaseContextMenu>
            </template>
        </BaseContextMenu>


        <div ref="moveSelectionIndicator" class="move-selection-indicator" :class="{'active': moveSelectionActive}">
            <span>Click selection to move to</span>
        </div>

        <BaseContextMenu ref="contextMenuCloneSetup" class="context-move">
            <template v-slot:header>
                <span>Select file to copy selections from</span>
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons type="radio" search="true" :options="allFiles.filter(x => x.type == 'File')"
                    optionNameKey="name" v-model="fileToClone" :submitOnChange="true"/>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary" @click="onClone(fileToClone)"><span>Clone</span></button>
                        <button class="invisible ghost-hover" style="margin-left: 8px;"
                        @click="slotProps.hide()">
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu v-if="contextSelection" ref="contextCurrency" 
        header="Change Selection Currency"
        v-model="contextSelection.currency" unsetOption="Clear" :unsetValue="null"
        type="radio" :options="availableCurrencies" :search="true"
        @submit="updateSelection(contextSelection)"/>
        
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import SelectionsTableRow from './SelectionsTableRow'
import sortArray from '../../../mixins/sortArray'

export default {
    name: 'selectionsTable',
    props: [
        'selections',
    ],
    components: {
        SelectionsTableRow,
    },
    mixins: [
        sortArray
    ],
    data: function() { return {
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
                label: 'All'
            },
            {
                value: 'Parent',
                label: 'Parent'
            },
            {
                value: 'None',
                label: 'None'
            },
        ],
        childLevelOptions: [
            {
                value: 'Descendants',
                label: 'All'
            },
            {
                value: 'Children',
                label: 'Children'
            },
            {
                value: 'None',
                label: 'None'
            },
        ],
        displayLevelOptions: [
            {
                value: 'Member',
                label: 'Everyone'
            },
            {
                value: 'Owner',
                label: 'Owners'
            },
            {
                value: 'None',
                label: 'No one'
            },
        ]
    }},
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('files', ['currentFile', 'files', 'allFiles']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        ...mapGetters('selections', {allSelections: ['selections']}),
        ...mapGetters('selections', ['getAuthUserHasSelectionEditAccess']),
    },
    methods: {
        ...mapActions('selections', ['fetchSelections', 'createSelectionTree', 'insertSelection',
        'updateSelection', 'addTeamsToSelection', 'addUsersToSelection', 'fetchSelection', 
        'fetchSelectionSettings', 'updateSelectionSettings', 'deleteSelection']),
        ...mapMutations('selections', ['insertSelections', 'REMOVE_SELECTION']),
        ...mapActions('files', ['fetchAllFiles']),
        onSort(sortAsc, sortKey) {
            this.sortKey = sortKey
            this.sortArray(this.selections, sortAsc, sortKey)
        },
        rowClick(e, component) {
            if (this.moveSelectionActive) {
                e.stopPropagation()
                this.endMoveSelection(component.selection, component)
            }
        },
        async showSettingsContext(e, selection) {
            // Load the selections settings
            this.loadingSelectionSettings = true
            await this.fetchSelectionSettings(selection)
            this.loadingSelectionSettings = false

            const contextMenu = this.$refs.contextMenuOptions
            this.contextSelection = selection
            // Position the contextual menu
            contextMenu.show(e)
        },
        showSelectionCurrencyContext({selection, e}) {
            this.contextSelection = selection
            this.$nextTick(() => {
                this.$refs.contextCurrency.show(e)
            })
        },
        showParentLevelContext(e, option) {
            this.contextSelectionOption = option
            this.$refs.contextChildLevel.hide()
            this.$refs.contextDisplayLevel.hide()
            this.$refs.contextParentLevel.show(e)
        },
        showChildLevelContext(e, option) {
            this.contextSelectionOption = option
            this.$refs.contextParentLevel.hide()
            this.$refs.contextDisplayLevel.hide()
            this.$refs.contextChildLevel.show(e)
        },
        showDisplayLevelContext(e, settings, key) {
            this.contextSelectionSettings = settings
            this.contextSelectionSettingsKey = key
            this.$refs.contextParentLevel.hide()
            this.$refs.contextChildLevel.hide()
            this.$refs.contextDisplayLevel.show(e)
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
            this.updateSelectionSettings(this.contextSelection)
        },
        showContextMenuSelection(e, selection, component, parent) {
            if (!this.getAuthUserHasSelectionEditAccess(selection)) return
            e.preventDefault()
            // Set the current context menu item
            this.contextSelection = selection
            this.contextSelectionComponent = component
            this.contextSelectionParent = parent
            // Save a reference to the clicked element
            this.contextMouseEvent = e

            // Show the move context instead if we are in the proces of moving something
            if(this.moveSelectionActive) {
                this.showContextMenuMove(e)
            } else {
                const selectionContext = this.$refs.contextMenuSelection
                // Position the contextual menu
                selectionContext.show(e)
            }
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
                    const index = this.selections.findIndex(x => x.id == this.selectionToMove.id)
                    this.selections.splice(index, 1)
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
        async onNewSelection(parent) {
            // First check that we don't already have an unsaved new selection
            if (this.selections.find(x => x.id == null)) return
            // Else instantiate a new master object in the table
            const newSelection = {
                id: null,
                file_id: this.currentFile.id,
                name: '',
                type: 'Master',
                currency: null,
                user_count: 0,
                team_count: 0,
                children: [],
                visible_from: null,
                visible_to: null,
                open_from: null,
                open_to: null,
                completed_at: null,
            }
            // Push new selection to the parent
            if (parent) {
                // If we are creating a sbu selection
                newSelection.name = 'New Sub Selection'
                newSelection.parent_id = parent.id
                newSelection.type = 'Normal'
                // Instantiate a children array on the parent
                if (!parent.children) {
                    this.$set(parent, 'children', [])
                }
                // parent.children.push(newSelection)
                this.insertSelections({selections: [newSelection], method: 'add'})
                // Expand the selection the new selection is added to
                // Loop through the children to find the selectionrow in question
                this.contextSelectionComponent.childrenExpanded = true
            } else {
                // If no parent, we are creating a new master
                newSelection.name = 'New Master Selection'
                newSelection.parent_id = 0
                // this.selections.push(newSelection)
                this.insertSelections({selections: [newSelection], method: 'add'})
            }
            // Wait for changes to the dom to take effect
            this.$nextTick(() => {
                // Activate title edit of new folder
                this.selectionToEdit = {selection: newSelection, field: 'name'}
            })
        },
        onDeleteSelection(selection) {
            // Send request to API
            if (selection.children.length > 0 && !confirm('Are you sure you want to delete a selection with sub-selection? All the sub-selections will be deleted as well.')) {
                return
            }
            this.deleteSelection(selection)
        },
        clearToEdit() {
            // Clear the current edit
            this.selectionToEdit = null
        },
        clearUnsaved({selection, parent}) {
            // Check if the selection is saved
            if (!selection.id) {
                this.REMOVE_SELECTION(selection)
            }
        },
        async onShowCloneSetupContext(e) {
            // Check if we alreday fetched all files -> else fetch them
            if (this.allFiles.length <= 0) {
                await this.fetchAllFiles()
            }
            const contextMenu = this.$refs.contextMenuCloneSetup
            contextMenu.show(e)
        },
        async onClone(file) {
            // console.log(file)
            // Clone selections and their users to the new file
            // Fetch file selections
            const selections = await this.fetchSelections({fileId: file.id, addToState: false})
            // We have to copy the selection structure as well
            // This means we have to insert one level of selections at a time
            // Transform the selections into a tree structure 
            const selectionTree = await this.createSelectionTree(selections)
            // Loop through all selections and upload them
            selectionTree.forEach(rootSelection => {
                this.cloneSelectionTree(rootSelection)
            })
        },
        async cloneSelectionTree(selection) {
            // Recursive function that calls itself for all children of a selection until there are no more children
            // Make a clone of the selection to upload
            const newSelection = JSON.parse(JSON.stringify(selection))
            // Fetch the selection with its teams and users so we can add them to the clone
            const selectionWithTeamsAndUsers = await this.fetchSelection({selectionId: selection.id, addToState: false})
            // Set the selection ID to null, so we create a new selection
            newSelection.id = null
            await this.insertSelection({file: this.currentFile, selection: newSelection})
            // Fetch the selections settings (will be added to the selection as a settings object)
            await this.fetchSelectionSettings(selection)
            // Save selection settings to the new selection
            newSelection.settings = selection.settings
            this.updateSelectionSettings(newSelection)
            // Upload the fetched users and teams to our new selection
            if (selectionWithTeamsAndUsers.users.length > 0) 
                this.addUsersToSelection({selection: newSelection, users: selectionWithTeamsAndUsers.users, ignoreRole: false})
                // Add denied users
                this.addUsersToSelection({
                    selection: newSelection, 
                    users: selectionWithTeamsAndUsers.denied_users.map(user => {
                        user.role = 'Denied'
                        return user
                    }), 
                    ignoreRole: false
                })

            if (selectionWithTeamsAndUsers.teams.length > 0) 
                this.addTeamsToSelection({selection: newSelection, teams: selectionWithTeamsAndUsers.teams})

            // Loop through the selections children and repeat
            selection.children.forEach(childSelection => {
                // Set the parent id
                childSelection.parent_id = newSelection.id
                this.cloneSelectionTree(childSelection)
            })
        }
    },
    destroyed() {
        document.removeEventListener('mousemove', this.moveSelectionMouseFollowHandler)
    }
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
                    &.locked { // Title
                        min-width: 16px;
                        max-width: 16px;
                        margin: 0;
                        i {
                            margin: 0;
                        }
                    }
                    &.expand { // Title
                        min-width: 48px;
                        max-width: 48px
                    }
                    &.title { // Title
                        min-width: 300px;
                        max-width: 300px;
                    }
                    &.teams {
                        margin-left: auto;
                    }
                    &.currency {
                        min-width: 100px;
                        max-width: 100px;
                        margin-left: auto;
                    }
                    &.teams, &.users {
                        min-width: 76px;
                        max-width: 76px;
                    }
                    &.status { // Status
                        min-width: 180px;
                        max-width: 180px;
                        margin-left: auto;
                        // display: flex;
                        // align-items: center;
                        // > *:not(:first-child) {
                        //     margin-left: 4px;
                        // }
                    }
                    &.presentation {
                        min-width: 72px;
                        max-width: 72px;
                        margin-left: auto;
                    }
                    // &.items, &.in, &.out, &.nd {
                    //     min-width: 72px;
                    //     max-width: 72px;
                    // }
                    &.action { // Actions
                        min-width: 112px;
                        max-width: 112px;
                        margin-left: auto;
                    }
                }
            }
        }
    }
    .move-selection-indicator {
        position: fixed;
        display: none;
        background: white;
        padding: 2px 8px;
        box-shadow: 0 3px 8px rgba($dark,0.2);
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