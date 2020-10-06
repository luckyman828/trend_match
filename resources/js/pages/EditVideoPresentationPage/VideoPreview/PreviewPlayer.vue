<template>
    <div class="player-wrapper">
        <vimeo-player
            v-if="provider == 'Vimeo'"
            ref="player"
            class="player"
            :videoId="providerVideoId"
            :controls="false"
            :autoplay="true"
            @ready="onPlayerReady"
            @play="SET_PLAYER_STATUS('playing')"
            @pause="SET_PLAYER_STATUS('paused')"
            @ended="SET_PLAYER_STATUS('ended')"
        />

        <youtube
            v-if="provider == 'Youtube'"
            ref="player"
            class="player"
            tabindex="-1"
            :videoId="providerVideoId"
            :playerVars="{
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                fs: 0,
                cc_load_policy: 0,
                iv_load_policy: 3,
                disablekb: 0,
            }"
            :resize="true"
            :fitParent="true"
            @ready="onPlayerReady"
            @playing="SET_PLAYER_STATUS('playing')"
            @paused="SET_PLAYER_STATUS('paused')"
            @buffering="SET_PLAYER_STATUS('buffering')"
            @ended="SET_PLAYER_STATUS('ended')"
            @error="SET_PLAYER_STATUS('error')"
        />
        <!-- </div> -->

        <PlayerOverlay v-if="playerReady" />
    </div>
</template>

<script>
import PlayerOverlay from './PlayerOverlay'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'previewPlayer',
    components: {
        PlayerOverlay,
    },
    props: ['providerVideoId', 'provider'],
    data: function() {
        return {
            playerReady: false,
            intervalTimer: null,
            lastTimestamp: 0,
        }
    },
    computed: {
        ...mapGetters('videoPlayer', {
            player: 'getPlayer',
            playerStatus: 'getStatus',
            currentTimestamp: 'getTimestamp',
            isSeeking: 'getIsSeeking',
            isPlaying: 'getIsPlaying',
        }),
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlayerMuted']),
        ...mapActions('products', ['initTimings']),
        ...mapMutations('videoPlayer', [
            'SET_PLAYER_REFERENCE',
            'SET_CURRENT_PLAYER_TIMESTAMP',
            'SET_PLAYER_DURATION',
            'SET_PLAYER_STATUS',
            'SET_IFRAME_REFERENCE',
        ]),
        onPlayerReady() {
            console.log('set player rady')
            this.playerReady = true
            console.log('set iframe asdasd', this.$refs.player.player)
            this.SET_PLAYER_REFERENCE(this.$refs.player.player)
            console.log('set iframe reference', this.$el.getElementsByTagName('iframe')[0])
            this.SET_IFRAME_REFERENCE(this.$el.getElementsByTagName('iframe')[0])
            // Pre-mute the player
            this.togglePlayerMuted()
            this.startTimerListener()

            // Save a timestamp
            this.lastTimestamp = Date.now()

            this.getVideoDuration()
        },
        startTimerListener() {
            // Clear the current one if any
            this.clearTimerListener()

            this.intervalTimer = setInterval(this.getVideoTimeStamp, 50)
        },
        clearTimerListener() {
            if (this.intervalTimer) {
                clearInterval(this.intervalTimer)
            }
        },
        async getVideoTimeStamp() {
            if (!this.isSeeking && this.isPlaying) {
                // Get the duration since last we read a timestamp
                const newTime = Date.now()
                const diff = newTime - this.lastTimestamp
                const timeStamp = this.currentTimestamp + diff / 1000

                // const timeStamp = await this.player.getCurrentTime()
                this.SET_CURRENT_PLAYER_TIMESTAMP(timeStamp)
            }
            this.lastTimestamp = Date.now()
        },
        async getVideoDuration() {
            const duration = await this.player.getDuration()
            this.SET_PLAYER_DURATION(duration)
        },
    },
    destroyed() {
        this.clearTimerListener()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
// ::v-deep {
//     .player {
//         // display: block;
//         // margin: auto;
//         // margin-top: 100px;
//         pointer-events: none;
//         // width: 100%;
//     }
// }
.player-wrapper {
    width: 100%;
    background: black;
    height: 100%;
    position: relative;
    .player {
        pointer-events: none;
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        ::v-deep {
            iframe {
                height: 100%;
                width: 100%;
            }
        }
    }
}
</style>
