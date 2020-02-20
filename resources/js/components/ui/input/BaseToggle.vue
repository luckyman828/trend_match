<template>
    <div class="toggle" @click="toggle">
        <span class="option" v-for="(option, index) in options" :key="index" :class="{active: value == option.value}">
            <span v-if="option.count != null" class="count">{{option.count}}</span>
            <span>{{option.label}}</span>
        </span>
    </div>
</template>

<script>
export default {
    name: 'baseToggle',
    props: [
        'options',
        'currentOption',
        'value'
    ],
    data: function () { return {
        activeOption: 0,
    }},
    methods: {
        toggle () {
            // Emit the option that is not the current option
            let valueToEmit
            // find the index of the active option
            const activeOptionIndex = this.options.findIndex(x => x.value == this.value)
            // If it is the last option then start from 0. Otherwise increment the active option
            if (activeOptionIndex == this.options.length-1) {
                valueToEmit = this.options[0].value 
            } else {
                valueToEmit = this.options[activeOptionIndex+1].value 
            }
            this.$emit('input', valueToEmit)
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .toggle {
        display: inline-flex;
        border: solid 1px $light2;
        border-radius: 50px;
        user-select: none;
        cursor: pointer;
        background: $bg;
        height: 40px;
        .option {
            display: flex;
            align-items: center;
            padding: 0 32px 0 12px;
            font-weight: 700;
            color: $dark2;
            border: solid 2px transparent;
            border-radius: 50px;
            &.active {
                color: $primary;
                background: $bgContent;
                border-color: $primary;
            }
            .count {
                padding: 0 8px;
                background: white;
                border-radius: 40px;
                margin-right: 8px;
                font-size: 12px;
                font-weight: 500;
                color: $font;
                height: 20px;
                line-height: 20px;
            }
        }
    }
</style>