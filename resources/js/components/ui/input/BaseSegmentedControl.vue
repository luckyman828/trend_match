<template>
    <div class="segmented-control" :class="'theme-' + theme">
        <div
            class="option pill"
            v-for="(option, index) in options"
            :key="index"
            tabindex="-1"
            @click="setOption(index)"
            :class="[
                { active: currentOptionIndex == index },
                sizeClass,
                currentOptionIndex == index ? (activeClass ? activeClass : 'dark') : 'invisible ghost-hover',
            ]"
        >
            <slot :option="option" :isActive="currentOptionIndex == index" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseSegmentedControl',
    props: ['options', 'currentOptionIndex', 'sizeClass', 'theme', 'activeClass'],
    methods: {
        setOption(index) {
            this.$emit('input', index)
            this.$emit('change', index)
        },
    },
    computed: {},
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.segmented-control {
    padding: 2px;
    background: $grey;
    &.theme-light {
        background: $bluegrey250;
    }
    border-radius: 50px;
    white-space: nowrap;
    display: flex;
    cursor: pointer;
    .option {
        display: flex;
        &:not(:first-child) {
            margin-left: 4px;
        }
        &.active {
            box-shadow: 0 3px 6px rgba($dark, 0.2);
        }
    }
}
</style>
