<template>
    <portal to="modals">
        <div class="modal-wrapper" :class="{active: isVisible}" ref="modalWrapper">
            <div class="inner" v-if="isVisible">
                <div class="overlay" :class="{active: isVisible}" @click="hide"></div>

                <div class="modal" ref="modal">
                    <div class="header" v-if="$slots['header'] || $scopedSlots['header'] || header || subHeader">
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
        'visibilityKey'
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
    watch: {
        isVisible: function(newVal) {
            if (newVal == true) {
                this.$nextTick(() => {
                    this.copyComponentClasses()
                })
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
        copyComponentClasses() {
            // Copy component classes to the modal element
            // Get component classes
            const componentClasses = this.$el.classList
            this.$nextTick(() => {
                const modal = this.$refs.modal
                // Loop through the classes
                componentClasses.forEach(className => {
                    // Add the classes to the modal
                    if (className != 'v-portal') {
                        modal.classList.add(className)
                    }
                })
            })
        }
    },
    mounted() {
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
        }
    }
    .modal {
        position: absolute;
        z-index: 120;
        left: 50%;
        transform: translateX(-50%);
        top: 10vh;
        width: 100%;
        max-width: 848px;
        margin: 0;
        background: $bg;
        margin-bottom: 5vh;
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
        }
        .body {
            width: 100%;
            max-width: 512px;
            margin: auto;
            padding: 20px 32px 40px;
        }
    }

</style>