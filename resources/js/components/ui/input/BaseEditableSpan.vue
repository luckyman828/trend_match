<template>
    <form @submit.prevent ref="form">
        <input
            ref="inputField"
            class="editable"
            v-bind="$attrs"
            v-model="currentValue"
            :pattern="pattern"
            @keydown.esc="onCancel"
            @keydown.enter="onSubmit"
            @focus="onFocus"
            @blur="onCancel"
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
            inputField.style.width = `calc(${inputField.value.length}ch + 10px)`
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
            if (this.selectOnFocus) this.$refs.inputField.select()
        },
    },
    mounted() {
        this.resizeWidth()
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
form {
    display: inline-block;
}
.editable {
    border: none;
    display: inline;
    padding: 2px 4px;
    resize: none;
    border: $borderEl;
    border-color: transparent;
    border-radius: $borderRadiusEl;
    &:focus {
        outline: none;
        border-color: $borderColorEl;
    }
    &:invalid {
        border-color: $red;
    }
}
</style>
