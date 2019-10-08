<template>
    <div class="temp-alert" :class="[{visible: visible}, {hidden: hidden}]">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'temp-alert',
    props: [
        'duration'
    ],
    data: function () { return {
        visible: false,
        hidden: false,
    }},
    methods: {
        show () {
            console.log('SHOW TEMP')
            this.visible = true
            const waitDuration = (this.duration) ? this.duration : 2000
            setTimeout(() => { this.visible = false }, waitDuration)
        },
    }
}
</script>

<style scoped lang="scss">
    .temp-alert {
        opacity: 0;
        transition: .3s;
        &.visible {
            opacity: 1;
        }
        &.hidden {
            display: none;
        }
    }
</style>