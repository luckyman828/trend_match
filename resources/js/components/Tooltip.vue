<template>
    <div v-if="tooltip.active == true" :class="tooltip.type" class="vue-component-tooltip" :style="{top: tooltip.position.top + 'px', left: tooltip.position.center - 70 + 'px'}">
        <div class="header" v-if="tooltip.header != null">
            <span>{{tooltip.data.length}} {{tooltip.header}}</span>
        </div>
        <div class="body">
            <template v-if="tooltip.type == 'users'">
            <div class="tooltip-row" v-for="(user, index) in tooltip.data" :key="index">
                <span class="user"><span class="email">{{user.email}}</span></span>
            </div>
            </template>

            <template v-if="tooltip.type == 'teams'">
            <div class="tooltip-row" v-for="(team, index) in teams" :key="index">
                <span class="team">{{team.title}} <span class="count">{{team.users.length}}</span></span>
            </div>
            </template>

            <template v-if="tooltip.type == 'text'">
                <span>{{tooltip.data}}</span>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tooltip',
    props: [
        'tooltip',
    ],
    computed: {
        teams () {
            const tooltip = this.tooltip
            const data = []
            if (tooltip.type == 'teams') {

                    // const uniqueTeams = [...new Set(tooltip.data.map(x => x.team.title))]
                    // Create an array of unique teams from the users in data
                    let uniqueTeams = []
                    let noTeam = {
                        title: 'No team',
                        users: []
                    }
                    // if (tooltip.data.length > 0) {
                    //     uniqueTeams.push({
                    //         title: 'NO TEAM',
                    //         users: [],
                    //     })
                    // }

                    const users = tooltip.data
                    users.forEach(user => {
                        // Check if the user has any teams
                        if (user.teams[0] != null) {
                            if ('id' in user.teams[0]) {
                                // Loop through the users teams to find the unique teams
                                user.teams.forEach(team => {
                                    // If the uniqueTeams array does not include the current team -> add it
                                    const foundTeam = uniqueTeams.find(x => x.title == team.title)
                                    if (foundTeam == null) {
                                        // If there the team doesnt exist in the array, add the team to the table
                                        // Construct a new teeam
                                        const newTeam = {
                                            title: team.title,
                                            users: []
                                        }
                                        newTeam.users.push(user)
                                        uniqueTeams.push(newTeam)
                                        // Also add the user to the new team
                                    } else {
                                        // If the team already exists, add the user to the team
                                        foundTeam.users.push(user)
                                    }
                                })
                            }
                        }
                        // If the user does not have a team, add them to a "No team" group
                        else {
                            noTeam.users.push(user)
                        }
                    })
                // Add a "No team" option to the tooltip if it exists
                if (noTeam.users.length > 0)
                    uniqueTeams.unshift(noTeam)
                return uniqueTeams
            }
        },
        users() {
            const tooltip = this.tooltip
            if (tooltip.type == 'users') {
                return tooltip.users
            }
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
        position: fixed;
        z-index: 9;
        color: white;
        border-radius: 4px;
        &.teams {
            width: 140px;
        }
        &.users {
            width: 200px;
        }
        &.text {
            padding: 8px;
            position: fixed;
        }
    }
    .header {
        text-align: center;
        padding: 10px 0;
        color: $dark2;
        font-size: 14px;
        font-weight: 400;
    }
    .tooltip-row {
        font-size: 12px;
        padding: 8px;
        background: rgba(white, .1);
        &:nth-child(even) {
            background: rgba(white, .2)
        }
        .team {
            display: flex;
            justify-content: space-between;
        }
        .count {
            font-weight: 700;
        }
    }
</style>
