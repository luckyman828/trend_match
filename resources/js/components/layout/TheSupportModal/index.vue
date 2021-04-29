<template>
    <BaseModal :show="show" @close="$emit('close')" header="Support Accounting">
        <h3>Support hours</h3>
        <p>
            Total (available):
            <template v-if="workspace.resources">
                <BaseEditable v-model="totalSupportMinutes" v-if="isSystemAdmin" @submit="onUpdateResources" />
                <strong v-else>{{ totalSupportMinutes }}</strong>
            </template>
            <template v-else>Fetching..</template>
        </p>
        <p>
            Usage:
            <template v-if="workspace.resources">
                <strong>{{ getPrettyDuration(workspace.resources.support.total_spend_minutes) }}</strong>
            </template>
            <template v-else>Fetching..</template>
        </p>
        <p>
            Remaining:
            <template v-if="workspace.resources">
                <strong>{{ getPrettyDuration(workspace.resources.support.remainingMinutes) }}</strong>
            </template>
            <template v-else>Fetching..</template>
        </p>

        <div class="support-log">
            <div class="header flex-list justify flex-env-v">
                <h4>Support log</h4>
                <BaseButton
                    class="add-new-button"
                    v-if="!isLoading && isSystemAdmin"
                    buttonClass="primary invisible ghost-hover"
                    @click="onAddEntry"
                >
                    <i class="far fa-plus"></i>
                    <span>Add new entry</span>
                </BaseButton>
            </div>

            <BaseLoader v-if="isLoading" msg="Fetching entries" />

            <template v-else>
                <BaseTableV2 class="log-entry-table">
                    <template v-slot:header>
                        <BaseTableHeader>Date</BaseTableHeader>
                        <BaseTableHeader>Message</BaseTableHeader>
                        <BaseTableHeader>Duration</BaseTableHeader>
                        <BaseTableHeader v-if="isSystemAdmin"></BaseTableHeader>
                    </template>

                    <LogListItem
                        :ref="`logItem-${entry.id}`"
                        v-for="entry in supportLogEntries"
                        :key="entry.id"
                        :entry="entry"
                    />
                    <!-- <LogListItem ref="logItem" v-for="(entry, index) in supportLogEntries" :key="index" :entry="entry" /> -->

                    <template v-slot:last v-if="logMeta.page < logMeta.page_count">
                        <tr class="flex-list center-v center-h">
                            <button
                                class="invisible primary ghost-hover"
                                v-if="!loadingLog"
                                @click="onFetchMoreLogEntries"
                            >
                                <span>Load older entries</span>
                            </button>
                            <BaseLoader msg="Loading log entries.." v-else />
                        </tr>
                    </template>

                    <template v-slot:empty>
                        <p>No entries</p>
                    </template>

                    <template v-slot:footer>
                        <td class="flex-list justify" style="width: 100%" v-if="isSystemAdmin">
                            <BaseButton buttonClass="primary invisible ghost-hover" @click="onAddEntry">
                                <i class="far fa-plus"></i>
                                <span>Add Entry</span>
                            </BaseButton>
                        </td>
                        <td></td>
                    </template>
                </BaseTableV2>
            </template>
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import LogListItem from './LogListItem'

export default {
    name: 'theSupportModal',
    components: { LogListItem },
    props: ['show'],
    data() {
        return {
            isLoading: false,
            loadingLog: false,
        }
    },
    computed: {
        ...mapGetters('auth', {
            isSystemAdmin: 'getIsSystemAdmin',
        }),
        ...mapGetters('supportLog', {
            supportLogEntries: 'getLogEntries',
            logMeta: 'getLogEntryMeta',
        }),
        ...mapGetters('workspaces', {
            workspaceId: 'getCurrentWorkspaceId',
            workspace: 'getCurrentWorkspace',
        }),
        totalSupportMinutes: {
            get() {
                return this.getPrettyDuration(this.workspace.resources.support.available_minutes)
            },
            set(newVal) {
                const newNumber = parseInt(newVal)
                if (typeof newNumber != 'number') {
                    this.SHOW_SNACKBAR({
                        type: 'info',
                        msg: 'Whole minutes only please',
                        iconClass: 'far fa-info-circle',
                    })
                    return
                }
                const increment = 15
                const newDuration = Math.round(newNumber / increment) * increment
                this.workspace.resources.support.available_minutes = newDuration
            },
        },
    },
    watch: {
        show(isVisible) {
            if (isVisible) {
                this.init()
            }
        },
    },
    methods: {
        ...mapActions('supportLog', ['instantiateBaseLogEntry', 'fetchLogEntries', 'fetchWorkspaceSupportMinutes']),
        ...mapActions('workspaces', ['fetchWorkspaceResources', 'updateWorkspaceResources']),
        ...mapMutations('supportLog', ['INSERT_LOG_ENTRY', 'REMOVE_LOG_ENTRY']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async init() {
            this.isLoading = true
            await this.fetchWorkspaceSupportMinutes(this.workspace)
            await this.fetchLogEntries({ workspaceId: this.workspaceId })
            // await this.fetchWorkspaceResources(this.workspace)
            console.log('done loading', this.logMeta)
            this.isLoading = false
        },
        async onAddEntry() {
            const newEntry = await this.instantiateBaseLogEntry()
            this.INSERT_LOG_ENTRY(newEntry)
            this.workspace.resources.support.total_spend_minutes += newEntry.duration

            // Wait the new el to be visible
            await this.$nextTick()
            const newComp = this.$refs[`logItem-null`][0]
            newComp.$refs.messageInput.setActive()
        },
        async onUpdateResources() {
            await this.updateWorkspaceResources(this.workspace)
        },
        async onFetchMoreLogEntries() {
            this.loadingLog = true
            await this.fetchLogEntries({ workspaceId: this.workspaceId, pageIndex: this.logMeta.page + 1 })
            this.loadingLog = false
        },
    },
    created() {
        this.init()
    },
}
</script>

<style lang="scss" scoped>
.editable {
    display: inline-block;
    font-weight: 700;
}
.add-new-button {
    margin-bottom: 8px;
}
.log-entry-table {
    max-height: 200px;
    overflow-y: auto;
    // &::v-deep {
    //     .header {
    //         background: purple;
    //     }
    //     tbody {
    //         max-height: 200px;
    //         overflow-y: auto;
    //     }
    // }
}
</style>
