<template>
    <v-popover popoverClass="min volume-control-wrapper" placement="top">
        <button class="no-bg white circle  ghost-hover" @click="togglePlayerMuted()">
            <i class="fas" :class="isMuted ? 'fa-volume-mute' : 'fa-volume'"></i>
        </button>
        <div class="volume-control" slot="popover" :class="{ muted: isMuted }">
            <div class="rail" @click="onClickRail" ref="rail">
                <div class="rail-sizer">
                    <div class="inner-rail"></div>
                    <div class="volume-bar" :style="barStyle">
                        <div class="knob"></div>
                    </div>
                </div>
            </div>
        </div>
    </v-popover>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'volumeControl',
    computed: {
        ...mapGetters('videoPlayer', {
            isMuted: 'getIsMuted',
            volume: 'getVolume',
        }),
        barStyle() {
            return {
                height: `${this.volume * 100}%`,
            }
        },
        rail() {
            return this.$refs.rail
        },
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlayerMuted', 'setVolume']),
        onClickRail(e) {
            const clickY = e.clientY
            const railRect = this.rail.getBoundingClientRect()
            const railTop = railRect.top
            const percent = 1 - (clickY - railTop) / railRect.height
            this.setVolume(percent)
        },
    },
}
</script>

<style scoped lang="scss">
.volume-control {
    padding: 12px 0;
    background: white;
    width: 20px;
    height: 100px;
    &.muted {
        .rail {
            opacity: 0.5;
        }
    }
    .rail {
        height: 100%;
        width: 100%;
        cursor: pointer;
        .rail-sizer {
            position: relative;
            height: 100%;
            width: 4px;
            margin: auto;
        }
        .inner-rail {
            width: 100%;
            border-radius: 4px;
            height: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            background: $grey700;
        }
        .volume-bar {
            width: 100%;
            background: $primary;
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            border-radius: 4px;
            .knob {
                position: absolute;
                top: 0;
                left: 50%;
                width: 12px;
                height: 12px;
                transform: translate(-50%, -50%);
                background: $dark;
                border-radius: 50px;
            }
        }
    }
}
</style>
