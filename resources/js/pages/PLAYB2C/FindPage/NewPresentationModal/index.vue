<template>
    <BaseModal ref="newPresentationModal" :show="show" @close="$emit('close')">
        <!-- Choose type screen -->
        <ChooseTypeScreen v-if="screenIndex == 0" @next="onChooseFlow" />

        <template v-if="createFlow == 'video'">
            <UploadVideoScreen v-show="screenIndex == 1" @next="screenIndex++" @back="screenIndex--" />
            <PresentationDetailsScreen
                v-if="screenIndex == 2"
                @next="$router.push({ name: 'play.editPresentation', params: { presentationId: presentation.id } })"
                @back="onBackToUploadVideo"
                nextText="Add timings and Looks"
            />
        </template>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import UploadVideoScreen from './UploadVideoScreen'
import PresentationDetailsScreen from './PresentationDetailsScreen'
import ChooseTypeScreen from './ChooseTypeScreen'

export default {
    name: 'play.newPresentationModal',
    components: { UploadVideoScreen, PresentationDetailsScreen, ChooseTypeScreen },
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
        onChooseFlow(flow) {
            this.createFlow = flow
            this.screenIndex++
        },
    },
}
</script>

<style></style>
