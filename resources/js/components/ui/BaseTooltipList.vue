<template>
    <div class="tooltip-list" ref="wrapper">

        <div class="header" v-if="header != null" v-html="header"></div>

        <div class="body" ref="body">

            <span class="body-wrapper" v-if="body != null" v-html="body"></span>

            <template v-if="array != null">
                <p class="row" v-for="(row, index) in array" :key="index">
                    <template v-if="arrayLabelKey != null">
                        <span class="label">{{(row[arrayLabelKey]) ? row[arrayLabelKey] : 'No label'}}: </span>
                        <strong class="value" v-if="arrayValueKey != null">{{row[arrayValueKey]}}<template v-if="arrayValueUnit">{{arrayValueUnit}}</template></strong>
                        <strong class="value" v-else>{{row}}</strong>
                    </template>
                    <template v-else>
                        <span class="value" v-if="arrayValueKey != null">{{row[arrayValueKey]}}<template v-if="arrayValueUnit">{{arrayValueUnit}}</template></span>
                        <span class="value" v-else>{{row}}</span>
                    </template>
                </p>
            </template>

        </div>

    </div>
</template>

<script>
export default {
    name: 'tooltipAlt',
    data: function () { return {
        showDelay: 300,
    }},
    props: [
        'header',
        'body',
        'array',
        'arrayLabelKey',
        'arrayValueKey',
        'arrayValueUnit',
    ],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    // .body-wrapper {
    //     padding: 8px 16px;
    //     display: block;
    //     font-size: 13px;
    // }
    // .body {
    //     max-height: 200px;
    //     overflow-x: hidden;
    //     overflow-y: auto;
    // }
    // .flex-wrapper {
    //     display: flex;
    //     justify-content: space-between;
    // }
    .tooltip-list {
        background: $darkAlt;
        border-color: $darkAlt;
    }
    .header {
        padding: 12px 8px 8px;
        color: $dark2;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        .close {
            position: absolute;
            right: 8px;
            top: 12px;
            height: 24px;
            width: 24px;
            text-align: center;
            z-index: 1;
            cursor: pointer;
            i {
                line-height: 24px;
                font-size: 12px;
            }
        }
    }
    .body {
        max-height: 186px;
        overflow-x: hidden;
        overflow-y: auto;
        background: $darkAlt;
        &:not(:first-child) {
            background: $darkAlt2;
        }
    }
    .row {
        font-size: 12px;
        padding: 0 12px;
        margin: 0;
        border: solid 1px $darkAlt;
        height: 32px;
        line-height: 32px;
        display: flex;
        justify-content: space-between;
        min-width: 152px;
        .label {
            margin-right: 16px;
            + .value {
                text-align: right;
            }
        }
        .value {
            min-width: 44px;
        }
    }
    .footer {
        padding: 4px 8px 6px;
    }

</style>