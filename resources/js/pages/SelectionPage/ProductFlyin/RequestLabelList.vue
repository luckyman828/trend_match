<template>
    <div class="request-label-list" v-close-popover v-observe-visibility="visibilityChanged">
        <div class="label-list-item flex-list" @click="removeLabel">
            <span>#0</span>
            <span>Remove label</span>
        </div>
        <div
            class="label-list-item flex-list"
            v-for="(label, index) in availableRequestLabels"
            :key="label"
            @click="insertLabel(label)"
        >
            <span>#{{ index + 1 }}</span>
            <span>{{ label }}</span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'requestLabelList',
    props: ['request', 'selectionInput'],
    computed: {
        ...mapGetters('requests', {
            availableRequestLabels: 'getAvailableRequestLabels',
        }),
    },
    methods: {
        ...mapActions('requests', ['insertOrUpdateRequest']),
        insertLabel(newLabel) {
            this.request.labels.splice(0, 1, newLabel)
            this.onUpdateRequest()
        },
        removeLabel() {
            this.request.labels.splice(0)
            this.onUpdateRequest()
        },
        onUpdateRequest() {
            this.insertOrUpdateRequest({ selectionInput: this.selectionInput, request: this.request })
            this.$emit('update')
        },
        visibilityChanged(isVisible) {
            if (isVisible) {
                this.addListeners()
            } else {
                this.removeListeners()
            }
        },
        keydownHandler(event) {
            // Label hotkeys
            if (parseInt(event.key) != null) {
                const pressedNumber = event.key
                const label = this.availableRequestLabels[pressedNumber - 1]

                if (pressedNumber == 0) {
                    this.request.labels.splice(0, 1)
                    this.onUpdateRequest()
                }

                if (!label) return

                // Check if the label is already added
                const exists = this.request.labels[0] == label
                if (exists || pressedNumber == 0) {
                    this.request.labels.splice(0, 1)
                } else {
                    this.request.labels.splice(0, 1, label)
                }
                this.onUpdateRequest()
            }
        },
        addListeners() {
            document.addEventListener('keydown', this.keydownHandler)
        },
        removeListeners() {
            document.removeEventListener('keydown', this.keydownHandler)
        },
    },
    destroyed() {
        this.removeListeners()
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.request-label-list {
    padding: 8px 0;
    .label-list-item {
        padding: 0 8px;
        height: 32px;
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 13px;
        cursor: pointer;
        &.focus {
            background: $primary;
            color: white;
        }
        &:hover {
            background: $primary;
            color: white;
        }
    }
}
</style>
