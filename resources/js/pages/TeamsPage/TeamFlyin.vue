<template>
    <BaseFlyin :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader @close="$emit('close')"
            :next="nextTeam" :prev="prevTeam"
            @next="showNext" @prev="showPrev">
                <template v-slot:left>
                    <h3>{{team.title}}</h3>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-slot>
            <TeamUsersTable/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import TeamUsersTable from './TeamUsersTable'

export default {
    name: 'teamSingleFlyin',
    components: {
        TeamUsersTable,
    },
    props: [
        'show',
    ],
    computed: {
        ...mapGetters('teams', ['getCurrentTeam', 'nextTeam', 'prevTeam']),
        team() {
            return this.getCurrentTeam
        },
    },
    methods: {
        ...mapMutations('teams', ['SET_CURRENT_TEAM']),
        showNext() {
            if (this.nextTeam)
                this.SET_CURRENT_TEAM(this.nextTeam)
        },
        showPrev() {
            if (this.prevTeam)
                this.SET_CURRENT_TEAM(this.prevTeam)
        },
    },
}
</script>

<style scoped lang="scss">

    .body {
        padding: 16px;
    }
    .error-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        > span {
            margin: 12px 0;
        }
    }

</style>