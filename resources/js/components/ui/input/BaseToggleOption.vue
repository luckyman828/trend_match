<template>
    <div class="toggle" @click="toggle" :class="{ active: value == modelValue }">
        <span class="option"> <span v-if="count" class="count"></span><slot /> </span>
    </div>
</template>

<script>
export default {
    name: 'toggle',
    props: ['value', 'modelValue'],
    data: function() {
        return {
            activeOption: 0,
        }
    },
    methods: {
        toggle() {
            this.$emit('input', this.value)
        },
    },
}
</script>

<style scoped lang="scss">
.option {
    font-size: 12px;
    padding: 6px 14px;
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
        padding: 4px 8px;
        background: white;
        border-radius: 40px;
        margin-right: 8px;
    }
}
</style>
