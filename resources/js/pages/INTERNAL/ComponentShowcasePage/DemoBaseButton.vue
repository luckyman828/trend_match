<template>
    <ComponentDemo
        name="BaseButton"
        :demoProps="demoProps"
        :buttonClass.sync="buttonClass"
        :disabled.sync="disabled"
        :tooltip.sync="tooltip"
        :disabledTooltip.sync="disabledTooltip"
        :targetAreaPadding.sync="targetAreaPadding"
    >
        <template v-slot:examples>
            <BaseButton
                :buttonClass="buttonClass"
                :disabled="disabled"
                :tooltip="tooltip"
                :disabledTooltip="disabledTooltip"
                :targetAreaPadding="targetAreaPadding"
            >
                <i class="far fa-smile"></i>
                <span>Hello</span>
                <i class="fas fa-arrow-left"></i>
            </BaseButton>
            <BaseButton
                :buttonClass="buttonClass"
                :disabled="disabled"
                :tooltip="tooltip"
                :disabledTooltip="disabledTooltip"
                :targetAreaPadding="targetAreaPadding"
            >
                <span>I am a button</span>
            </BaseButton>
            <BaseButton
                :buttonClass="buttonClass"
                :disabled="disabled"
                :tooltip="tooltip"
                :disabledTooltip="disabledTooltip"
                :targetAreaPadding="targetAreaPadding"
            >
                <i class="fas fa-check"></i>
            </BaseButton>
        </template>
    </ComponentDemo>
</template>

<script>
import ComponentDemo from './ComponentDemo.vue'

export default {
    name: 'demoBaseButton',
    components: { ComponentDemo },
    data() {
        return {
            buttonClass: '',
            hotkey: '',
            disabled: false,
            tooltip: '',
            targetAreaPadding: '',
            disabledTooltip: '',
            demoProps: [
                {
                    name: 'buttonClass',
                    inputType: 'text',
                    availableValues: [
                        {
                            name: 'Color',
                            values: [
                                'primary',
                                'secondary',
                                'dark',
                                'white',
                                'light',
                                'grey',
                                'green',
                                'red',
                                'yellow',
                                'orange',
                            ],
                        },
                        {
                            name: 'Sizes',
                            values: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
                        },
                        {
                            name: 'Shapes',
                            values: ['square', 'true-square', 'pill', 'circle'],
                        },
                        {
                            name: 'Types',
                            values: ['ghost', 'no-bg'],
                        },
                        {
                            name: 'Pill fixed width',
                            values: ['w-xxs', 'w-xs', 'w-sm', 'w-md', 'w-lg', 'w-xl'],
                        },
                        {
                            name: 'Pill padding',
                            values: ['p-none', 'p-xxs', 'p-xs', 'p-sm', 'p-md', 'p-lg', 'p-xl'],
                        },
                    ],
                },
                {
                    name: 'disabled',
                    inputType: 'boolean',
                },
            ],
        }
    },
}
</script>

<style scoped lang="scss">
.input-field {
    max-width: 200px;
}
.section {
    margin-bottom: 20px;
}
</style>
