<template>
    <portal to="modals">
        <div class="modal-wrapper" :class="[{visible: show},classes]" ref="modalWrapper">
            <div class="inner" v-if="show">
                <div class="overlay" @click="close"></div>

                <div class="modal" ref="modal">
                    <div class="header" v-if="$slots['header'] || $scopedSlots['header'] || header">
                        <div class="left" v-if="goBack">
                            <button class="go-bacl md circle" @click="$emit('goBack')"><i class="far fa-arrow-left"></i></button>
                        </div>
                        <h2 v-if="header" v-html="header"></h2>
                        <slot name="header"/>
                        <!-- <div class="right">
                            <button class="close md circle" @click="close"><i class="fal fa-times"></i></button>
                        </div> -->
                    </div>
                    <div class="body">
                        <slot :close="close"/>
                    </div>
                    <button class="close md circle" @click="close"><i class="fal fa-times"></i></button>
                </div>
            </div>
        </div>
    </portal>
</template>

<script>

export default {
    name: 'Modal',
    props: [
        'header',
        'classes',
        'goBack',
        'show'
    ],
    data: function () { return {
    }},
    computed: {
    },
    methods: {
        close() {
            this.$emit('close')
        },
        hotkeyHandler(event) {
            const key = event.code
            if (key == 'Escape')
                this.close()
        },
    },
    created() {
        document.body.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .modal-wrapper {
        position: fixed;
        z-index: 99;
        &.visible {
            .overlay {
                display: block;
            }
        }
        > .inner {
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            overflow: auto;
        }
    }
    .overlay {
        z-index: 11;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba($dark, 50%);
        display: none;
    }
    .modal {
        position: relative;
        z-index: 120;
        width: 100%;
        max-width: 848px;
        margin: 10vh auto 5vh;
        background: $bg;
        border-radius: 6px;
        overflow: hidden;
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            height: 72px;
            border-bottom: solid 2px $divider;
            background: $bgContent;
            h2 {
                text-align: center;
                margin: 0;
            }
            .right {
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                display: flex;
                align-items: center;
                padding-right: 16px;
            }
            .left {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                display: flex;
                align-items: center;
                padding-left: 16px;
            }
        }
        .body {
            width: 100%;
            max-width: 512px;
            margin: auto;
            padding: 20px 32px 40px;
        }
        .close {
            position: absolute;
            right: 16px;
            top: 16px;
        }
    }

</style>