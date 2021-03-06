<template>
    <div
        class="input-field"
        :class="[
            type,
            { 'read-only': readOnly || type == 'copy' },
            { error: error || errorTooltip },
            status,
            { 'has-label': label },
            { 'has-inner-label': innerLabel },
            { 'has-icon-right': !!$slots.default },
            theme && `theme-${theme}`,
            inputClass,
        ]"
    >
        <div
            v-tooltip.top="errorTooltip"
            :class="[{ 'input-wrapper': type == 'select' }, inputClass]"
            @click="onClick"
            :tabindex="type == 'select' ? 0 : -1"
        >
            <label v-if="label" class="label" v-html="label" :for="id ? id : `uid-${_uid}`"></label>
            <span v-if="innerLabel" class="inner-label" v-html="innerLabel"></span>
            <input
                ref="inputField"
                :type="type"
                :id="id ? id : `uid-${_uid}`"
                :placeholder="placeholder"
                :autocomplete="autocomplete"
                :value="value"
                :disabled="disabled || readOnly || type == 'copy'"
                v-bind="$attrs"
                :class="[{ 'input-wrapper': type != 'select' }, inputClass]"
                @input="$emit('input', $event.target.value)"
                @blur="onBlur"
                @paste="$emit('paste', $event)"
                @focus="onFocus"
                @keydown.esc="onCancel"
                @keydown.enter="onSubmit"
                @keydown="onKeydown"
            />
            <div class="icon-right">
                <slot :onCancel="onCancel" :onSubmit="onSubmit" :activate="focus" :copy="onCopy" />
            </div>
        </div>
        <div class="error-msg" v-if="error && typeof error == 'string'">
            <i class="far fa-exclamation-triangle"></i>
            <span v-html="error"></span>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
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
        'status',
        'label',
        'inputClass',
        'selectOnFocus',
        'focusOnMount',
        'actionOnBlur',
        'innerLabel',
        'pattern',
        'theme',
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
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        onClick(e) {
            if (this.type == 'select') {
                this.$emit('click', e)
            }
            if (this.type == 'copy') {
                this.onCopy()
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
        onCopy() {
            this.copyToClipboard(this.value)
            this.SHOW_SNACKBAR({ iconClass: 'fa-copy', type: 'info', msg: 'Copied to clipboard' })
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
            if (e.key == 'A' && e.ctrlKey) return
            const passesPattern = !this.pattern || this.pattern.test(key)
            // If we fail the check
            if (!allowedKeys.includes(key) && !passesPattern) {
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

<style lang="scss" scoped>
.input-field {
    position: relative;
    &.copy {
        cursor: pointer;
        &.theme-light {
            input {
                border: solid 2px transparent;
                cursor: pointer;
            }
            &:hover {
                input {
                    border-color: $themeLightBorderHover;
                }
            }
        }
    }
    &.lg {
        height: 48px;
    }
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
        &:not(.read-only) {
            .input-wrapper,
            input {
                cursor: pointer;
            }
        }
    }
    &.has-inner-label {
        .input-wrapper {
            padding-top: 16px;
            input {
                font-weight: 700;
                font-size: 12px;
                padding: 0;
            }
        }
        .inner-label {
            color: $primary;
            position: absolute;
            left: 8px;
            top: 2px;
            z-index: 1;
            font-size: 10px;
            white-space: nowrap;
            overflow: hidden;
            width: calc(100% - 32px);
            text-overflow: ellipsis;
        }
        &.sm,
        &.small {
            .input-wrapper {
                padding-top: 8px;
            }
            .inner-label {
                top: 0;
                font-size: 8px;
            }
        }
        &.lg {
            .input-wrapper {
                padding-top: 20px;
                padding-left: 12px;
                border-radius: $borderRadiusMd;
                height: 48px;
            }
            .inner-label {
                left: 12px;
                top: 8px;
                line-height: 1;
            }
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
    &.warning {
        .input-wrapper {
            border: solid 2px $warning;
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
    &.theme-light {
        .input-wrapper {
            background: $themeLightBg;
            font-size: 12px;
            font-weight: 800;
            padding-left: 12px;
            &:not(:focus) {
                border-color: transparent;
            }
        }
        .inner-label {
            font-size: 10px;
            font-weight: 500;
            color: $themeLightFontSoft;
        }
    }
}
.input-wrapper {
    position: relative;
    text-overflow: ellipsis;
    width: 100%;
    input {
        border: none;
        background: inherit;
        width: 100%;
        text-overflow: ellipsis;
        color: inherit;
    }
    &.small,
    &.sm {
        + .icon-left,
        .icon-left,
        + .icon-right,
        .icon-right {
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
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &.icon-right {
        left: auto;
        right: 8px;
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
