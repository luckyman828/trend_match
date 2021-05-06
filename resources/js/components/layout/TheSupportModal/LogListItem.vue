<template>
    <BaseTableV2Row class="log-list-item">
        <td class="date">
            <BaseEditable v-model="startTimestamp" v-if="isSystemAdmin" @submit="onUpdateEntry" />
            <span v-else>{{ startTimestamp }}</span>
        </td>

        <td class="msg">
            <div class="msg-inner">
                <BaseEditableTextarea
                    ref="messageInput"
                    class="msg-input"
                    v-model="entry.message"
                    :oldValue="entry.message"
                    placeholder="Write a message here.."
                    v-if="isSystemAdmin"
                    @submit="onUpdateEntry"
                />
                <span v-else>{{ entry.message }}</span>
            </div>
        </td>
        <td class="duration">
            <BaseEditable v-model="duration" v-if="isSystemAdmin" @submit="onUpdateEntry" />
            <span v-else>{{ duration }}</span>
        </td>
        <td v-if="isSystemAdmin">
            <button class="invisible ghost-hover true-square" @click="onDeleteEntry">
                <i class="far fa-trash"></i>
            </button>
        </td>
    </BaseTableV2Row>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'logListItem',
    props: ['entry'],
    computed: {
        ...mapGetters('auth', {
            isSystemAdmin: 'getIsSystemAdmin',
        }),
        ...mapGetters('workspaces', {
            workspace: 'getCurrentWorkspace',
        }),
        startTimestamp: {
            get() {
                return this.getPrettyTimestamp(this.entry.support_time)
            },
            set(newVal) {
                // Test that the new val is valid
                const newDate = DateTime.fromFormat(newVal, 'HH:mm - dd MMM yyyy')
                if (!newDate.isValid) {
                    this.SHOW_SNACKBAR({
                        type: 'info',
                        msg: 'Invalid timestamp',
                        iconClass: 'far fa-info-circle',
                    })
                    return
                }
                this.entry.support_time = newDate.toISO()
            },
        },
        duration: {
            get() {
                return this.getPrettyDuration(this.entry.duration)
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
                // Get the diff in duration
                const durationDiff = newDuration - this.entry.duration
                // Update the workspace support to show the correct new support remaining
                this.workspace.resources.support.total_spend_minutes += durationDiff

                this.entry.duration = newDuration
            },
        },
    },
    methods: {
        ...mapActions('supportLog', ['deleteEntry', 'insertOrUpdateLogEntry']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        onDeleteEntry() {
            this.deleteEntry({ workspace: this.workspace, entry: this.entry })
        },
        onUpdateEntry() {
            this.insertOrUpdateLogEntry({ workspace: this.workspace, entry: this.entry })
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.log-list-item {
    width: 100%;
}
.msg-inner {
    max-width: 200px;
}
::v-deep {
    .msg-input {
        .input-wrapper {
            border: none;
            background: none;
            margin-bottom: -4px;
            box-shadow: none !important;
            padding-left: 0;
        }
    }
}
</style>
