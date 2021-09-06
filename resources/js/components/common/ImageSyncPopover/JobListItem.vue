<template>
    <div class="job-list-item" :class="job.status">
        <div class="flex-list justify center-v">
            <div
                class="file-name-wrapper"
                :class="{ clickable: $route.params.fileId != job.file.id }"
                @click="
                    $route.params.fileId != job.file.id &&
                        $router.push({ name: 'editFile', params: { fileId: job.file.id } })
                "
            >
                <div class="name">{{ job.file.name }}</div>
            </div>
            <div class="flex-list xs">
                <div class="pill sm count green">
                    <i class="far fa-check"></i>
                    <span> {{ job.completed }}</span>
                </div>
                <div class="pill sm count red" v-if="job.failed > 0">
                    <i class="far fa-times"></i>
                    <span> {{ job.failed }}</span>
                </div>
                <div class="pill sm count" :class="remainingCount > 0 ? 'dark' : job.failed > 0 ? 'yellow' : 'green'">
                    <span v-if="job.status == 'Cancelled'">Cancelled</span>
                    <span v-else-if="remainingCount <= 0">Done</span>
                    <template v-else>
                        <BaseLoader class="loader" />
                        <span>{{ completedCount }} / {{ job.total }}</span>
                    </template>
                </div>
            </div>
            <div class="hover-action-list">
                <button
                    v-if="$route.params.fileId != job.file.id"
                    class="primary ghost xs"
                    @click="$router.push({ name: 'editFile', params: { fileId: job.file.id } })"
                >
                    <span>View</span>
                </button>
                <!-- <button v-if="job.failed > 0" class="primary ghost xs" @click="onRetryFailed">
                    <span>Retry failed</span>
                </button> -->
                <button v-if="!job.completed" class="primary ghost sm" @click="onCancel">
                    <span>Cancel</span>
                </button>
                <button v-else class="primary ghost sm" @click="onClear">
                    <span>Clear</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
    name: 'jobListItem',
    props: ['job'],
    computed: {
        completedCount() {
            return this.job.completed + this.job.failed
        },
        remainingCount() {
            return this.job.total - this.completedCount
        },
    },
    methods: {
        ...mapActions('backgroundJobs', ['stopImageSyncJob']),
        ...mapMutations('backgroundJobs', ['REMOVE_IMAGE_SYNC_JOB']),
        onCancel() {
            this.stopImageSyncJob(this.job)
        },
        onClear() {
            this.REMOVE_IMAGE_SYNC_JOB(this.job.id)
        },
        onRetryFailed() {},
    },
}
</script>

<style lang="scss" scoped>
.job-list-item {
    position: relative;
    .file-name-wrapper {
        overflow: hidden;
        font-size: 14px;
        .name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        &:hover {
            .name {
                font-weight: 700;
            }
        }
    }
    &:hover {
        .hover-action-list {
            display: block;
            padding-left: 32px;
            background: linear-gradient(90deg, transparent, white 24px);
        }
    }
    .count {
        flex-shrink: 0;
    }
    .hover-action-list {
        display: none;
        position: absolute;
        right: 0;
        top: 0;
        background: white;
    }
}
::v-deep {
    .loader {
        svg {
            width: auto;
            margin: 0 2px;
        }
    }
}
</style>
