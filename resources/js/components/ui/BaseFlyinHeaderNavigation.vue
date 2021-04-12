<template>
    <div class="navigation">
        <button class="circle prev" :disabled="!prev" @click="$emit('prev')">
            <i class="fas fa-angle-left"></i>
        </button>
        <button class="circle next" :disabled="!next" @click="$emit('next')">
            <i class="fas fa-angle-right"></i>
        </button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'flyinHeaderNavigation',
    props: ['next', 'prev'],
    computed: {
        ...mapGetters('lightbox', ['getLightboxIsVisible']),
    },
    methods: {
        hotkeyHandler(event) {
            const key = event.code
            // Only do these if the current target is not the comment box
            if (
                !this.getLightboxIsVisible &&
                event.target.type != 'textarea' &&
                event.target.tagName.toUpperCase() != 'INPUT'
            ) {
                if (key == 'ArrowRight' && this.next) {
                    event.preventDefault()
                    this.$emit('next')
                }
                if (key == 'ArrowLeft' && this.prev) {
                    event.preventDefault()
                    this.$emit('prev')
                }
            }
        },
    },
    created() {
        document.body.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.navigation {
    margin-left: 32px;
    display: flex;
    > *:first-child {
        margin-right: 8px;
    }
    i {
        font-size: 16px;
    }
}
</style>
