<template>
    <BaseModal :show="show" @close="SHOW_CHANGELOG(false)"
    header="Heyo, what's new?" 
    classes="full-body">
        <ChangelogPost title="New release July 2020"
            featuredImgUrl="/images/blog/undraw_Around_the_world_re_n353.svg"/>
        <ChangelogPost title="Mega update: June+May 2020"
            featuredImgUrl="/images/blog/undraw_Gift_box_re_vau4.svg"/>
    </BaseModal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ChangelogPost from './ChangelogPost'

export default {
    name: 'changelogModal',
    components: {
        ChangelogPost,
    },
    computed: {
        ...mapGetters('changelog', {
            show: 'getShowChangelog'
        })
    },
    methods: {
        ...mapMutations('changelog', ['SHOW_CHANGELOG'])
    }
}
</script>

<style>

</style>