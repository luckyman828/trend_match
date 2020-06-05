<template>
    <div class="toggle-wrapper" :class="[{active: isActive}, {disabled: disabled}]"
    @click="!disabled && toggle()" v-tooltip="disabled ? disabledTooltip : ''">
        <span class="label" v-if="label">{{label}}</span>
        <div class="toggle">
            <div class="pill fixed-width" :class="sizeClass">
                <div class="circle" :class="sizeClass"></div>
            </div>
            <span v-if="isActive">On</span>
            <span v-else>Off</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseToggle',
    props: [
        'isActive',
        'label',
        'sizeClass',
        'disabled',
        'disabledTooltip',
    ],
    methods: {
        toggle () {
            this.$emit('toggle', !this.isActive)
            this.$emit('input', !this.isActive)
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.toggle-wrapper {
    display: inline-flex;
    flex-direction: column;
    cursor: pointer;
    &.disabled {
        cursor: default;
        opacity: .5;
    }
    &.active {
        .pill {
            background: $green;
            .circle {
                transform: translateX(calc(100% - 2px));
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
        left: 0;
        background: white;
        border: $borderElHard;
        transition: transform .2s;
    }
    + span {
        margin-left: 4px;
        width: 18px;
    }
}
</style>