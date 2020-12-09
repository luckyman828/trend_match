<template>
    <textarea
        class=""
        ref="textarea"
        rows="1"
        :placeholder="placeholder"
        :class="[{ disabled: disabled || readOnly }, { empty: value.length <= 0 }]"
        :disabled="disabled || readOnly"
        @input="$emit('input', $event.target.value)"
        :value="value"
        @focus="$emit('update:hasFocus', true)"
        @blur="$emit('update:hasFocus', false)"
    />
</template>

<script>
export default {
    name: 'baseTextarea',
    props: ['placeholder', 'value', 'disabled', 'readOnly'],
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
            this.$refs.textarea.focus()
        },
        select() {
            this.$refs.textarea.select()
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
}
</style>
