<template>
    <div
        class="input-wrapper focus-visible content-editable multiline"
        :contenteditable="!disabled"
        :class="[{ disabled: disabled }, { placeholder: showPlaceholder }]"
        @input="onInput"
        @focus="hasFocus = true"
        @blur="onBlur"
        v-html="showPlaceholder ? placeholder : localValue"
    ></div>
</template>

<script>
export default {
    name: 'baseContentEditable',
    props: ['value', 'placeholder', 'disabled'],
    model: {
        prop: 'value',
        event: 'input',
    },
    data: function() {
        return {
            hasFocus: false,
            localValue: '',
        }
    },
    computed: {
        showPlaceholder() {
            return !this.localValue && !this.hasFocus
        },
        currentCursorPos() {},
        labelCursorPos() {},
    },
    watch: {
        value(newVal) {
            const currentValue = this.$el.innerHTML
            if (newVal != currentValue) {
                this.localValue = newVal
                this.$nextTick(() => {
                    this.setCaret()
                })
            }
        },
    },
    methods: {
        onInput(e) {
            let newValue = e.target.innerHTML
            if (e.target.innerText.length <= 0) {
                newValue = ''
                this.localValue = ''
            }
            this.$emit('input', newValue)
        },
        onBlur() {
            this.localValue = this.$el.innerHTML
            this.hasFocus = false
        },
        setCaret(pos) {
            var el = this.$el
            var range = document.createRange()
            var sel = window.getSelection()
            const lastNode = el.childNodes[el.childNodes.length - 1]

            range.setStart(lastNode, pos ? pos : lastNode.length)
            range.collapse(true)

            sel.removeAllRanges()
            sel.addRange(range)
        },
    },
}
</script>

<style <style lang="scss" scoped>
@import '~@/_variables.scss';
.content-editable {
    white-space: pre-wrap;
    word-wrap: break-word;
}
.placeholder {
    color: grey;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
::v-deep {
    .label {
        user-select: none;
        cursor: default;
        color: $primary;
    }
}
</style>
