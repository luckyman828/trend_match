<template>
    <input
        ref="inputField"
        :type="type"
        :placeholder="placeholder"
        :value="value"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
        @blur="onBlur"
        @paste="$emit('paste', $event)"
        @focus="onFocus"
        @keydown.esc="onCancel"
        @keydown.enter="onSubmit"
        @keydown="onKeydown"
    />
</template>

<script>
export default {
    name: 'inputField',
    data: function() {
        return {
            initialValue: null,
            actionFired: false,
        }
    },
    props: [
        'type',
        'value',
        'placeholder',
        'disabled',
        'status',
        'selectOnFocus',
        'focusOnMount',
        'actionOnBlur',
        'pattern',
    ],
    computed: {
        inputField() {
            return this.$refs.inputField
        },
    },
    watch: {
        value(newVal) {
            this.$emit('change', newVal)
        },
    },
    methods: {
        onClick(e) {
            if (this.type == 'select') {
                this.$emit('click', e)
            }
        },
        focus() {
            if (!this.$refs.inputField) return
            this.$refs.inputField.focus()
        },
        select() {
            if (!this.$refs.inputField) return
            this.$refs.inputField.select()
        },
        onFocus(e) {
            this.$emit('focus', e)
            if (this.selectOnFocus) this.select()
        },
        onBlur(e) {
            this.$emit('blur', e)
            if (!this.actionFired) {
                if (this.actionOnBlur == 'Submit') this.onSubmit()
                if (this.actionOnBlur == 'Cancel') this.onCancel()
            }
            this.actionFired = false
        },
        onCancel() {
            this.actionFired = true
            this.$emit('input', this.initialValue)
            this.$emit('cancel')
        },
        onSubmit() {
            this.actionFired = true
            this.initialValue = this.value
            this.$emit('input', this.initialValue)
            this.$emit('submit', this.initialValue)
        },
        onKeydown(e) {
            if (!this.pattern) return
            // Allow navigation and deleting
            const key = e.key
            const allowedKeys = [
                'Backspace',
                'Delete',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Shift',
                'Control',
                'Alt',
                'Meta',
                'Escape',
                'Tab',
            ]
            if (e.key == 'a' && e.ctrlKey) {
                return
            }
            const passesPattern = !this.pattern || this.pattern.test(key)
            // If we fail the check
            if (!allowedKeys.includes(key) && !passesPattern) {
                console.log('stop prop')
                e.preventDefault()
                e.stopPropagation()
                return
            }
        },
    },
    mounted() {
        if (this.focusOnMount) this.focus()
    },
    created() {
        this.initialValue = this.value
    },
}
</script>

<style lang="scss" scoped></style>
