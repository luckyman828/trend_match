<template>
    <i v-if="selection.type == 'Master'" class="fa-poll master" :class="selection.id ? 'fas' : 'far'"
        ><i class="fas fa-crown pos-bottom pos-left primary"></i
    ></i>
    <i
        v-else-if="selection.type == 'Chapter'"
        class="fa-project-diagram master"
        :class="selection.id ? 'fas' : 'far'"
    />
    <i v-else-if="selection.type == 'Summed'" class="fa-poll master" :class="selection.id ? 'fas' : 'far'"
        ><i class="fas fa-sigma pos-bottom pos-left primary"></i
    ></i>
    <i class="fa fa-poll" v-else></i>
</template>

<script>
export default {
    name: 'selectionIcon',
    props: ['selection'],
}
</script>

<style lang="scss" scoped>
i {
    font-size: 14px;
}
</style>
