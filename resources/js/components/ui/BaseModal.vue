<template>
    <portal to="modals">
        <div class="modal-wrapper" :class="[{active: isVisible}, classes]" ref="modalWrapper">
            <div class="inner" v-if="isVisible">
                <div class="overlay" :class="{active: isVisible}" @click="hide"></div>

                <div class="modal" ref="modal">
                    <div class="header" v-if="$slots['header'] || $scopedSlots['header'] || header || subHeader">
                        <div class="left" v-if="goBack">
                            <button class="go-bacl md circle" @click="$emit('goBack')"><i class="far fa-arrow-left"></i></button>
                        </div>
                        <h2 v-if="header" v-html="header"></h2>
                        <slot name="header"/>
                        <div class="right">
                            <button class="close md circle" @click="hide"><i class="fal fa-times"></i></button>
                        </div>
                    </div>
                    <div class="body">
                        <slot :hide="hide"/>
                    </div>
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
        'subHeader',
        'visibilityKey',
        'classes',
        'goBack'
    ],
    data: function () { return {
        visible: false,
    }},
    computed: {
        isVisible() {
            if (this.visibilityKey != null) {
                return this.visibilityKey
            } else {
                return this.visible
            }
        }
    },
    methods: {
        hide() {
            this.visible = false
            this.$emit('hide')
        },
        show() {
            this.visible = true
            this.$emit('show')
        },
        toggle() {
            // If the modal is already visible - close it
            if (this.isVisible) {
                this.hide()
            } 
            // Else, show the modaæ
            else { 
                this.show()
            }
        },
        hotkeyHandler(event) {
            const key = event.code
            if (key == 'Escape')
                this.hide()
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
        z-index: 9;
        > .inner {
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            overflow: auto;
        }
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
    }

</style>