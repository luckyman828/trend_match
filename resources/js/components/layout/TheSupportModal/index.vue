<template>
    <BaseModal :show="show" @close="$emit('close')" header="Support Accounting">
        <h3>Support hours</h3>
        <p>Remaining: <strong>3 hr. 45 min.</strong></p>
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
        }),
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
        ...mapMutations('supportLog', ['INSERT_LOG_ENTRY', 'REMOVE_LOG_ENTRY']),
        async onAddEntry() {
            const newEntry = await this.instantiateBaseLogEntry()
            this.INSERT_LOG_ENTRY(newEntry)
        },
        onRemoveEntry(entry) {
            this.REMOVE_LOG_ENTRY(entry)
        },
        async init() {
            console.log('init')
            this.isLoading = true
            await this.fetchLogEntries(this.workspaceId)
            this.isLoading = false
        },
    },
    created() {
        this.init()
    },
}
</script>

<style></style>
