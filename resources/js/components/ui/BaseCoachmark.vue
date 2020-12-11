<template>
    <button @click.stop="onDismiss" class="base-coachmark primary" :class="{ hide: !isCreated || isDismissed }">
        <i class="far fa-info-circle"></i>
        <span class="msg">{{ msg }}</span>
        <span class="dismiss" @click="onDismiss">Dismiss</span>
    </button>
</template>

<script>
import { createPopper, auto } from '@popperjs/core'
import maxSize from 'popper-max-size-modifier'
export default {
    name: 'baseCoachmark',
    props: ['msg', 'targetRef', 'name', 'placement'],
    data: function() {
        return {
            isDismissed: false,
            popperInstance: null,
            isCreated: false,
        }
    },
    watch: {
        targetRef(newVal) {
            if (this.isDismissed) return
            this.$nextTick(() => {
                if (!this.isCreated && newVal) {
                    this.create()
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.popperInstance.update()
                        }, 500)
                    })
                }
            })
        },
    },
    methods: {
        onDismiss() {
            this.isDismissed = true
            localStorage.setItem(`coachmark-${this.name}-dismissed`, true)
        },
        create() {
            this.popperInstance = createPopper(this.targetRef, this.$el, {
                placement: this.placement ? this.placement : 'auto',
                modifiers: [
                    {
                        name: 'offset',
                        enabled: true,
                        options: {
                            offset: [0, 8],
                        },
                    },
                    {
                        name: 'preventOverflow ',
                        enabled: true,
                        options: {},
                        phase: 'main',
                    },
                ],
            })
            this.isCreated = true
        },
        destroy() {
            if (this.popperInstance) {
                this.popperInstance.destroy()
                this.popperInstance = null
            }
        },
    },
    created() {
        if (localStorage.getItem(`coachmark-${this.name}-dismissed`)) {
            this.isDismissed = true
            return
        }
        if (this.targetRef) this.create()
    },
    destroyed() {
        this.destroy()
    },
}
</script>

<style lang="scss" scoped>
.base-coachmark {
    pointer-events: all;
    &.hide {
        display: none;
    }
    .dismiss {
        display: block;
        margin-left: 20px;
        text-decoration: underline;
    }
}
</style>
