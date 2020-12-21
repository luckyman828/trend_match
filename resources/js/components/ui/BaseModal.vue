<template>
    <portal to="modals">
        <div class="modal-wrapper" :class="[{ visible: show }, classes]" ref="modalWrapper">
            <div class="overlay" v-if="show" @click="close"></div>
            <div class="inner" v-if="show" @click.self="close">
                <div class="modal" ref="modal">
                    <div class="header" v-if="$slots['header'] || $scopedSlots['header'] || header">
                        <div class="left" v-if="goBack">
                            <button class="go-bacl md circle" @click="$emit('goBack')">
                                <i class="far fa-arrow-left"></i>
                            </button>
                        </div>
                        <h2 v-if="header" v-html="header"></h2>
                        <div class="sub-header" v-html="subHeader"></div>
                        <slot name="header" />
                        <!-- <div class="right">
                            <button class="close md circle" @click="close"><i class="fal fa-times"></i></button>
                        </div> -->
                    </div>
                    <div class="body">
                        <slot :close="close" />
                    </div>
                    <button class="close circle" @click="close"><i class="far fa-times"></i></button>
                </div>
            </div>
        </div>
    </portal>
</template>

<script>
export default {
    name: 'Modal',
    props: ['header', 'subHeader', 'classes', 'goBack', 'show'],
    data: function() {
        return {}
    },
    computed: {},
    watch: {
        show(isVisible) {
            if (isVisible) {
                document.body.addEventListener('keydown', this.hotkeyHandler)
            } else {
                document.body.removeEventListener('keydown', this.hotkeyHandler)
            }
        },
    },
    methods: {
        close() {
            this.$emit('close')
        },
        hotkeyHandler(event) {
            const key = event.code
            if (key == 'Escape') this.close()
        },
    },
    created() {
        if (this.show) {
            document.body.addEventListener('keydown', this.hotkeyHandler)
        }
    },
    destroyed() {
        if (this.show) {
            document.body.removeEventListener('keydown', this.hotkeyHandler)
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.modal-wrapper {
    position: fixed;
    z-index: 99;
    &.full-body {
        .body {
            max-width: none;
        }
    }
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
        scroll-behavior: smooth;
        z-index: 1;
        text-align: center;
    }
    &.sm {
        .modal {
            max-width: 500px;
            background: white;
        }
        .close {
            right: 8px;
            top: 8px;
        }
    }
}
.overlay {
    z-index: 0;
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
    // width: 100%;
    // width: 512px;
    min-width: 500px;
    display: inline-block;
    text-align: left;
    margin: 10vh auto 5vh;
    background: white;
    border-radius: 6px;
    overflow: hidden;
    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        flex-direction: column;
        padding: 8px;
        border-bottom: $borderModule;
        background: $bgContent;
        text-align: center;
        min-height: 52px;
        h2 {
            font-size: 14px;
            font-weight: 700;
            color: $font;
            margin: 0;
        }
        .sub-header {
            color: $fontSoft;
            font-size: 12px;
            line-height: 1;
            margin-top: 2px;
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
        // width: 100%;
        // max-width: 512px;
        margin: auto;
        padding: 32px;
    }
    .close {
        position: absolute;
        right: 16px;
        top: 10px;
    }
}
</style>
