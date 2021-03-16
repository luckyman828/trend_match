<template>
    <div class="segmented-control" :class="'theme-' + theme">
        <div
            class="option pill"
            v-for="(option, index) in options"
            :key="index"
            tabindex="-1"
            @click="setOption(index)"
            :class="[
                { active: theCurrentOptionIndex == index },
                sizeClass,
                theCurrentOptionIndex == index ? (activeClass ? activeClass : 'dark') : 'invisible ghost-hover',
            ]"
        >
            <slot :option="option" :isActive="theCurrentOptionIndex == index" />
            <span v-if="labelKey"
                >{{ option[labelKey] }}<template v-if="countKey"> ({{ option[countKey] }})</template></span
            >
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseSegmentedControl',
    props: {
        options: { default: [] },
        labelKey: { default: 'label' },
        countKey: { default: 'count' },
        valueKey: {},
        currentOptionIndex: {},
        sizeClass: {},
        theme: {},
        activeClass: {},
        value: {},
    },
    computed: {
        valueKeyToEmit() {
            const objectHasKeyValue = this.options.find(x => Object.keys(x).includes('value'))
            return this.valueKey ? this.valueKey : objectHasKeyValue ? 'value' : null
        },
        theCurrentOptionIndex() {
            if (this.currentOptionIndex != null) return this.currentOptionIndex
            if (this.valueKeyToEmit) return this.options.findIndex(option => option[this.valueKeyToEmit] == this.value)
        },
    },
    methods: {
        setOption(index) {
            const valueToEmit = this.valueKeyToEmit ? this.options[index][this.valueKeyToEmit] : index
            this.$emit('input', valueToEmit)
            this.$emit('change', valueToEmit)
        },
    },
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
    display: inline-flex;
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
