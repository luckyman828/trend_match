<template>
    <div class="edit-input-wrapper" :class="[{ active: editActive }, { disabled: disabled }]">
        <div class="input-parent controls-right controls-inside control-items-2" @click="setActive">
            <input
                ref="input"
                :id="id"
                class="input-wrapper"
                :type="type"
                v-model="localValue"
                autocomplete="off"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="{ error: error }"
                v-tooltip="error"
                step="any"
                :pattern="pattern"
                :maxlength="maxlength"
                @focus="setActive"
                @blur="onBlur"
                @keyup.enter="!error && submit()"
                @keydown.esc.stop
                @keyup.esc="cancel"
                @keyup="
                    change($event)
                    validateInput($event)
                "
                @keydown="validateAndSave"
            />

            <div class="controls" v-if="!editActive && !disabled">
                <button v-tooltip.top="'Edit'" class="edit" tabindex="-1"><i class="far fa-pen"></i></button>
                <button
                    v-if="value != oldValue"
                    v-tooltip.top="`Revert to original (${oldValue})`"
                    tabindex="-1"
                    @click.stop="revert"
                    class="square true-square yellow-green"
                >
                    <span>E</span>
                </button>
            </div>
        </div>
        <div class="buttons">
            <div class="hotkey-wrapper" v-tooltip="error">
                <button class="primary" :disabled="error" tabindex="-1" @click="submit">
                    <span>Save</span>
                </button>
                <span class="hotkey"><span class="key">Enter</span> Enter</span>
            </div>
            <button class="button ghost" tabindex="-1" @click="cancel"><span>Cancel</span></button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'editInputWrapper',
    props: [
        'type',
        'value',
        'oldValue',
        'placeholder',
        'id',
        'maxlength',
        'pattern',
        'activateOnMount',
        'disabled',
        'error',
        'submitOnBlur',
    ],
    data: function() {
        return {
            editActive: false,
            localValue: this.value,
            savedValue: null,
            blurFromSubmit: false,
        }
    },
    watch: {
        value: function(newVal) {
            this.localValue = newVal
        },
    },
    methods: {
        change(e) {
            // this.$emit('change', e.target.value)
            this.$emit('change', this.localValue)
        },
        emit() {
            this.$emit('input', this.localValue)
            // this.$emit('input', this.$refs.input.value)
        },
        submit() {
            this.emit()
            this.$emit('submit', this.localValue)
            // this.$emit('submit', this.$refs.input.value)
            this.blurFromSubmit = true
            this.editActive = false
            document.activeElement.blur()
        },
        onBlur() {
            if (this.submitOnBlur) {
                if (this.localValue != this.oldValue && !this.error) {
                    if (!this.blurFromSubmit) {
                        this.submit()
                    }
                } else {
                    this.cancel()
                }
            }
            this.blurFromSubmit = false
        },
        setActive() {
            if (this.disabled) return
            const el = this.$refs.input
            el.focus()
            el.select()
            this.editActive = true
            this.$emit('activate')
        },
        cancel() {
            this.editActive = false
            this.localValue = this.value
            document.activeElement.blur()
            this.$emit('cancel')
        },
        revert(e) {
            e.preventDefault()
            this.$emit('input', this.oldValue)
            this.$emit('revert')
        },
        validateAndSave(e) {
            if (this.pattern) {
                const regex = new RegExp(this.pattern)
                if (regex.test(e.target.value)) {
                    this.savedValue = e.target.value
                }
            }
        },
        validateInput(e) {
            // Then check if we have a pattern. If we do, don't allow anything that doesn't match the pattern to be entered
            if (this.pattern) {
                const regex = new RegExp(this.pattern)
                if (!regex.test(e.target.value)) {
                    this.localValue = this.savedValue
                }
            }
        },
    },
    mounted() {
        // Set default active state
        if (this.activateOnMount) this.setActive()
    },
}
</script>

<style scoped lang="scss">
.edit-input-wrapper {
    line-height: 1.6;
    .input-wrapper {
        width: 100%;
        &.error {
            border-color: $red;
        }
    }
    &:not(.active) {
        cursor: pointer;
        .input-wrapper,
        .input {
            transition: 0.3s;
            cursor: pointer;
            &:disabled {
                cursor: text;
                background: $bg;
            }
        }
        .buttons {
            display: none;
        }
    }
    .input-parent {
        .edit {
            opacity: 0;
            transition: 0.2s;
        }
        &:hover {
            .edit {
                opacity: 1;
            }
        }
    }
    &.active {
        .input-parent {
            .edit {
                opacity: 1;
            }
        }
    }
    .buttons {
        margin-top: 8px;
        display: flex;

        > *:not(:last-child) {
            margin-right: 8px;
        }
        button {
            min-width: 80px;
        }
    }
}
</style>
