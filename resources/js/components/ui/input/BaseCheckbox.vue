<template>
    <div class="checkbox" :class="{ disabled: disabled }">
        <input
            ref="checkbox"
            type="checkbox"
            tabindex="-1"
            :value="value"
            :checked="shouldBeChecked"
            :disabled="disabled"
            @click.shift="shiftClicked = true"
            @change="updateInput"
        />
        <span class="checkmark solid"><i class="fas fa-check"></i></span>
    </div>
</template>

<script>
export default {
    name: 'checkbox',
    model: {
        prop: 'modelValue',
        event: 'change',
    },
    props: ['value', 'modelValue', 'disabled', 'groupIndex', 'selectedGroupIndex', 'uniqueKey'],
    data: function() {
        return {
            shiftClicked: false,
        }
    },
    computed: {
        shouldBeChecked() {
            if (this.value != null || this.modelValue) {
                // Check if the modelValue (the value we bind to v-model) is an array
                if (Array.isArray(this.modelValue)) {
                    if (this.uniqueKey && this.value) {
                        return !!this.modelValue.find(x => x[this.uniqueKey] == this.value[this.uniqueKey])
                    }
                    return this.modelValue.includes(this.value)
                } else return this.modelValue == this.value
            }
        },
    },
    methods: {
        check() {
            this.$refs.checkbox.click()
        },
        updateInput(e) {
            if (this.shiftClicked) {
                this.$emit('checkRange')
                this.shiftClicked = false
                return
            }
            const isChecked = e.target.checked

            if (Array.isArray(this.modelValue)) {
                let newValue = [...this.modelValue]

                if (isChecked) {
                    newValue.push(this.value)
                } else {
                    let index
                    if (this.uniqueKey) {
                        index = newValue.findIndex(x => x[this.uniqueKey] == this.value[this.uniqueKey])
                    } else {
                        index = newValue.indexOf(this.value)
                    }
                    newValue.splice(index, 1)
                }

                this.$emit('change', newValue)
            } else {
                this.$emit('change', isChecked)
            }
        },
    },
}
</script>

<style scoped lang="scss">
.checkbox {
    position: relative;
    line-height: 0;
    cursor: auto;
    &.disabled {
        opacity: 0.5;
    }
    input[type='checkbox'] {
        position: absolute;
        display: block;
        opacity: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: auto;
        z-index: 1;
        &:checked + .checkmark {
            height: 18px;
            width: 18px;
            border-color: $grey2;
            background: $grey2;
            i {
                font-weight: 500;
            }
        }
    }
    .checkmark {
        margin: 0;
        height: 18px;
        width: 18px;
        border: solid $grey700 1px;
        i {
            color: white;
        }
    }
    &:hover,
    .input-wrapper:hover & {
        .checkmark {
            border: solid 2px $grey2;
        }
    }
}
.checkbox:not(.disabled) {
    cursor: pointer;
    input[type='checkbox'] {
        cursor: pointer;
        &:checked + .checkmark {
            border-color: $primary;
            background: $primary;
        }
    }
    .checkmark {
        border: solid $grey700 1px;
        i {
            color: white;
        }
    }
    label:hover &,
    &:hover,
    .input-wrapper:hover & {
        .checkmark {
            border: solid 2px $primary;
        }
        input[type='checkbox'] {
            &:checked + .checkmark {
                i {
                    &::before {
                        content: '\f068';
                    }
                }
            }
        }
    }
}
</style>
