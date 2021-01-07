<template>
    <BaseContextMenu ref="contextMenu" class="context-settings" columns="4" @hide="$emit('hide')">
        <template v-slot:header v-if="selection">
            <span
                >Settings: {{ selection.name }}
                <template v-if="settingsSelections.length > 1"> + {{ settingsSelections.length - 1 }} more</template>
            </span>
        </template>
        <template v-slot="slotProps" v-if="settingsSelections.length > 0">
            <!-- If loading -->
            <div class="loading-wrapper" v-if="loading">
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
                                        x => x.value == selection.settings.feedback.broadcast.parent_level
                                    ).label
                                "
                                @click="showParentLevelContext($event, selection.settings.feedback.broadcast)"
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
                                        x => x.value == selection.settings.feedback.broadcast.child_level
                                    ).label
                                "
                                @click="showChildLevelContext($event, selection.settings.feedback.broadcast)"
                            >
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField>
                        </div>

                        <div class="item-wrapper">
                            <label class="settings-label">Broadcast to Siblings</label>
                            <BaseCheckboxInputField v-model="selection.settings.feedback.broadcast.sibling">
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
                                        x => x.value == selection.settings.feedback.listen.parent_level
                                    ).label
                                "
                                @click="showParentLevelContext($event, selection.settings.feedback.listen)"
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
                                        x => x.value == selection.settings.feedback.listen.child_level
                                    ).label
                                "
                                @click="showChildLevelContext($event, selection.settings.feedback.listen)"
                            >
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField>
                        </div>

                        <div class="item-wrapper">
                            <label class="settings-label">Listen to Siblings</label>
                            <BaseCheckboxInputField v-model="selection.settings.feedback.listen.sibling">
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
                                    displayLevelOptions.find(x => x.value == selection.settings.feedback_visible).label
                                "
                                @click="showDisplayLevelContext($event, selection.settings, 'feedback_visible')"
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
                                    displayAuthorOptions.find(x => x.value == selection.settings.anonymize_feedback)
                                        .label
                                "
                                @click="showDisplayAuthorContext($event, selection.settings, 'anonymize_feedback')"
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
                                        x => x.value == selection.settings.action.broadcast.parent_level
                                    ).label
                                "
                                @click="showParentLevelContext($event, selection.settings.action.broadcast)"
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
                                        x => x.value == selection.settings.action.broadcast.child_level
                                    ).label
                                "
                                @click="showChildLevelContext($event, selection.settings.action.broadcast)"
                            >
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField>
                        </div>

                        <div class="item-wrapper">
                            <label class="settings-label">Broadcast to Siblings</label>
                            <BaseCheckboxInputField v-model="selection.settings.action.broadcast.sibling">
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
                                        x => x.value == selection.settings.action.listen.parent_level
                                    ).label
                                "
                                @click="showParentLevelContext($event, selection.settings.action.listen)"
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
                                    childLevelOptions.find(x => x.value == selection.settings.action.listen.child_level)
                                        .label
                                "
                                @click="showChildLevelContext($event, selection.settings.action.listen)"
                            >
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField>
                        </div>

                        <div class="item-wrapper">
                            <label class="settings-label">Listen to Siblings</label>
                            <BaseCheckboxInputField v-model="selection.settings.action.listen.sibling">
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
                                    displayLevelOptions.find(x => x.value == selection.settings.action_visible).label
                                "
                                @click="showDisplayLevelContext($event, selection.settings, 'action_visible')"
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
                                    displayAuthorOptions.find(x => x.value == selection.settings.anonymize_action).label
                                "
                                @click="showDisplayAuthorContext($event, selection.settings, 'anonymize_action')"
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
                                        x => x.value == selection.settings.comment.broadcast.parent_level
                                    ).label
                                "
                                @click="showParentLevelContext($event, selection.settings.comment.broadcast)"
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
                                        x => x.value == selection.settings.comment.broadcast.child_level
                                    ).label
                                "
                                @click="showChildLevelContext($event, selection.settings.comment.broadcast)"
                            >
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField>
                        </div>

                        <div class="item-wrapper">
                            <label class="settings-label">Broadcast to Siblings</label>
                            <BaseCheckboxInputField v-model="selection.settings.comment.broadcast.sibling">
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
                                        x => x.value == selection.settings.comment.listen.parent_level
                                    ).label
                                "
                                @click="showParentLevelContext($event, selection.settings.comment.listen)"
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
                                        x => x.value == selection.settings.comment.listen.child_level
                                    ).label
                                "
                                @click="showChildLevelContext($event, selection.settings.comment.listen)"
                            >
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField>
                        </div>

                        <div class="item-wrapper">
                            <label class="settings-label">Listen to Siblings</label>
                            <BaseCheckboxInputField v-model="selection.settings.comment.listen.sibling">
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
                                    displayLevelOptions.find(x => x.value == selection.settings.comment_visible).label
                                "
                                @click="showDisplayLevelContext($event, selection.settings, 'comment_visible')"
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
                                    displayAuthorOptions.find(x => x.value == selection.settings.anonymize_comment)
                                        .label
                                "
                                @click="showDisplayAuthorContext($event, selection.settings, 'anonymize_comment')"
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
                                        x => x.value == selection.settings.request.broadcast.parent_level
                                    ).label
                                "
                                @click="showParentLevelContext($event, selection.settings.request.broadcast)"
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
                                        x => x.value == selection.settings.request.broadcast.child_level
                                    ).label
                                "
                                @click="showChildLevelContext($event, selection.settings.request.broadcast)"
                            >
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField>
                        </div>

                        <div class="item-wrapper">
                            <label class="settings-label">Broadcast to Siblings</label>
                            <BaseCheckboxInputField v-model="selection.settings.request.broadcast.sibling">
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
                                        x => x.value == selection.settings.request.listen.parent_level
                                    ).label
                                "
                                @click="showParentLevelContext($event, selection.settings.request.listen)"
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
                                        x => x.value == selection.settings.request.listen.child_level
                                    ).label
                                "
                                @click="showChildLevelContext($event, selection.settings.request.listen)"
                            >
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField>
                        </div>

                        <div class="item-wrapper">
                            <label class="settings-label">Listen to Siblings</label>
                            <BaseCheckboxInputField v-model="selection.settings.request.listen.sibling">
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
                                    displayLevelOptions.find(x => x.value == selection.settings.request_visible).label
                                "
                                @click="showDisplayLevelContext($event, selection.settings, 'request_visible')"
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
                                    displayAuthorOptions.find(x => x.value == selection.settings.anonymize_request)
                                        .label
                                "
                                @click="showDisplayAuthorContext($event, selection.settings, 'anonymize_request')"
                            >
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField>
                        </div>
                        <div class="item-wrapper">
                            <label class="settings-label">Can make tickets</label>
                            <BaseInputField
                                disabled="true"
                                type="select"
                                :value="ticketLevelOptions.find(x => x.value == selection.settings.ticket_level).label"
                                @click="showTicketLevelContext($event, selection.settings, 'ticket_level')"
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
                            :options="allSelections.filter(x => x.id != selection.id)"
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
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'selectionSettingsContextMenu',
    props: ['selection', 'settingsSelections'],
    data: function() {
        return {
            loading: true,
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
            ],
        }
    },
    methods: {
        ...mapActions('selections', ['fetchSelectionSettings', 'updateSelectionSettings']),
        async show(mouseEvent) {
            await this.init()
            this.$nextTick(() => {
                this.$refs.contextMenu.show(mouseEvent)
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
            this.$set(this.selection, 'settings', settingsToClone)
        },
        onSaveSelectionSettings() {
            // Send API request to update the selections settings.
            if (this.settingsSelections.length > 1) {
                this.settingsSelections.map(selection => {
                    // Set the selection settings of this selection to a copy of the context selection's
                    // Use Vue.set to instantiate 'settings' as a reactive property on the selection
                    Vue.set(selection, 'settings', JSON.parse(JSON.stringify(this.selection.settings)))
                })
                this.updateSelectionSettings({ selections: this.settingsSelections })
            } else {
                this.updateSelectionSettings({ selections: [this.selection] })
            }
        },
        async init() {
            // Load the selections settings
            this.loading = true
            await this.fetchSelectionSettings(this.selection)
            this.loading = false
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.context-menu.context-settings {
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
