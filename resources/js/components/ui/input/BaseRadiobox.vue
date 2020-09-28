<template>
    <div class="radiobox">
        <input ref="radiobox" type="radio" :value="value" :checked="shouldBeChecked" @change="updateInput">
        <span class="radiomark"></span>
    </div>
</template>

<script>
export default {
    name: 'radiobox',
    model: {
        prop: 'modelValue',
        event: 'change'
    },
    props: [
        'value',
        'modelValue',
        'groupIndex',
        'selectedGroupIndex',
    ],
    computed: {
        shouldBeChecked() {
            let shouldBeChecked = false
            if (this.value != null || this.modelValue) {
                // Check if the modelValue (the value we bind to v-model) is an array
                if (Array.isArray(this.modelValue)) {
                    shouldBeChecked = this.modelValue.includes(this.value)
                }
                else shouldBeChecked = this.modelValue == this.value
            }
            if (this.groupIndex != null && this.groupIndex != this.selectedGroupIndex) shouldBeChecked = false
            
            return shouldBeChecked
        }
    },
    methods: {
        updateInput() {
            this.$emit('change', this.value)
        },
        check() {
            this.$refs.radiobox.click()
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .radiobox {
        font-weight: 500;
        margin-top: 2px;
        line-height: 1;
        label:hover &, &:hover {
            background: $bgModuleActive;
            .radiomark {
                border-color: $primary;
            }
        }
        .radiomark {
            border: solid 2px $fontIcon;
            height: 20px;
            width: 20px;
            min-width: 20px;
            margin-right: 10px;
        }
        input:checked + .radiomark {
            border: solid 7px $primary;
            &::after {
                content: none;
            }
        }
    }

</style>