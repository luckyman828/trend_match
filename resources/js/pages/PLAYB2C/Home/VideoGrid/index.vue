<template>
    <div class="video-grid-wrapper">
        <div class="video-grid" v-if="!loadingData">
            <div class="card-sizer" v-for="video in videos" :key="video.id">
                <VideoCard class="video-card" :video="video" />
            </div>
            <div class="card-sizer">
                <div class="new-video video-card flex-list center-v center-h" @click="onNewVideo">
                    <div class="flex-list flex-v center-v center-h">
                        <i class="far fa-plus lg"></i>
                        <p>New Video</p>
                    </div>
                </div>
            </div>
        </div>
        <BaseLoader v-else msg="Loading videos" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VideoCard from './VideoCard'

export default {
    name: 'videoGrid',
    components: { VideoCard },
    data() {
        return {
            loadingData: false,
        }
    },
    computed: {
        ...mapGetters('videos', {
            videos: 'getVideos',
        }),
    },
    methods: {
        ...mapActions('videos', ['fetchWorkspaceVideos', 'insertVideo']),
        async onNewVideo() {
            let newVideo = await this.insertVideo({ name: 'new video', thumbnail: null })
        },
    },
    async created() {
        this.loadingData = true
        await this.fetchWorkspaceVideos()
        this.loadingData = false
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.video-grid {
    display: flex;
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-gap: 16px;
    .card-sizer {
        height: 0;
        width: 100%;
        position: relative;
        padding-top: 75%;
        > * {
            height: 100%;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }
    }
    .video-card {
        background: white;
        border: $borderEl;
        border-radius: 8px;
        transition: 0.1s ease-out;
        cursor: pointer;
        &.disabled {
            background: $bluegrey400;
            cursor: default;
        }
        &:not(.disabled) {
            &:hover {
                // background: $dark;
                // color: white;
                box-shadow: 0 3px 6px 0 rgba(117, 134, 156, 0.5);
                transform: translateY(-4px);
            }
        }
    }
}
</style>
