<template>
    <div class="select-button">
        <span class="header" v-html="header"></span>
        <label class="select-button" :class="{'has-description': $slots.default}">
            <Radiobox v-if="type == 'radio'" :value="value"/>
            <Checkbox v-else :value="value" @change="$emit('input', $event.target.value)"/>

            <div class="label">
                {{label}}
                <p class="description">
                    <slot/>
                </p>
            </div>
        </label>
    </div>
</template>

<script>
export default {
    name: 'selectButton',
    props: [
        'type',
        'value',
        'label',
        'header'
    ],
    data: function () { return {
    }},
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .select-button {
        .header {
            font-size: 12px;
            font-weight: 500;
            padding: 0 16px;
            color: $primary;
            margin-bottom: 12px;
            display: inline-block;
        }
        label {
            font-weight: 400;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            .label {
                width: 100%
            }
            .description {
                font-size: 12px;
                font-weight: 400;
                width: calc(100% - 16px);
                overflow: hidden;
            }
            &:hover, &.active {
                background: $bgContentActive;
            }
            &.has-description {
                align-items: flex-start;
                .radiomark, .checkbox {
                    margin-top: 4px;
                }
            }
        }
        .checkbox {
            margin-right: 10px;
        }
    }

</style>