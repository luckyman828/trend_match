<template>
    <div v-if="tooltip.active == true" class="vue-component-tooltip" :style="{top: tooltip.position.top + 'px', left: tooltip.position.center - 70 + 'px'}">
        <div class="header">
            <span>{{tooltip.data.length}} {{tooltip.header}}</span>
        </div>
        <div class="body">
            <div class="tooltip-row" v-for="(item, index) in tooltip.data" :key="index">
                <template v-if="tooltip.type == 'actions'">
                    <span class="team">{{item.user.team.title}} <span class="count"></span></span>
                </template>
                <template v-if="tooltip.type == 'users'">
                    <span class="team">{{item.team.title}}</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tooltip',
    props: [
        'tooltip'
    ],
    computed: {
        // teams () {
        //     const tooltip = this.tooltip
        //     const data = {}
        //     if (tooltip.type == 'users' || tooltip.type == 'actions') {
        //         data.teams = []
        //         if (tooltip.type == 'users') {
        //             data.teams.push(...new Set(tooltip.data.map(x => x.team.title)))

        //             data.newTeams = []
        //             data.teams.forEach(team => {
        //                 const thisTeam = {
        //                     name: team,
        //                     users: []
        //                 }
        //                 tooltip.data.forEach(user => {
        //                     if (user.team.title == team) {
        //                         thisTeam.users.push(user)
        //                     }
        //                 })
        //                 data.newTeams.push(thisTeam)
        //             })
        //             // tooltip.data.foreach(user => {

        //             // })
        //         }
        //     }
        //     return data
        // }
        teams () {
            const tooltip = this.tooltip
            const data = {}
            if (tooltip.type == 'users' || tooltip.type == 'actions') {
                data.teams = []
                if (tooltip.type == 'users') {
                    // const uniqueTeams = [...new Set(tooltip.data.map(x => x.team.title))]
                    data.teams.push([...new Set(tooltip.data.map(x => x.team.title))])

                    // data.newTeams = []
                    // data.teams.forEach(team => {
                    //     const thisTeam = {
                    //         name: team,
                    //         users: []
                    //     }
                    //     tooltip.data.forEach(user => {
                    //         if (user.team.title == team) {
                    //             thisTeam.users.push(user)
                    //         }
                    //     })
                    //     data.newTeams.push(thisTeam)
                    // })
                    // tooltip.data.foreach(user => {

                    // })
                }
            }
            return data
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .vue-component-tooltip {
        background: $darkAlt;
        border: solid 1px $darkAlt;
        box-shadow: 0 3px 6px rgba(0,0,0,.1);
        position: absolute;
        z-index: 9;
        color: white;
        width: 140px;
        border-radius: 4px;
    }
    .header {
        text-align: center;
        padding: 10px 0;
        color: $dark2;
        font-size: 14px;
        font-weight: 400;
    }
</style>
