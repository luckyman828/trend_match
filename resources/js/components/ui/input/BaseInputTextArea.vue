<template>
    <textarea class="input-textarea input-wrapper" ref="textarea" :placeholder="placeholder"
    @input="resizeTextarea($event.target); $emit('input', $event.target.value)" :value="value"/>
</template>

<script>
export default {
    name: 'baseInputTextArea',
    props: [
        'placeholder',
        'value'
    ],
    methods: {
        resizeTextarea(textarea) {
            // Avoid weird resizing when there is only 1 character in the textarea
            // if (event.target.value.length > 1) {
                textarea.style.height = ''

                // Avoid making the textarea smaller than default
                const offset = 4
                if (textarea.scrollHeight + offset > 42) {
                    textarea.style.height = textarea.scrollHeight + offset + "px"
                }
            // }
        },
        focus() {
            this.$refs.textarea.focus()
        },
        select() {
            this.$refs.textarea.select()
        }
    }
}
</script>

<style <style lang="scss" scoped>
@import '~@/_variables.scss';
.input-textarea {
    resize: none;
    max-height: 400px;
    overflow-y: auto;
}
</style>