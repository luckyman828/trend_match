<template>
    <div class="input-field">
        <input ref="inputField" class="input-wrapper" :type="type" :id="id" :placeholder="placeholder" :autocomplete="autocomplete"
        :class="{'error': error}"
        @input="$emit('input', $event.target.value); value = $event.target.value" @blur="$emit('blur', $event)" @paste="$emit('paste', $event)">
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
        value: ''
    }},
    props: [
        'type',
        'autocomplete',
        'placeholder',
        'id'

    ],
    computed: {
        inputField() {
            return this.$refs.inputField
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .input-wrapper {
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