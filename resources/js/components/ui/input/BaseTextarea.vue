<template>
    <textarea
        class=""
        ref="textarea"
        rows="1"
        :placeholder="placeholder"
        :class="[{ disabled: disabled || readOnly }, { empty: value.length <= 0 }, { 'inherit-style': inheritStyles }]"
        :disabled="disabled || readOnly"
        @input="$emit('input', $event.target.value)"
        :value="value"
        @keydown.esc="onCancel"
        @keydown.enter.exact.prevent="onSubmit"
        @focus="$emit('update:hasFocus', true)"
        @blur="
            $emit('update:hasFocus', false)
            $emit('blur')
        "
    />
</template>

<script>
export default {
    name: 'baseTextarea',
    props: ['placeholder', 'value', 'disabled', 'readOnly', 'inheritStyles'],
    data() {
        return {
            oldVal: null,
        }
    },
    watch: {
        value(newVal, oldVal) {
            if (newVal != oldVal) {
                this.$nextTick(() => {
                    this.resize()
                })
            }
        },
    },
    methods: {
        resize() {
            const textarea = this.$refs.textarea
            // Avoid weird resizing when there is only 1 character in the textarea
            // if (event.target.value.length > 1) {
            textarea.style.height = ''

            // Avoid making the textarea smaller than default
            const offset = 4
            if (textarea.scrollHeight + offset > 42) {
                textarea.style.height = textarea.scrollHeight + offset + 'px'
            }
            // }
        },
        focus() {
            this.oldVal = this.value
            this.$refs.textarea.focus()
        },
        select() {
            this.$refs.textarea.select()
        },
        onCancel() {
            this.$emit('input', this.oldVal)
            this.$emit('blur')
        },
        onSubmit() {
            this.$emit('submit')
        },
    },
    mounted() {
        this.resize()
    },
}
</script>

<style scoped lang="scss">
textarea {
    resize: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    &::first-line,
    &::placeholder,
    &.empty {
        line-height: 14px;
    }
    &.inherit-style {
        display: inherit;
        background: inherit;
        color: inherit;
        border: inherit;
        font-weight: inherit;
        font-size: inherit;
        overflow: inherit;
        word-break: inherit;
        white-space: inherit;
        word-wrap: inherit;
        padding: inherit;
        outline: inherit;
        max-width: 100%;
        &::first-line,
        &::placeholder,
        &.empty {
            line-height: inherit;
        }
    }
}
</style>
