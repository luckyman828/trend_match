<template>
    <i v-if="selection.type == 'Master'" class="fa-poll master" :class="selection.id ? 'fas' : 'far'"
        ><i class="fas fa-crown pos-bottom pos-left primary"></i
    ></i>
    <i v-else-if="selection.type == 'Chapter'" class="fa-project-diagram master" :class="selection.id ? 'fas' : 'far'">
        <i class="fas fa-filter pos-bottom pos-left primary"></i>
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
    font-size: 16px;
}
</style>
