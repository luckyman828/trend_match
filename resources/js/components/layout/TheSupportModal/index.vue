<template>
    <BaseModal :show="show" @close="$emit('close')" header="Support Accounting">
        <h3>Support hours</h3>
        <p>
            Remaining:
            <template v-if="workspace.resources">
                <BaseEditable v-model="supportMinutesRemaining" v-if="isSystemAdmin" @submit="onUpdateResources" />
                <strong v-else>{{ workspace.resources.support_min }}</strong>
            </template>
            <template v-else>Fetching..</template>
        </p>
        <div class="support-log">
            <h4>Support log</h4>

            <BaseLoader v-if="isLoading" msg="Fetching entries" />

            <BaseTableV2 v-else class="log-entry-table">
                <template v-slot:header>
                    <BaseTableHeader>Date</BaseTableHeader>
                    <BaseTableHeader>Message</BaseTableHeader>
                    <BaseTableHeader>Duration</BaseTableHeader>
                    <BaseTableHeader v-if="isSystemAdmin"></BaseTableHeader>
                </template>

                <LogListItem v-for="entry in supportLogEntries" :key="entry.id" :entry="entry" />

                <template v-slot:empty>
                    <p>No entries</p>
                </template>

                <template v-slot:footer>
                    <td class="flex-list justify" style="width: 100%" v-if="isSystemAdmin">
                        <BaseButton buttonClass="primary invisible" @click="onAddEntry">
                            <i class="far fa-plus"></i>
                            <span>Add Entry</span>
                        </BaseButton>
                    </td>
                    <td></td>
                </template>
            </BaseTableV2>
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
        }
    },
    computed: {
        ...mapGetters('auth', {
            isSystemAdmin: 'getIsSystemAdmin',
        }),
        ...mapGetters('supportLog', {
            supportLogEntries: 'getLogEntries',
        }),
        ...mapGetters('workspaces', {
            workspaceId: 'getCurrentWorkspaceId',
            workspace: 'getCurrentWorkspace',
        }),
        supportMinutesRemaining: {
            get() {
                return this.getPrettyDuration(this.workspace.resources.support_minutes)
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
                this.workspace.resources.support_minutes = newDuration
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
        ...mapActions('supportLog', ['instantiateBaseLogEntry', 'fetchLogEntries']),
        ...mapActions('workspaces', ['fetchWorkspaceResources', 'updateWorkspaceResources']),
        ...mapMutations('supportLog', ['INSERT_LOG_ENTRY', 'REMOVE_LOG_ENTRY']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async init() {
            this.isLoading = true
            await this.fetchLogEntries(this.workspaceId)
            await this.fetchWorkspaceResources(this.workspace)
            this.isLoading = false
        },
        async onAddEntry() {
            const newEntry = await this.instantiateBaseLogEntry()
            this.INSERT_LOG_ENTRY(newEntry)
        },
        async onUpdateResources() {
            await this.updateWorkspaceResources(this.workspace)
        },
    },
    created() {
        this.init()
    },
}
</script>

<style></style>
