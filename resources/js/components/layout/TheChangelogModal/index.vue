<template>
    <BaseModal :show="show" @close="SHOW_CHANGELOG(false)"
    header="What's new?" 
    classes="full-body">
        <ChangelogPost title="August 2020 Release"
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