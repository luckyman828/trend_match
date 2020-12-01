<template>
    <div
        class="input-field"
        :class="[
            type,
            { 'read-only': readOnly },
            { error: error || errorTooltip },
            { 'has-label': label },
            { 'has-icon-right': !!$slots.default },
        ]"
    >
        <div v-tooltip.top="errorTooltip" :class="[{ 'input-wrapper': type == 'select' }, inputClass]" @click="onClick">
            <span v-if="label" class="label" v-html="label"></span>
            <input
                ref="inputField"
                :type="type"
                :id="id"
                :placeholder="placeholder"
                :autocomplete="autocomplete"
                :value="value"
                :disabled="disabled || readOnly"
                v-bind="$attrs"
                :class="[{ 'input-wrapper': type != 'select' }, inputClass]"
                @input="$emit('input', $event.target.value)"
                @blur="onBlur"
                @paste="$emit('paste', $event)"
                @focus="onFocus"
                @keydown.esc="onCancel"
                @keydown.enter="onSubmit"
            />
            <div class="icon-right">
                <slot :onCancel="onCancel" :onSubmit="onSubmit" />
            </div>
        </div>
        <div class="error-msg" v-if="error && typeof error == 'string'">
            <i class="far fa-exclamation-triangle"></i>
            <span v-html="error"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'inputField',
    data: function() {
        return {
            error: null,
            initialValue: null,
            actionFired: false,
        }
    },
    props: [
        'type',
        'value',
        'autocomplete',
        'placeholder',
        'id',
        'disabled',
        'readOnly',
        'errorTooltip',
        'label',
        'inputClass',
        'selectOnFocus',
        'focusOnMount',
        'actionOnBlur',
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
            this.$refs.inputField.focus()
        },
        select() {
            this.$refs.inputField.select()
        },
        onFocus() {
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
    },
    mounted() {
        if (this.focusOnMount) this.focus()
    },
    created() {
        this.initialValue = this.value
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.input-field {
    position: relative;
    &.read-only {
        .input-wrapper {
            cursor: text;
            background: $bgElInactive;
        }
    }
    &.select {
        &.has-label {
            .label {
                color: $primary;
                position: absolute;
                top: 2px;
                z-index: 1;
                font-size: 10px;
                white-space: nowrap;
                overflow: hidden;
                width: calc(100% - 12px - 32px);
            }
            input {
                margin-top: 6px;
            }
        }
        .input-wrapper,
        input {
            cursor: pointer;
        }
    }
    &.error {
        .input-wrapper {
            border: solid 2px $fail;
        }
        .error-msg {
            display: flex;
        }
    }
    &.has-icon-right {
        .input-wrapper {
            padding-right: 36px;
        }
    }
}
.input-wrapper {
    position: relative;
    text-overflow: ellipsis;
    input {
        border: none;
        background: inherit;
        width: 100%;
        text-overflow: ellipsis;
    }
    &.small {
        + .icon-left,
        + .icon-right {
            width: 32px;
            height: 32px;
        }
    }
}
.icon-left,
.icon-right {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.icon-right {
        left: auto;
        right: 0;
    }
}
.error-msg {
    display: none;
    margin-top: 4px;
    font-size: 12px;
    > i {
        margin-right: 6px;
        margin-top: 3px;
    }
}
</style>
