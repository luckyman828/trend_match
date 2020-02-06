<template>
    <div class="header">
        <div class="left">
            <h1>{{file.title}}</h1>
        </div>
        <div class="right">
            <div class="progress">
                <span class="title">Progress</span>
                <svg height="4">
                    <rect class="background" width="100%" height="4"/>
                    <rect class="value" :width="0+'%'" height="4"/>
                </svg>
                <span class="value">0%</span>
            </div>
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
    }

</style>