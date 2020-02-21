<template>
    <div class="toggle" @click="toggle">
        <span class="option" v-for="(option, index) in options" :key="index" :class="{active: activeOption == index}">{{option}}</span>
    </div>
</template>

<script>
export default {
    name: 'toggle',
    props: [
        'options',
        'defaultOption'
    ],
    data: function () { return {
        activeOption: 0,
    }},
    methods: {
        toggle () {
            if (this.options.length > 1) {
                if (this.activeOption == this.options.length - 1)
                    this.activeOption = 0
                else this.activeOption ++
                this.$emit('input', this.options[this.activeOption])
            }
        }
    },
    mounted() {
        if (this.defaultOption) {
            this.activeOption = this.defaultOption - 1
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .toggle {
        border: solid 1px $light2;
        border-radius: 50px;
        user-select: none;
        cursor: pointer;
        .option {
            font-size: 12px;
            padding: 6px 14px;
            font-weight: 700;
            color: $dark2;
            text-transform: uppercase;
            display: inline-block;
            &.active {
                color: $dark;
                background: $light2;
                border-radius: 50px;
            }
        }
    }
</style>