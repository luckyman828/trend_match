<template>
  <div class="header">
        <div>
            <h1>{{collection.title}}</h1>
            <span class="square light">Stage {{collection.phase}}</span>
        </div>
        <div>
            <div class="stat">
                <span class="title">Teams</span>
                <span class="square light">x Teams</span>
            </div>
            <div class="stat">
                <span class="title">Start date</span>
                <span class="square light">{{startDate}}</span>
            </div>
            <div class="stat">
                <span class="title">Deadline</span>
                <span class="square light">{{endDate}}</span>
            </div>
            <template v-if="userPermissionLevel >= 2">
                <template v-if="currentTeamId == 0">
                    <!-- Teams progress -->
                    <TooltipAlt2 :header="'Progress'" :array="collection.teams" :arrayLabelKey="'title'" :arrayValueKey="'progress'">
                        <div class="stat progress">
                            <span class="title">Progress</span>
                            <svg height="4">
                                <rect class="background" v-if="productTotals.progress > 0" width="100%" height="4"/>
                                <rect class="value" v-if="productTotals.progress > 0" :width="productTotals.progress + '%'" height="4"/>
                            </svg>
                            <span class="value">{{productTotals.progress}}%</span>
                        </div>
                    </TooltipAlt2>
                </template>
                <template v-else>
                    <!-- User progress -->
                    <TooltipAlt2 :header="'Team progress'" :array="teamUsers" :arrayLabelKey="'email'" :arrayValueKey="'progress'">
                        <div class="stat progress">
                            <span class="title">Progress</span>
                            <svg height="4">
                                <rect class="background" v-if="productTotals.progress > 0" width="100%" height="4"/>
                                <rect class="value" v-if="productTotals.progress > 0" :width="productTotals.progress + '%'" height="4"/>
                            </svg>
                            <span class="value">{{productTotals.progress}}%</span>
                        </div>
                    </TooltipAlt2>
                </template>
                
            </template>
            <template v-else>
                <!-- User progress -->
                <div class="stat progress">
                    <span class="title">Progress</span>
                    <svg height="4">
                        <rect class="background" v-if="productTotals.progress > 0" width="100%" height="4"/>
                        <rect class="value" v-if="productTotals.progress > 0" :width="productTotals.progress + '%'" height="4"/>
                    </svg>
                    <span class="value">{{productTotals.progress}}%</span>
                </div>

                <!-- Teams progress -->
                <!-- <div class="stat progress">
                    <span class="title">Progress</span>
                    <svg height="4">
                        <rect class="background" v-if="productTotals.progress > 0" width="100%" height="4"/>
                        <rect class="value" v-if="productTotals.progress > 0" :width="productTotals.progress + '%'" height="4"/>
                    </svg>
                    <span class="value">{{productTotals.progress}}%</span>
                </div> -->
            </template>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'catalogueHeader',
    props: [
        'collection',
        'productTotals',
        'startDate',
        'endDate',
        'teamUsers',
    ],
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'userPermissionLevel']),
    }
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
            height: 24px;
            line-height: 20px;
            font-size: 12px;
            font-weight: 700;
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