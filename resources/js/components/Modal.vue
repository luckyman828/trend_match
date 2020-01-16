<template>
    <portal to="modals">
        <div class="modal-wrapper" :class="{active: isVisible}">
            <div class="inner" v-if="isVisible">
                <div class="overlay" :class="{active: isVisible}" @click="hide"></div>

                <div class="modal card" ref="modal">
                    <button class="close circle" @click="hide"><i class="fal fa-times"></i></button>
                    <div class="inner">
                        <div class="header" v-if="$slots['header'] || $scopedSlots['header'] || header || subHeader">
                            <h2 v-if="header" v-html="header"></h2>
                            <span class="desc" v-if="subHeader" v-html="subHeader"></span>
                            <slot name="header" :toggle="toggle"></slot>
                        </div>
                        <div class="body">
                            <slot :hide="hide"></slot>
                        </div>
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
        'visibilityKey'
    ],
    data: function () { return {
        visible: false,
        movedToBody: false,
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
        // Add an event listener
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
            > .modal {
                position: absolute;
                z-index: 120;
                left: 50%;
                transform: translateX(-50%);
                top: 10vh;
                min-height: 70vh;
                width: 100%;
                max-width: 646px;
                margin: 0;
                background: white;
                margin-bottom: 5vh;
                padding-bottom: 60px;
                > .inner {
                    width: 100%;
                    max-width: 400px;
                    margin: auto;
                    > .header {
                        text-align: center;
                        margin-bottom: 40px;
                        .title {
                            margin-bottom: 8px;
                        }
                        .desc {
                            font-size: 16px;
                            color: $dark2;
                        }
                    }
                }
            }
        }
    }

</style>