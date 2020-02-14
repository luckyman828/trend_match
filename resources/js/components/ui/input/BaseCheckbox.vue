<template>
    <div class="checkbox">
        <input ref="checkbox" type="checkbox" :value="value" :checked="shouldBeChecked" @change="updateInput">
        <span class="checkmark solid"><i class="fas fa-check"></i></span>
    </div>
</template>

<script>
export default {
    name: 'checkbox',
    model: {
        prop: 'modelValue',
        event: 'change'
    },
    props: [
        'value',
        'modelValue'
    ],
    computed: {
        shouldBeChecked() {
            if (this.value != null || this.modelValue) {
                // Check if the modelValue (the value we bind to v-model) is an array
                if (Array.isArray(this.modelValue)) {
                    return this.modelValue.includes(this.value)
                }
                else return this.modelValue == this.value
            }
        }
    },
    methods: {
        check() {
            this.$refs.checkbox.click()
        },
        updateInput(e) {
            const isChecked = e.target.checked

            if (Array.isArray(this.modelValue)) {
                let newValue = [...this.modelValue]

                if (isChecked) {
                    newValue.push(this.value)
                } else {
                    newValue.splice(newValue.indexOf(this.value), 1)
                }

                this.$emit('change', newValue)
            }
            else {
                this.$emit('change', isChecked)
            }

        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .checkbox {
        position: relative;
        line-height: 0;
        cursor: pointer;
        input[type=checkbox] {
            position: absolute;
            display: block;
            opacity: 0;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
            z-index: 1;
            &:checked + .checkmark {
                height: 18px;
                width: 18px;
                border-color: $primary;
                i {
                    font-weight: 500;
                }
            }
        }
        .checkmark {
            margin: 0;
            height: 18px;
            width: 18px;
            border: solid $dark2 1px;
            i {
                color: white;
            }
        }
        &:hover {
            .checkmark {
                border: solid 2px $primary;
            }
            input[type=checkbox] {
                &:checked + .checkmark {
                    i {
                        &::before {
                            content: '\f068'
                        }
                    }
                }
            }
        }
    }

</style>