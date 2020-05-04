<template>
    <BaseModal classes="dialog"
    :show="visible" @hide="hide">
        <slot/>
        <div class="actions">
            <button class="ghost lg" @click="onCancel">
                <span>{{cancelText || 'Cancel'}}</span>
            </button>
            <button class="lg" :class="confirmColor" @click="onConfirm">
                <span>{{confirmText || 'Confirm'}}</span>
            </button>
        </div>
    </BaseModal>
</template>

<script>
export default {
    name: 'baseDialog',
    props: [
        'confirmColor',
        'confirmText',
        'cancelText',
    ],
    data: function() { return {
        visible: false,
        resolve: null,
        reject: null,
    }},
    methods: {
        onConfirm() {
            this.resolve(true)
            this.hide()
        },
        onCancel() {
            this.resolve(false)
            this.hide()
        },
        hide() {
            this.visible = false
        },
        confirm() {
            this.visible = true
            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        }
    }
}
</script>

<style lang="scss">
    .dialog.modal-wrapper {
        .modal {
            background: white;
            width: 524px;
            .body {
                max-width: none;
                text-align: center;
                padding: 88px 16px 32px;
            }
        }
    }
</style>

<style lang="scss" scoped>

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