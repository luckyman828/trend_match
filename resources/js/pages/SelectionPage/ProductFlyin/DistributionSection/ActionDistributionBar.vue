<template>
    <div class="action-distribution-bar">
        <svg>
            <rect class="bg" height="8px" width="100%" />
            <rect class="focus" height="8px" :style="focusStyle" />
            <rect class="in" height="8px" :style="inStyle" />
            <rect class="out" height="8px" :style="outStyle" />
        </svg>
    </div>
</template>

<script>
export default {
    name: 'actionDistributionBar',
    props: ['actions'],
    computed: {
        focusStyle() {
            const totalCount = this.actions.length
            const actionCount = this.actions.filter(action => action.action == 'Focus').length
            const width = actionCount / totalCount
            return {
                calcX: 0,
                calcWidth: width,
                x: 0,
                width: `${width * 100}%`,
            }
        },
        inStyle() {
            const totalCount = this.actions.length
            const actionCount = this.actions.filter(action => action.action == 'In').length
            const width = actionCount / totalCount
            const x = this.focusStyle.calcX + this.focusStyle.calcWidth
            return {
                calcX: x,
                calcWidth: width,
                x: `${x * 100}%`,
                width: `${width * 100}%`,
            }
        },
        outStyle() {
            const totalCount = this.actions.length
            const actionCount = this.actions.filter(action => action.action == 'Out').length
            const width = actionCount / totalCount
            const x = this.inStyle.calcX + this.inStyle.calcWidth
            return {
                calcX: x,
                calcWidth: width,
                x: `${x * 100}%`,
                width: `${width * 100}%`,
            }
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.distribution-bar {
    padding: 12px;
    display: flex;
    svg {
        height: 8px;
        border-radius: 4px;
        width: 100%;
        .bg {
            fill: $grey600;
        }
        .focus {
            fill: $primary;
        }
        .in {
            fill: $green;
        }
        .out {
            fill: $red;
        }
        .progress {
            fill: $bluegrey800;
        }
    }
}
</style>
