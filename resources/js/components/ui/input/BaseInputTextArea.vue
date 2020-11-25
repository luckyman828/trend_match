<template>
    <div class="input-textarea" :class="{ 'read-only': disabled || readOnly }">
        <textarea
            class="input-wrapper focus-visible"
            ref="textarea"
            :placeholder="placeholder"
            :class="{ disabled: disabled || readOnly }"
            :disabled="disabled || readOnly"
            @input="
                resize()
                $emit('input', $event.target.value)
            "
            :value="value"
        >
            <span>label</span> hello hello
        </textarea>
    </div>
</template>

<script>
export default {
    name: 'baseInputTextArea',
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

<style <style lang="scss" scoped>
@import '~@/_variables.scss';
.input-textarea {
    &.read-only {
        .input-wrapper {
            cursor: text;
            background: $bgElInactive;
            &.disabled {
                color: $fontBody;
            }
        }
    }
}

textarea {
    resize: none;
    max-height: 200px;
    overflow-y: auto;
}
</style>
