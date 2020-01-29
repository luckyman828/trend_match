<template>
    <div class="input-field" :class="type">
        <div :class="[{'read-only': readOnly}, {'input-wrapper': type == 'select'}]" @click="onClick">
            <input ref="inputField" :type="type" :id="id" :placeholder="placeholder" :autocomplete="autocomplete"
            :class="[{'read-only': readOnly}, {'error': error}, {'input-wrapper': type != 'select'}]" :value="value" :disabled="disabled"
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
        'readOnly'
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
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .input-field {
        &.select {
            .input-wrapper, input {
                cursor: pointer;
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
        &.error {
            border: solid 2px $fail;
            & + .error-msg {
                display: flex;
            }
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