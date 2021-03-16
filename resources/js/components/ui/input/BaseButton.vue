<template>
    <div class="button-wrapper" :class="{ disabled: disabled }">
        <button
            v-bind="$attrs"
            :class="[buttonClass, { disabled: disabled }, { 'has-target-area': !!targetAreaPadding }]"
            v-tooltip="disabled ? disabledTooltip : tooltip"
            @click="!disabled && $emit('click', $event)"
        >
            <slot />

            <!-- Target Area -->
            <div class="target-area" v-if="targetAreaPadding" :style="'padding: ' + targetAreaPadding"></div>
        </button>

        <div class="icon-left">
            <slot name="iconLeft" />
        </div>
        <div class="icon-right">
            <slot name="iconRight" />
        </div>

        <div class="count" v-if="$slots.count || $scopedSlots.count">
            <slot name="count" />
        </div>

        <!-- Hotkey -->
        <div class="hotkey" v-if="hotkey" :style="hotkeyStyle">
            <span class="key">{{ hotkey.key }}</span>
            <span class="label">{{ hotkey.label }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseButton',
    props: ['buttonClass', 'hotkey', 'disabled', 'tooltip', 'targetAreaPadding', 'disabledTooltip'],
    data: function() {
        return {}
    },
    computed: {
        hotkeyStyle() {
            return this.hotkey && this.hotkey.align == 'right' ? { right: 0 } : { left: 0 }
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.button-wrapper {
    position: relative;
    display: inline-flex;
    .count {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(35%, -35%);
    }
    .hover-only {
        display: none;
    }
    &.full-width {
        width: 100%;
    }
    .hotkey {
        position: absolute;
        bottom: -6px;
        transform: translate(0, 100%);
        display: flex;
        align-items: center;
        white-space: nowrap;
        .key {
            font-size: 10px;
            text-transform: uppercase;
            padding: 0 4px;
            margin-right: 4px;
            border: solid 1px $dark2;
            border-radius: 2px;
        }
        .label {
            font-size: 11px;
        }
    }
    // Target Area
    .target-area {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        height: 100%;
        width: 100%;
        box-sizing: content-box;
    }
    .icon-left,
    .icon-right {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .icon-left {
        left: 20px;
    }
    .icon-right {
        right: 20px;
    }
}
</style>
