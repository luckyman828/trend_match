<template>
    <div
        class="button-wrapper"
        :class="[{ 'has-hover': hasHover }]"
        @mouseover="hover = true"
        @mouseleave="hover = false"
    >
        <button
            v-bind="$attrs"
            :class="[
                hover && !!hoverClass ? hoverClass : buttonClass,
                { disabled: disabled },
                { 'has-target-area': !!targetAreaPadding },
            ]"
            v-tooltip="disabled && disabledTooltip"
            @click="!disabled && $emit('click', $event)"
        >
            <div class="default">
                <slot />
            </div>

            <div class="hover-only">
                <slot name="hover" />
            </div>

            <!-- Target Area -->
            <div class="target-area" v-if="targetAreaPadding" :style="'padding: ' + targetAreaPadding"></div>
        </button>

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
    props: [
        'buttonClass',
        'hotkey',
        'disabled',
        'tooltip',
        'targetAreaPadding',
        'disabledTooltip',
        'hasHover',
        'hoverClass',
    ],
    data: function() {
        return {
            hover: false,
        }
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
    .hover-only {
        display: none;
    }
    &.full-width {
        width: 100%;
    }
    &.has-hover:hover {
        .default {
            display: none;
        }
        .hover-only {
            line-height: 1;
            text-align: center;
            display: inline-flex;
            justify-content: center;
            align-items: center;
        }
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
}
</style>
