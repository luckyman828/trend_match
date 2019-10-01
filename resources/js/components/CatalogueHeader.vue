<template>
  <div class="header">
        <div>
            <h1>{{collection.title}}</h1>
            <span class="square light">Stage {{collection.phase}}</span>
        </div>
        <div>
            <!-- <div class="stat">
                <span class="title">Teams</span>
                <span class="square light">{{collection.teams.length}} Teams</span>
            </div> -->
            <div class="stat">
                <span class="title">Start date</span>
                <span class="square light">{{new Date(collection.start_date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})}}</span>
            </div>
            <div class="stat">
                <span class="title">Deadline</span>
                <span class="square light">{{new Date(collection.start_date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})}}</span>
            </div>

            <TooltipAlt2 v-if="currentTask.type == 'feedback'" :header="'Progress'" :array="currentTask.input" :arrayLabelKey="'name'" :arrayValueKey="'progress'" :arrayValueUnit="'%'">
                <div class="stat progress">
                    <span class="title">Progress</span>
                    <svg height="4">
                        <rect class="background" v-if="currentTask.progress > 0" width="100%" height="4"/>
                        <rect class="value" v-if="currentTask.progress > 0" :width="currentTask.progress + '%'" height="4"/>
                    </svg>
                    <span class="value">{{currentTask.progress}}%</span>
                </div>
            </TooltipAlt2>
            <TooltipAlt2 v-else :header="'Progress'" :array="[currentTask]" :arrayLabelKey="'title'" :arrayValueKey="'progress'" :arrayValueUnit="'%'">
                <div class="stat progress">
                    <span class="title">Progress</span>
                    <svg height="4">
                        <rect class="background" v-if="currentTask.progress > 0" width="100%" height="4"/>
                        <rect class="value" v-if="currentTask.progress > 0" :width="currentTask.progress + '%'" height="4"/>
                    </svg>
                    <span class="value">{{currentTask.progress}}%</span>
                </div>
            </TooltipAlt2>
            <!-- <div v-else class="stat progress">
                <span class="title">Progress</span>
                <svg height="4">
                    <rect class="background" v-if="currentTask.progress > 0" width="100%" height="4"/>
                    <rect class="value" v-if="currentTask.progress > 0" :width="currentTask.progress + '%'" height="4"/>
                </svg>
                <span class="value">{{currentTask.progress}}%</span>
            </div> -->

        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'catalogueHeader',
    props: [
        'collection',
    ],
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'userPermissionLevel', 'currentTask']),
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