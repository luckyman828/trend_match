<template>
    <div class="navigation">
        <button class="circle primary prev" :disabled="!prev" @click="$emit('prev')"><i class="far fa-angle-left"></i></button>
        <button class="circle primary next" :disabled="!next" @click="$emit('next')"><i class="far fa-angle-right"></i></button>
    </div>
</template>

<script>
export default {
    name: 'flyinHeaderNavigation',
    props: [
        'next',
        'prev',
    ],
    methods: {
        hotkeyHandler(event) {
            const key = event.code
            // Only do these if the current target is not the comment box
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT') {
                if (key == 'ArrowRight' && this.next)
                    this.$emit('next')
                if (key == 'ArrowLeft' && this.prev)
                    this.$emit('prev')
            }
        }
    },
    created() {
        document.body.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    }

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