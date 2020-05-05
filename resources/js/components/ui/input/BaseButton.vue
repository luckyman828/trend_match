<template>
    <div class="button-wrapper">

        <!-- Button -->
        <button v-bind="$attrs" :class="[buttonClass, {disabled: disabled}]"
        @click="!disabled && $emit('click', $event)">
            <slot/>

            <!-- Target Area -->
            <div class="target-area" v-if="targetArea" 
            :style="targetAreaSize">

            </div>
        </button>


        <!-- Hotkey -->
        <div class="hotkey" v-if="hotkey">
            <span class="key">{{hotkey.key}}</span>
            <span class="label">{{hotkey.label}}</span>
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
        'targetArea',
    ],
    computed: {
        targetAreaSize() {
            if (this.targetArea) {
                const strArr = this.targetArea.split(' ')
                if (strArr.length > 1) {
                    return `height: ${strArr[0]}; width: ${strArr[1]};`
                } else {
                    return `height: ${strArr[0]}; width: ${strArr[0]};`
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.button-wrapper {
    position: relative;
    display: inline-flex;
    .hotkey {
        position: absolute;
        bottom: -6px;
        transform: translate(0, 100%);
        left: 0;
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
    }
}

</style>