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
                <span class="team">{{team.name}} <span class="count">{{team.users.length}}</span></span>
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

                    const uniqueTeams = [...new Set(tooltip.data.map(x => x.team.title))]
                    uniqueTeams.forEach(team => {
                        const thisTeam = {
                            name: team,
                            users: [],
                            teamUsers: tooltip.teams.find(obj => {
                                return obj.title == team.toUpperCase()
                            })
                        }
                        tooltip.data.forEach(user => {
                            if (user.team.title == team) {
                                thisTeam.users.push(user)
                            }
                        })
                        data.push(thisTeam)
                    })
            }
            return data
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
