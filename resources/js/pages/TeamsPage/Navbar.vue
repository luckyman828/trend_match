<template>
    <div class="navbar-team">
        <CreateTeamModal ref="createTeamModal"/>

        <div class="flex-wrapper">
            <div class="items-left">



            </div>
            <div class="items-right">

                <button v-if="userPermissionLevel >= 4" class="primary" @click="$refs.createTeamModal.show()"><span>Add new: Team</span></button>

            </div>
        </div>

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateTeamModal from '../../components/CreateTeamModal'
import Team from '../../store/models/Team'

export default {
    name: "teamsPageNavbar",
    data: function () { return {
        addTeamName: '',
    }},
    components: {
        CreateTeamModal,
    },
    computed: {
        ...mapGetters('persist', ['userPermissionLevel']),
        addTeamValid () {
            if (this.teams.length <= 0)
                return false
                else
                    if (this.teams.find(x => x.title.toLowerCase() == this.addTeamName.toLowerCase()))
                        return false
            return true
        },
        teams () {
            return Team.all()
        }
    },
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
