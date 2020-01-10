<template>
    <div class="checkbox">
        <input type="checkbox" :checked="value" @change="$emit('input', $event.target.checked)">
        <span class="checkmark solid"><i class="fas fa-check"></i></span>
    </div>
</template>

<script>
export default {
    name: 'checkbox',
    props: [
        'value'
    ],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .checkbox {
        position: relative;
        line-height: 0;
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