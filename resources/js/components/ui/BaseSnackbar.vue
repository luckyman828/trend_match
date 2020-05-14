<template>
    <div class="snackbar" @mouseenter="onEnter" @mouseleave="onLeave"
    @click.exact="onDeleteSnackbar">
        <!-- <div class="count circle" v-if="snackbar.count">{{snackbar.count}}</div> -->
        <div class="icon-wrapper" :class="snackbar.type">
            <i class="fas" :class="snackbar.iconClass"></i>
        </div>
        <div class="body">
            <div class="msg">
                <span>{{snackbar.msg}} <span v-if="snackbar.count > 1">({{snackbar.count}})</span></span>
            </div>
            <div class="callback" v-if="snackbar.callback">
                <BaseButton buttonClass="invisible primary ghost-hover"
                @click.stop="snackbar.callback(); onDeleteSnackbar()">
                    <span>{{snackbar.callbackLabel}}</span>
                </BaseButton>
            </div>
            <button class="circle"
            @click.stop="onDeleteSnackbar">
                <i class="fas fa-times"></i>
            </button>

            <div class="timer" v-if="duration">
                <svg>
                    <rect class="animate" ref="countdown" height="4px" :style="animationDuration"/>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    name: 'baseSnackbar',
    props: [
        'snackbar'
    ],
    data: function() { return {
        timer: null,
        lastReset: null
    }},
    computed: {
        duration() {
            return this.snackbar.duration != null ? this.snackbar.duration : 5000
        },
        animationDuration() {
            return `animation-duration: ${this.duration}ms`
        },
        count() {
            return this.snackbar.count
        }
    },
    watch: {
        count(newVal, oldVal) {
            if (this.timer) {
                if (this.lastReset + 100 < Date.now()) {
                    this.timer.reset()
                }
                this.lastReset = Date.now()
            }
        }
    },
    methods: {
        ...mapMutations('alerts', ['DELETE_SNACKBAR']),
        onDeleteSnackbar() {
            this.DELETE_SNACKBAR(this.snackbar)
        },
        onEnter() {
            if (this.timer) this.timer.pause()
        },
        onLeave() {
            if (this.timer) this.timer.resume()
        },
        onTimeout() {
            if (this.snackbar.timeoutCallback) {
                this.snackbar.timeoutCallback()
            }
            this.onDeleteSnackbar()
        },
        resetTimerAnimation() {
            this.$nextTick(() => {
                const el = this.$refs.countdown
                el.classList.remove('animate')
                setTimeout(() => {
                    el.classList.add('animate')
                },100)
            })
        }
    },
    created() {
        // Automatically hide the snackbar
        if (this.duration) {
            this.timer = new Timer(() => this.onTimeout(), this.duration, () => this.resetTimerAnimation())
        }
    }
}

// Helper Function
var Timer = function(callback, delay, resetCallback) {
    var timerId, start, remaining = delay, lastReset

    this.pause = function() {
        window.clearTimeout(timerId)
        remaining -= Date.now() - start
    }

    this.resume = function() {
        start = Date.now()
        window.clearTimeout(timerId)
        timerId = window.setTimeout(callback, remaining)
    }

    this.reset = function() {
            start = Date.now()
            remaining = delay
            window.clearTimeout(timerId)
            timerId = window.setTimeout(callback, remaining)
            resetCallback()
    }

    this.resume()
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.snackbar {
    width: 400px;
    display: flex;
    margin-top: 32px;
    box-shadow: 0 3px 30px rgba(0,0,0,.4);
    animation: flyin .1s;
    border-radius: 4px;
    position: relative;
    .count {
        position: absolute;
        left: -12px;
        top: -12px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    }
    .icon-wrapper {
        width: 44px;
        background: $bg;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px 0 0 4px;
        &.success {
            background: $green;
            i {
                color: white;
            }
        }
        &.danger {
            background: $red;
            i {
                color: white;
            }
        }
        &.warning {
            background: $yellow;
            i {
                color: $font;
            }
        }
        &.info {
            background: $primary;
            i {
                color: white;
            }
        }
    }
    .body {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px 16px 12px 32px;
        flex: 1;
        border: solid 1px $divider;
        border-radius: 0 4px 4px 0;
        border-left: none;
        background: white;
    }
    .msg {
        font-size: 14px;
        font-weight: 700;
        flex: 1;
    }
    .callback {
        margin: 0 16px;
    }
    .timer {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 4px;
        svg {
            width: 100%;
            height: 16px;
            rect {
                // width: 100%;
                width: 0;
                fill: $dark2;
                &.animate {
                    animation: animateWidth linear;
                }
            }
        }
    }
    &:hover {
        .timer svg rect {
            animation-play-state: paused;
        }
    }
}
@keyframes animateWidth {
    from {width: 0;}
    to {width: 100%;}
}

@keyframes flyin {
    from {transform: translateX(calc(100% + 16px));}
    to {transform: none;}
}

</style>