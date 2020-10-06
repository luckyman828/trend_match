<template>
    <div class="video-preview">
        <form class="url-input" @submit.prevent v-if="!playerReady">
            <h3>Enter the URL of your video to get started</h3>
            <div class="form-element">
                <label for="url-input">Video URL</label>
                <BaseInputField
                    id="url-input"
                    v-model="videoUrl"
                    placeholder="Your video URL"
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
        </form>

        <PreviewPlayer v-else :providerVideoId="currentVideo.providerVideoId" :provider="currentVideo.provider" />
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
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
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
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.url-input {
    max-width: 400px;
    margin: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
