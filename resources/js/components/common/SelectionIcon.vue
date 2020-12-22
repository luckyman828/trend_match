<template>
    <i v-if="selection.type == 'Master'" class="fa-poll master" :class="selection.id ? 'fas' : 'far'"
        ><i class="fas fa-crown"></i
    ></i>
    <i v-else-if="selection.type == 'Chapter'" class="fa-project-diagram master" :class="selection.id ? 'fas' : 'far'">
        <i class="fas fa-filter"></i>
    </i>
    <i class="fa fa-poll" v-else></i>
</template>

<script>
export default {
    name: 'selectionIcon',
    props: ['selection'],
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
i {
    width: 24px;
    font-size: 16px;
    &.master {
        position: relative;
        i {
            position: absolute;
            left: -3px;
            bottom: 5px;
            font-size: 11px;
            color: $primary;
            margin: 0;
            width: auto;
        }
        &::after {
            opacity: 1;
        }
    }
}
</style>
