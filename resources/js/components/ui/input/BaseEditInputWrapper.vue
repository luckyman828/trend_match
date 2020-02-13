<template>
    <div class="edit-input-wrapper" :class="{active: editActive}">
        <div class="input-parent controls-right controls-inside control-items-2" @click="setActive">
            <input ref="input" :id="id" class="input-wrapper" :type="type" :value="value" :placeholder="placeholder"
            @keyup.enter="submit" @keydown.esc.stop @keyup.esc="cancel" @keyup="change" step="any" @keydown="validateInput" :maxlength="maxlength" :pattern="pattern">
            <div class="controls" v-if="!editActive">
                <button v-tooltip.top="'Edit'" class="edit"><i class="far fa-pen"></i></button>
                <button v-if="value != oldValue" v-tooltip.top="`Revert to original (${oldValue})`" @click.stop="revert" class="square true-square yellow-green"><span>E</span></button>
            </div>
        </div>
        <div class="buttons">
            <div class="hotkey-wrapper">
                <button class="green" @click="submit"><span>Save</span></button>
                <span class="hotkey"><span class="key">Enter</span> Enter</span>
            </div>
            <button class="button ghost" @click="cancel"><span>Cancel</span></button>
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
        'activateOnMount'
    ],
    data: function () { return {
        editActive: false,
    }},
    methods: {
        change(e) {
            this.$emit('change', e.target.value)
        },
        emit() {
            this.$emit('input', this.$refs.input.value)
        },
        submit() {
            this.emit()
            this.$emit('submit', this.$refs.input.value)
            this.editActive = false
            document.activeElement.blur()
        },
        setActive() {
            const el = this.$refs.input
            el.focus()
            el.select()
            this.editActive = true
        },
        cancel() {
            this.editActive = false
            document.activeElement.blur()
            this.$emit('cancel')
        },
        revert(e) {
            e.preventDefault()
            this.$emit('input', this.oldValue)
            this.$emit('revert')
        },
        validateInput(e) {
            // First check if the key presses was Enter or Escape and don't do anything if true
            if (e.key == "Escape" || e.key == "Enter" || e.key == "Backspace") return
            // Then check if we have a pattern. If we do, don't allow anything that doesn't match the pattern to be entered
            if(this.pattern) {
                const regex = new RegExp(this.pattern)
                if(!regex.test(e.key))
                    e.preventDefault()
            }
        },
    },
    mounted() {
        // Set default active state
        if (this.activateOnMount) this.setActive()
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .edit-input-wrapper {
        line-height: 1.6;
        &:not(.active) {
            cursor: pointer;
            .input-wrapper {
                transition: .3s;
                cursor: pointer;
            }
            .buttons {
                display: none;
            }
        }
        .input-parent {
            .edit {
                opacity: 0;
                transition: .2s;
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
                margin-right: 16px;
            }
            button {
                min-width: 80px;
            }
        }
    }
</style>