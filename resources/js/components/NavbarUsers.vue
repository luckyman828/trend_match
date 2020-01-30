<template>
    <div class="navbar-team">

        <div class="flex-wrapper">
            <div class="items-left">



            </div>
            <div class="items-right">

                <button class="primary" @click="setAddNewUserModalVisible(true)"><span>Add new: User</span></button>

            </div>
        </div>

    </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
    name: "navbarUsers",
    data: function () { return {
    }},
    components: {
    },
    computed: {
        ...mapGetters('persist', ['userPermissionLevel']),
    },
    methods: {
        ...mapMutations('entities/users', ['setAddNewUserModalVisible']),
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
