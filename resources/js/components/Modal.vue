<template>
    <div class="modal-wrapper" ref="modalWrapper">

        <div class="overlay" @click="close"></div>

        <div class="modal card">
            <span class="close circle" @click="close"><i class="fal fa-times"></i></span>
            <div class="inner">
                <div class="header"><slot name="header" :toggle="toggle"></slot></div>
                <div class="body"><slot name="body" :toggle="toggle"></slot></div>
            </div>
        </div>

    </div>
</template>

<script>

export default {
    name: 'Modal',
    props: [
        
    ],
    data: function () { return {
        
    }},
    computed: {

    },
    methods: {
        close() {
            this.$refs.modalWrapper.classList.remove('active')
        },
        toggle() {
            this.$refs.modalWrapper.classList.toggle('active')
        },
        toggleAlt() {
            this.$refs.modalWrapper.classList.toggle('active')
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .close {
        position: absolute;
        right: 8px;
        top: 8px;
    }

</style>