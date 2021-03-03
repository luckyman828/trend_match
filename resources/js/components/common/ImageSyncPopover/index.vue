<template>
    <div class="image-sync-popover">
        <div class="job-list flex-list flex-v md">
            <JobListItem v-for="job in jobs" :key="job.id" :job="job" />
        </div>
        <div class="action-list" v-if="!!jobs.find(job => job.status == 'Completed')">
            <button class="full-width red primary clear-button" @click="CLEAR_COMPLETED">
                <i class="far fa-check"></i>
                <span>Clear completed</span>
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import JobListItem from './JobListItem'

export default {
    name: 'imageSyncPopover',
    components: { JobListItem },
    computed: {
        ...mapGetters('backgroundJobs', {
            jobs: 'getImageSyncJobs',
        }),
    },
    methods: {
        ...mapMutations('backgroundJobs', ['CLEAR_COMPLETED']),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.image-sync-popover {
    padding-right: 0;
    width: 320px;
    .job-list {
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: 20px;
        padding: 16px;
    }
    .action-list {
        padding: 0 16px 16px;
    }
}
</style>
