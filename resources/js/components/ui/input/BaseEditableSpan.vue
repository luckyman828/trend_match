<template>
    <form @submit.prevent ref="form">
        <input
            ref="inputField"
            class="editable"
            v-bind="$attrs"
            v-model="currentValue"
            :pattern="pattern"
            @input="$event => $emit('input', $event.target.value)"
            @keydown.esc="onCancel"
            @keydown.enter="onSubmit"
            @focus="onFocus"
            @blur="onBlur"
        />
    </form>
</template>

<script>
export default {
    name: 'baseEditableSpan',
    props: ['value', 'selectOnFocus', 'pattern'],
    data() {
        return {
            currentValue: this.getDefaultValue(),
            isValid: true,
            hasFocus: false,
        }
    },
    computed: {
        inputField() {
            return this.$refs.inputField
        },
        slotValue() {
            if (this.$slots.default && this.$slots.default.length) {
                return this.$slots.default[0].text
            }

            return ''
        },
    },
    watch: {
        currentValue() {
            this.$nextTick(() => {
                this.resizeWidth()
            })
        },
        value() {
            this.$nextTick(() => {
                this.currentValue = this.getDefaultValue()
            })
        },
    },
    methods: {
        getDefaultValue() {
            if (this.$slots.default && this.$slots.default.length) {
                return this.$slots.default[0].text
            }

            return ''
        },
        resizeWidth() {
            const inputField = this.$refs.inputField
            if (!inputField) return
            inputField.style.width = `calc(${inputField.value.length}ch + ${this.hasFocus ? '12px' : '2px'})`
        },
        checkValid() {
            this.isValid = this.$refs.form.checkValidity()
        },
        onSubmit() {
            const isValid = this.$refs.form.reportValidity()
            if (!isValid) return
            this.$emit('submit', this.currentValue)
            this.$emit('input', this.currentValue)
            document.activeElement.blur()
        },
        onCancel() {
            this.currentValue = this.getDefaultValue()
            this.$emit('cancel')
            document.activeElement.blur()
        },
        onFocus() {
            this.hasFocus = true
            if (this.selectOnFocus) this.$refs.inputField.select()
            this.resizeWidth()
        },
        onBlur() {
            this.hasFocus = false
            this.onCancel()
            this.resizeWidth()
        },
    },
    mounted() {
        this.resizeWidth()
    },
}
</script>

<style lang="scss" scoped>
form {
    display: inline-block;
}
.editable {
    border: none;
    display: inline;
    resize: none;
    border: $borderEl;
    border-color: transparent;
    border-radius: $borderRadiusEl;
    padding: 0;
    &:focus {
        padding: 2px 4px;
        outline: none;
        border-color: $borderColorEl;
    }
    &:invalid {
        border-color: $red;
    }
}
</style>
