<template>
    <div class="radiobox">
        <input type="radio" :value="value" :checked="shouldBeChecked" @change="updateInput">
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
        'modelValue'
    ],
    computed: {
        shouldBeChecked() {
            return this.modelValue == this.value
        }
    },
    methods: {
        updateInput() {
            this.$emit('change', this.value)
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .radiobox {
        font-weight: 500;
        &:hover {
            background: $bgContentActive;
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