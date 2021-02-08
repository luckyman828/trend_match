<template>
    <div class="job-list-item" :class="job.status">
        <div class="flex-list justify">
            <div
                class="file-name-wrapper clickable"
                @click="$router.push({ name: 'editFile', params: { fileId: job.file.id } })"
            >
                <div class="name">{{ job.file.name }}</div>
                <div class="hover-action-list">
                    <button class="primary ghost xs">
                        <span>View</span>
                    </button>
                </div>
            </div>
            <div class="pill xs count" :class="remainingCount > 0 ? 'dark' : 'green'">
                <span>{{ remainingCount > 0 ? remainingCount : 'Done' }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    name: 'jobListItem',
    props: ['job'],
    computed: {
        remainingCount() {
            return this.job.total - this.job.completed
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.job-list-item {
    .file-name-wrapper {
        position: relative;
        overflow: hidden;
        .name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        &:hover {
            .name {
                font-weight: 700;
            }
            .hover-action-list {
                display: block;
            }
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
</style>
