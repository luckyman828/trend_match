<template>
  <div class="header">
        <div>
            <div>
                <div><i class="far fa-pen"></i> Editing:</div>
                <h1><Editable :value="file.title" :type="'text'" v-model="file.title"></Editable></h1>
            </div>
        </div>
        <div>
            <div class="stat">
                <span class="title">Start date</span>
                <span class="square light">{{new Date(file.start_date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})}}</span>
            </div>
            <div class="stat">
                <span class="title">Deadline</span>
                <span class="square light">{{new Date(file.start_date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})}}</span>
            </div>

        </div>
    </div>
</template>

<script>
import Editable from './Editable'

export default {
    name: 'editFileHeader',
    components: {
        Editable,
    },
    props: [
        'file',
    ],
    computed: {
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
    }

</style>