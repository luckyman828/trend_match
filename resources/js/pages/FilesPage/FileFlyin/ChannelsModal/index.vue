<template>
    <BaseModal class="channels-modal" :show="show" @close="$emit('close')" :header="file.name" subHeader="Channels">
        <BaseLoader v-if="isLoading" msg="Loading Chapters" />
        <template v-else>
            <div class="channel-list">
                <ChannelListItem
                    v-for="channel in file.broadcastChannels"
                    :key="channel.id"
                    :channel="channel"
                    class="form-section"
                />
                <button class="full-width ghost primary form-element lg" @click="onNewChannel">
                    <i class="far fa-plus"></i>
                    <span>Add Channel</span>
                </button>
                <button class="full-width primary form-element lg" @click="$emit('close')">
                    <span>Done</span>
                </button>
            </div>
        </template>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChannelListItem from './ChannelListItem'
export default {
    name: 'channelsModal',
    components: { ChannelListItem },
    props: ['show'],
    data: function() {
        return {
            isLoading: true,
        }
    },
    computed: {
        ...mapGetters('files', {
            file: 'getCurrentFile',
        }),
    },
    watch: {
        show(isVisible) {
            if (isVisible) this.init()
        },
    },
    methods: {
        ...mapActions('files', ['fetchBroadcastChannels']),
        async init() {
            this.isLoading = true
            await this.fetchBroadcastChannels(this.file)
            this.isLoading = false
        },
        onNewChannel() {
            const defaultChannel = {
                id: null,
                name: 'New channel',
                selections: [],
            }
            this.file.broadcastChannels.push(defaultChannel)
        },
    },
}
</script>

<style></style>
