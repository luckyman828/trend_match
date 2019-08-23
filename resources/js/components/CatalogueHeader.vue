<template>
  <div class="header">
        <div>
            <h1>{{collection.title}}</h1>
            <span class="square">Stage {{collection.phase}}</span>
        </div>
        <div>
            <div class="stat">
                <span class="title">Teams</span>
                <span class="square">x Teams</span>
            </div>
            <div class="stat">
                <span class="title">Start date</span>
                <span class="square">{{startDate}}</span>
            </div>
            <div class="stat">
                <span class="title">Deadline</span>
                <span class="square">{{endDate}}</span>
            </div>
            <div class="stat progress">
                <span class="title">Progress</span>
                <svg height="4">
                    <rect class="background" v-if="productTotals.progress > 0" width="100%" height="4"/>
                    <rect class="value" v-if="productTotals.progress > 0" :width="productTotals.progress + '%'" height="4"/>
                </svg>
                <span class="value">{{productTotals.progress}}%</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'catalogueHeader',
    props: [
        'collection',
        'productTotals',
        'startDate',
        'endDate'
    ]
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
        margin-bottom: 16px;
        border-bottom: solid 2px $light2;
        > div {
            display: flex;
            align-items: center;
        }
        h1 {
            display: inline-block;
            margin: 0;
            margin-right: 12px;
        }
        .square {
            background: $light1;
            color: $dark05;
            font-weight: 700;
            padding: 4px 16px;
            border-radius: 4px;
            font-size: 12px;
            display: inline-block;
            white-space: nowrap;
        }
        .stat {
            margin-left: 24px;
        }
        .title {
            display: block;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: $dark2;
        }
        .progress {
            width: 400px;
            position: relative;
            padding-right: 36px;
            .value {
                position: absolute;
                left: calc(100% - 32px);
                top: 50%;
                font-size: 14px;
                font-weight: 700;
            }
        }
        svg {
            width: 100%;
            rect {
                &.value {
                    transition: .3s;
                    fill: $yellowGreen;
                }
                &.background {
                    fill: $light2;
                }
            }
        }
    }

</style>