<template>
    <div class="action-distribution-list">

        <div class="header">
            <div class="segment-toggle">
                <BaseButton targetAreaPadding="16px 4px 16px 16px"
                :buttonClass="currentTab == 'alignment' ? 'white xs full-width' : 'invisible ghost-hover xs full-width'"
                @click="setCurrentTab('alignment')">
                    <span>Alignment</span>
                </BaseButton>
                <BaseButton targetAreaPadding="16px 16px 16px 4px"
                :buttonClass="currentTab == 'feedback' ? 'white xs full-width' : 'invisible ghost-hover xs full-width'"
                @click="setCurrentTab('feedback')">
                    <span>Feedback</span>
                </BaseButton>
            </div>
        </div>

        <!-- Alignment List -->
        <table class="action-list" v-if="currentTab == 'alignment'">
            <tr class="action" v-for="(action, index) in alignmentActions" :key="index">
                <td>{{action.action}}</td>
                <td>
                    <span class="main">{{action.selection ? action.selection.name : 'Unknown'}}</span>
                    <span class="sub" v-if="action.action != 'None'">{{action.user ? action.user.name : 'Anonymous'}}</span>
                </td>
            </tr>

            <tr v-if="alignmentActions.length <= 0">
                <td>No alignment input</td>
            </tr>
        </table>

        <!-- Feedback List -->
        <table class="action-list" v-if="currentTab == 'feedback'">
            <tr class="action" v-for="(action, index) in feedbackActions" :key="index">
                <td>{{action.action}}</td>
                <td>
                    <span class="main">{{action.user ? action.user.name : 'Anonymous'}}</span>
                    <span class="sub">{{action.selection ? action.selection.name : 'Unknown'}}</span>
                </td>
            </tr>

            <tr v-if="feedbackActions.length <= 0">
                <td>No feedback input</td>
            </tr>
        </table>

    </div>
</template>

<script>
export default {
    name: 'actionDistributionList',
    props: [
        'alignmentActions',
        'feedbackActions',
        'defaultTab',
    ],
    data: function() { return {
        currentTab: 'feedback'
    }},
    methods: {
        setCurrentTab(tab) {
            this.currentTab = tab
            this.$emit('changeTab', tab)
        }
    },
    created() {
        if (this.defaultTab) this.currentTab = this.defaultTab
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .header {
        padding: 0 16px;
        margin-bottom: 8px;
    }

    .segment-toggle {
        padding: 4px;
        width: 100%;
        display: flex;
        background: $bg;
        border-radius: 4px;
        > * {
            width: 50%;
            &:not(:last-child) {
                margin-right: 4px;
            }
        }
    }

    .action-list {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 4px;
        tr:not(:last-child) td {
            border-bottom: solid 1px $divider;
        }
        td {
            padding: 2px 0;
            &:not(:first-child) {
                padding-left: 8px;
                font-weight: 700;
            }
            &:first-child {
                padding-left: 16px;
            }
            &:last-child {
                padding-right: 16px;
            }
        }
        .sub {
            display: block;
            font-weight: 400;
            font-size: 11px;
            margin-top: -2px;
            margin-bottom: 2px;
        }
        .main {
            display: block;
        }
    }

</style>