<template>
    <div class="modal-wrapper" ref="modalWrapper">

        <div class="overlay" @click="close"></div>

        <div class="modal card" ref="modal">
            <span class="close circle" @click="close"><i class="fal fa-times"></i></span>
            <div class="inner">
                <div class="header">
                    <h2 v-if="header" v-html="header"></h2>
                    <span class="desc" v-if="subHeader" v-html="subHeader"></span>
                    <slot name="header" :toggle="toggle"></slot>
                </div>
                <div class="body"><slot name="body" :toggle="toggle"></slot></div>
            </div>
        </div>

    </div>
</template>

<script>

export default {
    name: 'Modal',
    props: [
        'header',
        'subHeader'
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
            this.setPos()
        },
        toggleAlt() {
            this.$refs.modalWrapper.classList.toggle('active')
        },
        setPos() {
            const el = this.$refs.modal
            const elWidth = el.getBoundingClientRect().width

            el.style.cssText = `left: calc(50vw - ${elWidth / 2}px);`
        }
    },
    mounted() {
        this.setPos()
    },
    updated() {
        this.setPos()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .close {
        position: absolute;
        right: 8px;
        top: 8px;
    }
    .modal-wrapper {
        display: contents;
    }

</style>