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
                theCurrentOptionIndex == index ? (activeClass ? activeClass : 'dark') : 'no-bg ghost-hover',
            ]"
        >
            <slot :option="option" :isActive="theCurrentOptionIndex == index" />
            <span v-if="labelKey">{{ option[labelKey] }} </span>
            <span class="dark xxs pill count" v-if="countKey && option[countKey] != null">
                <span>{{ option[countKey] }}</span>
            </span>
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
.segmented-control {
    padding: 2px;
    background: $grey;
    &.theme-light {
        background: $bluegrey250;
        .option {
            font-weight: 700;
            color: black;
            i {
                color: black;
            }
        }
    }
    border-radius: 50px;
    white-space: nowrap;
    display: inline-flex;
    cursor: pointer;
    .option {
        display: flex;
        opacity: 0.5;
        .count {
            opacity: 0.5;
        }
        &:not(:first-child) {
            margin-left: 4px;
        }
        &:hover,
        &.active {
            opacity: 1;
            .count {
                opacity: 1;
            }
        }
        &.active {
            box-shadow: 0 3px 6px rgba($dark, 0.2);
        }
    }
}
</style>
