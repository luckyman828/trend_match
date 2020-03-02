<template>
    <div class="button-wrapper">
        <button v-bind="$attrs" :class="buttonClass">
            <slot/>
        </button>
        <div class="hotkey" v-if="hotkey">
            <span class="key">{{hotkey.key}}</span>
            <span class="label">{{hotkey.label}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseButton',
    props: [,
        'buttonClass',
        'hotkey'
    ],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.button-wrapper {
    position: relative;
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
}

</style>