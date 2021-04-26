<template>
    <div class="base-input-shape" @click="$refs.input.focus()">
        <BaseInput
            v-bind="$attrs"
            ref="input"
            size="1"
            :selectOnFocus="true"
            :value="value"
            :style="{ maxWidth }"
            @input.native="onInput"
            @focus.native="$emit('focus', $event)"
            @blur.native="$emit('blur', $event)"
            @keydown.native="$emit('keydown', $event)"
            @keydown.up.native="onIncrement"
            @keydown.down.native="onDecrement"
        />
        <slot />
    </div>
</template>

<script>
export default {
    name: 'baseInputShape',
    props: ['selectOnFocus', 'value', 'isNumber'],
    computed: {
        maxWidth() {
            const valueLength = this.value ? this.value.toString().length : 0
            return `calc(${Math.max(valueLength, 1)}ch + 10px)`
        },
    },
    methods: {
        onInput(e) {
            this.$emit('input', e.target.value)
            const newInput = e.target.value ? e.target.value : ''
            e.target.size = Math.max(newInput.length, 1)
        },
        setFocus() {
            this.$refs.input.focus()
        },
        onDecrement(e) {
            if (!this.isNumber) return
            e.preventDefault()
            this.$emit('input', this.value - 1)
        },
        onIncrement(e) {
            if (!this.isNumber) return
            e.preventDefault()
            this.$emit('input', this.value + 1)
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.base-input-shape {
    position: relative;
    border: solid 2px transparent;
    &:focus-within {
        border-color: $primary;
    }
}
input {
    border: none;
    background: transparent;
    width: 100%;
    height: 100%;
    position: absolute;
    &:focus {
        border: none;
        outline: none;
    }
}
</style>
