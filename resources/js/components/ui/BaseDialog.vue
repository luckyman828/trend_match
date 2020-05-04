<template>
    <BaseModal classes="dialog"
    :show="visible" @close="hide">
        <slot/>
        <div class="actions">
            <!-- Confirm -->
            <template v-if="type == 'confirm'">
                <button class="ghost lg" @click="onCancel">
                    <span>{{cancelText || 'Cancel'}}</span>
                </button>
                <button class="lg" :class="confirmColor" @click="onConfirm">
                    <span>{{confirmText || 'Confirm'}}</span>
                </button>
            </template>
            <template v-else>
                <button class="lg" :class="confirmColor" @click="onCancel">
                    <span>{{confirmText || 'Okay'}}</span>
                </button>
            </template>
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
        'type'
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
        .icon-graphic {
            display: flex;
            width: 188px;
            justify-content: space-between;
            margin-bottom: 32px;
            margin: auto;
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