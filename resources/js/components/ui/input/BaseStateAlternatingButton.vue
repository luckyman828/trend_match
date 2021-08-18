<template>
    <BaseButtonV2
        :tooltip="state.tooltip"
        :buttonClass="[state.class, $attrs.class, buttonClass]"
        v-hover="{ over: () => (hasHover = true), leave: () => (hasHover = false) }"
        v-bind="$attrs"
        @click="$emit('click', $event)"
    >
        <i v-if="state.iconLeft" :class="state.iconLeft"
            ><i :class="state.nestedIconLeft" v-if="state.nestedIconLeft"></i
        ></i>
        <span v-if="state.text">{{ state.text }}</span>
        <i v-if="state.iconRight" :class="state.iconRight"
            ><i :class="state.nestedIconRight" v-if="state.nestedIconRight"></i
        ></i>
        <slot state:state />
    </BaseButtonV2>
</template>

<script>
export default {
    name: 'stateAlternatingButton',
    props: ['buttonClass', 'baseState', 'hoverState', 'activeState', 'activeHoverState', 'active'],
    data() {
        return {
            hasHover: false,
        }
    },
    computed: {
        stateName() {
            if (this.active && this.activeState) {
                if (this.hasHover && this.activeHoverState) {
                    return 'activeHoverState'
                } else {
                    return 'activeState'
                }
            }
            if (this.hasHover && this.hoverState) {
                return 'hoverState'
            }
            return 'baseState'
        },
        state() {
            return this[this.stateName] ? this[this.stateName] : {}
        },
    },
}
</script>

<style></style>
