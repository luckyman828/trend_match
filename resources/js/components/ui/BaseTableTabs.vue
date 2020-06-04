<template>
    <div class="tabs">
        <div class="tab" v-for="(tab, index) in tabs" :key="index" @click="change(tab)" :class="{active: tab == activeTab}">
            <span>{{tab}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tabs',
    props: [
        'tabs',
        'activeTab'
    ],
    methods: {
        change(tab) {
            this.$emit('input', tab)
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .tabs {
        display: flex;
        margin-bottom: -$borderRadiusModule;
        .tab {
            border: $borderModule;
            height: $heightTableTab;
            width: 220px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            border-radius: $borderRadiusModule $borderRadiusModule 0 0;
            background: $bgContentActive;
            font-weight: 700;
            font-size: 14px;
            color: $dark15;
            cursor: pointer;
            padding-bottom: $borderRadiusModule;
            box-sizing: content-box;
            &:hover {
                background: $light2;
                color: $dark05;
            }
            &.active {
                background: white;
                color: $primary;
                cursor: auto;
            }
            &:not(:last-child) {
                margin-right: 8px;
            }
        }
    }

</style>