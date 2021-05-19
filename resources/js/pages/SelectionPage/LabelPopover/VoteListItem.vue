<template>
    <div class="vote-list-item flex-list justify center-v">
        <div class="name-wrapper flex-list space-sm center-v">
            <SelectionIcon :selection="vote.selection" />
            <div class="name ft-12 ft-md">{{ vote.selection.name }}</div>
        </div>
        <div class="action ft-soft ft-10 ft-md" v-if="vote.action == 'Focus'">
            Focus
            <div class="focus-indicator" />
        </div>
    </div>
</template>

<script>
import SelectionIcon from '../../../components/common/SelectionIcon'

export default {
    name: 'voteListItem',
    props: ['vote'],
    components: { SelectionIcon },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.vote-list-item {
    border: $borderEl;
    border-radius: $borderRadiusSm;
    padding: 2px 16px 2px 4px;
    position: relative;
    overflow: hidden;
    .action {
        margin-left: auto;
        .focus-indicator {
            position: absolute;
            right: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: $primary;
        }
    }
}
</style>
