<template>
    <div class="video-preview" :class="{ 'drag-active': isDragging }">
        <form class="url-input" @submit.prevent v-if="!playerReady || editModeActive">
            <h3>Enter the URL of your video to get started</h3>
            <div class="form-element">
                <label for="url-input">Video URL</label>
                <BaseInputField
                    id="url-input"
                    v-model="videoUrl"
                    placeholder="Your video URL"
                    :focusOnMount="true"
                    @submit="onSetVideoByURL"
                />
                <p class="example">Example: https://vimeo.com/123456789</p>
            </div>
            <button
                class="primary full-width lg"
                @click="onSetVideoByURL"
                :disabled="submitDisabled"
                disabledTooltip="Please enter a valid URL"
            >
                <span>Get video by URL</span>
            </button>
            <div class="controls" v-if="playerReady">
                <button v-tooltip="'Cancel'" @click="editModeActive = false">
                    <i class="far fa-times"></i>
                </button>
            </div>
        </form>

        <div class="preview-wrapper" v-else>
            <PreviewPlayer :providerVideoId="currentVideo.providerVideoId" :provider="currentVideo.provider" />
            <div class="video-controls">
                <button class="white" v-tooltip="'Change video'" @click="editModeActive = true">
                    <i class="far fa-pen"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PreviewPlayer from './PreviewPlayer'

export default {
    name: 'videoPreview',
    components: {
        PreviewPlayer,
    },
    data: function() {
        return {
            videoUrl: '',
            editModeActive: false,
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
        }),
        ...mapGetters('videoPlayer', {
            isDragging: 'getTimelineKnobIsBeingDragged',
        }),
        playerReady() {
            return this.currentVideo.providerVideoId && this.currentVideo.provider
        },
        submitDisabled() {
            return this.videoUrl.length < 5
        },
    },
    methods: {
        ...mapActions('videoPresentation', ['setVideoByURL']),
        onSetVideoByURL() {
            this.setVideoByURL({ video: this.currentVideo, url: this.videoUrl })
            this.editModeActive = false
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.video-preview {
    position: relative;
    &.drag-active {
        cursor: grabbing;
    }
}
.url-input {
    max-width: 400px;
    margin: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .controls {
        position: absolute;
        right: 8px;
        top: 8px;
    }
    .input-field {
        width: 100%;
    }
    .example {
        margin-top: 4px;
        color: $fontSoft;
        font-size: 12px;
        margin-bottom: -8px;
    }
}
.preview-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    .video-controls {
        position: absolute;
        right: 8px;
        top: 8px;
        opacity: 0;
        z-index: 3;
    }
    &:hover {
        .video-controls {
            opacity: 1;
        }
    }
}
</style>
