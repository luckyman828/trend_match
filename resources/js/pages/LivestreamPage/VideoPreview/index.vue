<template>
    <div class="video-preview" :class="{ 'drag-active': isDragging }">
        <form class="url-input" @submit.prevent v-if="!playerReady || editModeActive">
            <div class="container">
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
                    <span>Go LIVE</span>
                </button>
                <div class="controls" v-if="playerReady">
                    <button v-tooltip="'Cancel'" @click="editModeActive = false">
                        <i class="far fa-times"></i>
                    </button>
                </div>
            </div>
        </form>
        <div class="video-controls" v-if="playerReady">
            <button class="white" @click="editModeActive = !editModeActive">
                <template v-if="!editModeActive">
                    <i class="far fa-pen"></i>
                    <span>Change video</span>
                </template>
                <template v-else>
                    <i class="far fa-times"></i>
                    <span>Cancel</span>
                </template>
            </button>
        </div>

        <BaseDialog
            ref="confirmGoLiveDialog"
            type="confirm"
            confirmColor="primary"
            confirmText="Yes, go live!"
            cancelText="No, i'm not ready yet"
        >
            <div class="icon-graphic">
                <i class="lg primary far fa-file"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-presentation"></i>
            </div>
            <h3>Really go live?</h3>
            <p>
                <strong>Any existing video presentation on the file will be DELETED.</strong>
            </p>
            <p>
                All sub-selections will enter presentation mode.
            </p>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'videoPreview',
    data: function() {
        return {
            videoUrl: '',
            editModeActive: false,
        }
    },
    computed: {
        ...mapGetters('files', {
            file: 'currentFile',
        }),
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
        }),
        ...mapGetters('videoPlayer', {
            isDragging: 'getTimelineKnobIsBeingDragged',
            provider: 'getProvider',
            videoId: 'getProviderVideoId',
        }),
        ...mapGetters('selections', {
            selections: 'getSelections',
        }),
        playerReady() {
            return this.provider && this.videoId
        },
        submitDisabled() {
            return this.videoUrl.length < 5
        },
    },
    methods: {
        ...mapActions('selections', ['startPresentation']),
        ...mapActions('videoPresentation', ['setVideoByURL']),
        async onSetVideoByURL() {
            if (await this.$refs.confirmGoLiveDialog.confirm()) {
                // Start a presentation with all the selections of the file
                await this.startPresentation({ selections: this.selections })
            }
            this.setVideoByURL({ file: this.file, url: this.videoUrl })
            this.editModeActive = false
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.video-preview {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    &.drag-active {
        cursor: grabbing;
    }
    .video-controls {
        position: absolute;
        right: 8px;
        top: 8px;
        opacity: 0;
        z-index: 3;
        pointer-events: all;
        .player-overlay:hover & {
            opacity: 1;
        }
    }
}
.url-input {
    background: white;
    height: 100%;
    pointer-events: all;
    .container {
        margin: auto;
        height: 100%;
        max-width: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
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
</style>
