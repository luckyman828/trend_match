<template>
  <div class="header">
        <div>
            <h1>{{collection.title}}</h1>
            <span v-if="currentTask" class="square light">Stage {{currentTask.title}}</span>
            <!-- <Dropdown class="dark dropdown-parent">
                <template v-slot:button="slotProps">
                    <span class="square light" @click="slotProps.toggle">Stage {{currentTask.title}}</span>
                </template>
                <template v-slot:header="slotProps">
                    <span>Task overview</span>
                </template>
                <template v-slot:body>
                    <p v-for="task in userTasks" :key="task.id">
                        <strong v-if="currentTask.id == task.id">{{task.title}} <span v-if="task.completed.length > 0">(Done)</span></strong>
                        <template v-else>{{task.title}} <span v-if="task.completed.length > 0">(Done)</span></template>
                    </p>
                </template>
            </Dropdown> -->
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

            <template v-if="currentTask">
                <TooltipAlt2 v-if="currentTask.type == 'feedback' && userPermissionLevel > 1" :header="'Progress'" :array="currentTask.input" :arrayLabelKey="'name'" :arrayValueKey="'progress'" :arrayValueUnit="'%'">
                    <div class="stat progress">
                        <span class="title">Progress</span>
                        <svg height="4">
                            <rect class="background" v-if="currentTaskProgress > 0" width="100%" height="4"/>
                            <rect class="value" v-if="currentTaskProgress > 0" :width="currentTaskProgress + '%'" height="4"/>
                        </svg>
                        <span class="value">{{currentTaskProgress}}%</span>
                    </div>
                </TooltipAlt2>
                <div class="stat progress" v-else>
                    <span class="title">Progress</span>
                    <svg height="4">
                        <rect class="background" v-if="currentTaskProgress > 0" width="100%" height="4"/>
                        <rect class="value" v-if="currentTaskProgress > 0" :width="currentTaskProgress + '%'" height="4"/>
                    </svg>
                    <span class="value">{{currentTaskProgress}}%</span>
                </div>
            </template>


        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Dropdown from './Dropdown'

export default {
    name: 'catalogueHeader',
    components: {
        Dropdown,
    },
    props: [
        'collection',
    ],
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'userPermissionLevel', 'currentTask', 'currentTaskProgress']),
        ...mapGetters('entities/tasks', ['userTasks', 'tasks']),
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