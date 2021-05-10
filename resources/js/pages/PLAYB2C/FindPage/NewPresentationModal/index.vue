<template>
    <BaseModal ref="newPresentationModal" :show="show" @close="$emit('close')">
        <!-- Choose type screen -->
        <div class="choose-type-screen" v-if="screenIndex == 0">
            <div class="flex-list full-width equal-width space-lg">
                <button
                    class="primary lg"
                    @click="
                        createFlow = 'video'
                        screenIndex++
                    "
                >
                    <span>Upload video</span>
                </button>
                <BaseButton
                    buttonClass="primary lg"
                    :disabled="true"
                    disabledTooltip="coming soon"
                    @click="
                        createFlow = 'livestream'
                        screenIndex++
                    "
                >
                    <span>Start livestream</span>
                </BaseButton>
            </div>
        </div>

        <template v-if="createFlow == 'video'">
            <UploadVideoScreen v-show="screenIndex == 1" @next="screenIndex++" @back="screenIndex--" />
            <PresentationDetailsScreen
                v-if="screenIndex == 2"
                @next="$router.push({ name: 'play.editPresentation', params: { presentaionId: presentation.id } })"
                @back="onBackToUploadVideo"
            />
        </template>
    </BaseModal>
</template>

<script>
import UploadVideoScreen from './UploadVideoScreen'
import PresentationDetailsScreen from './PresentationDetailsScreen'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'play.newPresentationModal',
    components: { UploadVideoScreen, PresentationDetailsScreen },
    props: ['show'],
    data() {
        return {
            screenIndex: 0,
            createFlow: null,
        }
    },
    computed: {
        ...mapGetters('playPresentations', {
            presentation: 'getCurrentPresentation',
        }),
    },
    methods: {
        ...mapActions('videos', ['cancelUpload']),
        async onBackToUploadVideo() {
            await this.cancelUpload(this.presentation.uploadChannel)
            this.screenIndex--
        },
    },
}
</script>

<style></style>
