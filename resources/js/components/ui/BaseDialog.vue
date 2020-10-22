<template>
    <BaseModal classes="dialog" :show="visible" @close="hide">
        <div class="body">
            <slot />
        </div>
        <div class="actions">
            <!-- Confirm -->
            <template v-if="type == 'confirm'">
                <button class="ghost lg" @click="onCancel">
                    <span>{{ cancelText || 'Cancel' }}</span>
                </button>
                <button class="lg" :class="confirmColor" @click="onConfirm">
                    <span>{{ confirmText || 'Confirm' }}</span>
                </button>
            </template>
            <template v-else>
                <button class="lg" :class="confirmColor" @click="onCancel">
                    <span>{{ confirmText || 'Okay' }}</span>
                </button>
            </template>
        </div>
    </BaseModal>
</template>

<script>
export default {
    name: 'baseDialog',
    props: ['confirmColor', 'confirmText', 'cancelText', 'type'],
    data: function() {
        return {
            visible: false,
            resolve: null,
            reject: null,
        }
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                document.addEventListener('keydown', this.hotkeyHandler)
            } else {
                document.removeEventListener('keydown', this.hotkeyHandler)
            }
        },
    },
    methods: {
        onConfirm() {
            if (this.resolve) this.resolve(true)
            this.hide()
        },
        onCancel() {
            if (this.resolve) this.resolve(false)
            this.hide()
        },
        hide() {
            if (this.resolve) this.resolve(false)
            this.visible = false
        },
        confirm() {
            this.visible = true
            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        },
        show() {
            this.visible = true
            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        },
        hotkeyHandler(e) {
            if (e.key == 'Enter' && this.type == 'confirm') {
                this.onConfirm()
            }
        },
    },
    destroyed() {
        document.removeEventListener('keydown', this.hotkeyHandler)
    },
}
</script>

<style lang="scss">
.dialog.modal-wrapper {
    .modal {
        background: white;
        width: 524px;
        > .body {
            max-width: none;
            text-align: center;
            padding: 88px 16px 32px;
        }
    }
    .icon-graphic {
        display: flex;
        width: 188px;
        justify-content: center;
        margin-bottom: 32px;
        margin: auto;
        > * {
            flex: 1;
        }
    }
}
</style>

<style lang="scss" scoped>
.body {
    max-width: 400px;
    margin: auto;
}

.actions {
    display: flex;
    margin-top: 60px;
    > * {
        flex: 1;
        &:not(:first-child) {
            margin-left: 12px;
        }
    }
}
</style>
