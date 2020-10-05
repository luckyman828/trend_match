<template>
    <div class="segmented-control">
        <div
            class="option pill dark"
            v-for="(option, index) in options"
            :key="index"
            @click="setOption(index)"
            :class="[
                { active: currentOptionIndex == index },
                sizeClass,
                currentOptionIndex == index ? '' : 'invisible ghost-hover',
            ]"
        >
            <slot :option="option" :isActive="currentOptionIndex == index" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseSegmentedControl',
    props: ['options', 'currentOptionIndex', 'sizeClass'],
    methods: {
        setOption(index) {
            this.$emit('input', index);
            this.$emit('change', index);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.segmented-control {
    padding: 2px;
    background: $grey;
    border-radius: 50px;
    .option {
        &:not(:first-child) {
            margin-left: 4px;
        }
    }
}
</style>
