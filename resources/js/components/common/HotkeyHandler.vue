<template>
    <div class="hotkey-handler" v-if="hotkeysInitialized">
        <div class="square ghost primary md">
            <span>Hotkeys Listening!</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'hotkeyHandler',
    props: [
        'disabled'
    ],
    data: function() { return {
        hotkeysInitialized: false,
        timeOut: null,
    }},
    methods: {
        hotkeyHandler(event) {
            if (this.disabled) return
            const key = event.code

            if (key == 'KeyH' && !this.hotkeysInitialized) {
                this.hotkeysInitialized = true
                this. timeOut = setTimeout(() => {
                    this.hotkeysInitialized = false
                }, 1000)
                return
            }

            if (this.hotkeysInitialized) {
                this.hotkeysInitialized = false
                clearTimeout(this.timeOut)
                console.log('hotkey succes!', event)
            }
        },
    },
    created() {
        document.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.removeEventListener('keydown', this.hotkeyHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.hotkey-handler {
    position: fixed;
    bottom: 12px;
    left: 50%;
    z-index: 999;
    background: $bgDark;
    border: $borderModule;
    box-shadow: $shadowModule;
    border-radius: $borderRadiusModule;
    padding: 12px;
    width: 300px;
    .square {
        width: 100%;
    }
}
</style>