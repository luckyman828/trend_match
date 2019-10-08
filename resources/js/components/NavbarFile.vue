<template>
    <div class="navbar-file flex-wrapper">

        <div class="items-left">

            <router-link :to="{name: 'collection'}" class="back-link"><span class="circle primary"><i class="far fa-arrow-left"></i></span><span>Back to Collections</span></router-link>
            <div class="breadcrumbs">
                <router-link class="text-link" :to="{name: 'collection'}">Collections</router-link>
                <span class="current"><strong>{{(currentFile != null) ? currentFile.title : 'Fetching..'}}</strong></span>
            </div>

        </div>

        <div class="items-right">

            <template v-if="userPermissionLevel >= 2 && currentTask">
                <template v-if="currentTask.isActive">
                    <span class="button wide light-2" v-if="submittingTaskComplete"><Loader/></span>
                    <span class="button wide primary" v-else-if="currentTask.completed.length <= 0" @click="onCompleteTask(currentFile.id, currentTask.id)">Complete task</span>
                    <span class="button wide red" v-else @click="onUndoCompleteTask(currentFile.id, currentTask.id)">Reopen task</span>
                </template>
            </template>

        </div>

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loader from './Loader'

export default {
    name: "navbarFile",
    components: {
        Loader
    },
    data: function () { return {
        submittingTaskComplete: false,
    }},
    computed: {
        ...mapGetters('persist', ['userPermissionLevel', 'currentFile', 'currentTask']),
    },
    methods: {
        ...mapActions('entities/tasks', ['completeTask', 'undoCompleteTask']),
        async onCompleteTask(file_id, task_id) {
            this.submittingTaskComplete = true
            await this.completeTask({file_id: file_id, task_id: task_id})
            // .then(reponse => succes = response)
            this.submittingTaskComplete = false
        },
        async onUndoCompleteTask(file_id, task_id) {
            this.submittingTaskComplete = true
            await this.undoCompleteTask({file_id: file_id, task_id: task_id})
            // .then(reponse => succes = response)
            this.submittingTaskComplete = false
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~@/_variables.scss';

    .flex-wrapper {
        width: 100%;
        padding: 8px 60px;
        padding-right: 77px;
        display: flex;
        justify-content: space-between;
    }
    .items-left, .items-right {
        display: flex;
        align-items: center;
    }
    .back-link {
        padding-right: 28px;
        border-right: solid 2px $light2;
        margin-right: 28px;
        .circle {
            margin-right: 8px;
        }
    }
    .breadcrumbs {
        display: flex;
        > * {
            display: inline-flex;
            align-items: center;
        }
        > *:not(:first-child)::before {
            content: '';
            pointer-events: none;
            color: $dark1;
            margin-left: 8px;
            margin-right: 10px;
            margin-bottom: 2px;
            font-size: 10px;
            font-family: "Font Awesome 5 Pro";
            font-weight: 900;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
        }
        > *:last-child::before {
            content: '';
        }
    }

</style>
