<template>
    <div
        class="toggle-wrapper"
        :class="[{ active: isActive }, { disabled: disabled }]"
        @click="!disabled && toggle()"
        v-tooltip="disabled ? disabledTooltip : ''"
    >
        <span class="label" v-if="label">{{ label }}</span>
        <div class="toggle">
            <div class="pill w-xs" :class="sizeClass">
                <div class="circle" :class="sizeClass"></div>
            </div>
            <template v-if="showStateLabel">
                <span v-if="isActive">On</span>
                <span v-else>Off</span>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseToggle',
    props: ['isActive', 'label', 'sizeClass', 'disabled', 'disabledTooltip', 'showStateLabel'],
    methods: {
        toggle() {
            this.$emit('toggle', !this.isActive)
            this.$emit('input', !this.isActive)
        },
    },
}
</script>

<style scoped lang="scss">
.toggle-wrapper {
    display: inline-flex;
    flex-direction: column;
    cursor: pointer;
    &.disabled {
        cursor: default;
        opacity: 0.5;
    }
    &.active {
        .pill {
            background: $green400;
            .circle {
                transform: translateX(16px);
            }
            + span {
                color: $font;
            }
        }
    }
    &:hover {
        .circle {
            border-color: $borderColorElHover;
        }
        span {
            color: $font;
        }
    }
    span {
        font-weight: 700;
        font-size: 12px;
        color: $fontSoft;
        line-height: 1;
        &.label {
            color: $font;
            margin-bottom: 4px;
        }
    }
}
.toggle {
    display: flex;
    align-items: center;
}
.pill {
    background: $bgEl;
    border: $borderEl;
    position: relative;
    .circle {
        position: absolute;
        left: -1px;
        background: white;
        border: $borderElHard;
        transition: transform 0.2s;
        margin: 0;
    }
    + span {
        margin-left: 4px;
        width: 18px;
    }
}
</style>
