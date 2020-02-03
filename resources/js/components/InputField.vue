<template>
    <div class="input-field" :class="[type, {'read-only': readOnly}, {'error': error || errorTooltip}, {'has-label': label}]">
        <div v-tooltip.top="errorTooltip" :class="{'input-wrapper': type == 'select'}" @click="onClick">
            <span v-if="label" class="label" v-html="label"></span>
            <input ref="inputField" :type="type" :id="id" :placeholder="placeholder" :autocomplete="autocomplete"
            :value="value" :disabled="disabled"
            :class="{'input-wrapper': type != 'select'}" 
            @input="$emit('input', $event.target.value)" @blur="$emit('blur', $event)" @paste="$emit('paste', $event)">
            <i v-if="type == 'select'" class="fas fa-caret-down"></i>
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
    data: function() {return {
        error: null,
    }},
    props: [
        'type',
        'value',
        'autocomplete',
        'placeholder',
        'id',
        'disabled',
        'readOnly',
        'errorTooltip',
        'label'
    ],
    computed: {
        inputField() {
            return this.$refs.inputField
        }
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
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .input-field {
        &.select {
            .has-label {
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
                    line-height: 0;
                    position: absolute;
                    bottom: 4px;
                }
            }
            .input-wrapper, input {
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
    }
    .input-wrapper {
        position: relative;
        input {
            border: none;
            background: inherit;
        }
            i {
                position: absolute;
                right: 0;
                top: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
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