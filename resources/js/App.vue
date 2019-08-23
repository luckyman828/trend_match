<template>
    <div class="app" id="app-component">
        <Navbar/>
        <Sidebar :authUser="authUser"/>
        <div class="main" id="main">
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import store from './store'
import { mapActions, mapGetters } from 'vuex'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

export default{
    name: 'app',
    store,
    components: {
        Sidebar,
        Navbar,
    },
    data: function () { return {
    }},
    computed: {
        authUser() {
            return this.$store.getters.authUser;
        },
    },
    methods: {
        ...mapActions('entities/authUser', ['getAuthUser']),
    },
    created() {
        this.getAuthUser();
    }
}
</script>

<style lang="scss">
    @import '~@/_variables.scss';
    html, body, #app {
        color: $dark;
        // font-family: 'Source Sans Pro', sans-serif;
        background: $light;
    }
    .app {
        box-shadow: 0 3px 6px rgba(0,0,0,.05) inset, 5px 0 6px rgba(0,0,0,.02) inset;
        max-height: calc(100vh - 70px);
        overflow: scroll;
        scroll-behavior: smooth;
    }
    .main-wrapper {
        padding-left: $sidebarWidth;
        padding-top: $navbarHeight;
    }
    .main {
        min-height: 105vh;
        padding: 20px 60px;
    }
    .container {
        max-width: 1170px;
    }
    h1 {
        margin-bottom: 30px;
    }
    .grid-2, .grid-3 {
        display: grid;
        grid-gap: 17px;
        &.small-gap {
            grid-gap: 12px;
        }
    }
    .grid-3 {
        grid-template-columns: repeat(3, 1fr);
    }
    .grid-2 {
        grid-template-columns: repeat(2, 1fr);
    }
    .card {
        padding: 1em;
        border-radius: 6px;
        margin: 30px 0;
        border: none;
        box-shadow: 0 2px 6px rgba(0,0,0,.1);
        background: white;
    }
    .pill {
        background: $light1;
        height: 20px;
        font-size: 13px;
        border-radius: 20px;
        width: 85px;
        height: 25px;
        display: inline-block;
        line-height: 25px;
        text-align: center;
        &.positive {
            background: $secondaryLight;
        }
    }
    .tabs {
        margin-left: -16px;
        margin-right: -16px;
        width: calc(100% + 32px);
        .tab {
            display: inline-block;
            font-size: 18px;
            opacity: .5;
            padding: 10px 25px;
            border-bottom: solid 3px transparent;
            margin-bottom: 8px;
            &.active {
                opacity: 1;
                border-color: $primary;
            }
            &:not(.active):hover {
                border-color: rgba($primary, .5);
                cursor: pointer;
            }
        }
    }
    .vdp-datepicker {
        display: grid;
        justify-items: end;
        &.disabled {
            pointer-events: none;
            opacity: .5;
        }
        > div::after {
            content: "";
            font-size: 11px;
            color: $dark2;
            display: block;
            position: absolute;
            z-index: 1;
            right: 12px;
            height: 32px;
            top: 0;
            line-height: 32px;
            font-weight: 900;
            font-family: "Font Awesome 5 Pro"
        }
        input {
            border: solid 1px $light2;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,.1);
            padding-left: 12px;
            height: 32px;
            width: 150px;
            font-size: 14px;
            cursor: pointer;
        }
    }
    .loading {
        animation: loading 2s;
        animation-iteration-count: infinite;
    }
    @keyframes loading {
        0% {opacity: 0;}
        50% {opacity: 1;}
        100% {opacity: 0;}
    }

    // Tables
    .flex-table {
        margin-left: -16px;
        margin-right: -16px;
        width: calc(100% + 32px);
        &.disabled {
            opacity: .5;
        }
        .flex-table-row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            min-height: 45px;
            > * {
                &.select {
                    padding-left: 16px;
                    min-width: 80px;
                }
            }
        }
        .header-row {
            font-weight: 700;
            font-size: 12px;
            height: 45px;
            border-bottom: solid 2px $light1;
        }
        .item-row {
            border-bottom: solid 1px $light1;
            &:hover {
                background: $light;
            }
        }
        th {
            text-transform: uppercase;
            font-size: 12px;
            font-weight: 600;
            color: $dark2;
            i {
                color: $light2;
                margin: 0;
                margin-left: 4px;
            }
            &.active {
                i {
                    color: $primary
                }
            }
        }
    }
    
    .clickable {
        cursor: pointer;
    }

    // Disabled body
    body {
        &::after {
            content: '';
            display: none;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba($dark, .7);
            z-index: 110;
        }
        &.disabled {
            &::after {
                display: block;
            }
        }
    }

    // Icons
    i {
        &.green {
            color: $green;
        }
        &.red {
            color: $red;
        }
        &.dark {
            color: $dark;
        }
        &.primary {
            color: $primary;
        }
    }

    // Scrollbar
    *:not(.app) {
        /* width */
        &::-webkit-scrollbar {
            width: 3px;
        }
        /* Track */
        &::-webkit-scrollbar-track {
            background: $light2; 
        }
        /* Handle */
        &::-webkit-scrollbar-thumb {
            background: $dark2;
            border-radius: 2px;
            &:hover {
                background: $dark25;
            }
        }
        .dark > *, .dark {
            /* width */
            &::-webkit-scrollbar {
                width: 5px;
            }
            /* Track */
            &::-webkit-scrollbar-track {
                background: transparent; 
            }
            /* Handle */
            &::-webkit-scrollbar-thumb {
                background: white;
                box-shadow: -2px 0 #333 inset;
                &:hover {
                    background: $primary;
                }
            }
        }
    }

</style>
