<template>

    <div class="checkbox-buttons">
        <label v-for="(option, index) in options" :key="index" :class="{active: selected.find(x => x == option)}" class="checkbox">
            <input v-if="optionValueKey" type="checkbox" :value="option[optionValueKey]" v-model="selected" @change="change()">
            <input v-else type="checkbox" :value="option" v-model="selected" @change="change()">
            <span class="checkmark"></span>
            <template v-if="optionNameKey">
                {{option[optionNameKey]}}
            </template>
            <template v-else>
                {{option}}
            </template>
        </label>
    </div>

</template>

<script>
export default {
    name: 'checkboxButtons',
    props: [
        'options',
        'optionNameKey',
        'optionValueKey'
    ],
    data: function () { return {
        selected: [],
        collapsed: true,
    }},
    computed: {
    },
    methods: {
        submit() {
            this.$emit('input', this.selected)
            this.$emit('submit', this.selected)
        },
        change() {
            this.$emit('change', this.selected)
        },
        clear () {
            this.selected = []
            document.querySelectorAll('input[type=checkbox]').forEach(input => {
                input.checked = false
            })
            this.$emit('input', this.selected)
        },
    },
    updated() {
    },
    destroyed() {
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .header {
        text-align: center;
    }
    .bubble {
        position: absolute;
        left: -10px;
        top: -10px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        background: $light1;
        box-shadow: 0 3px 6px rgba(black, 10%);
        text-align: center;
        border-radius: 10px;
    }

</style>