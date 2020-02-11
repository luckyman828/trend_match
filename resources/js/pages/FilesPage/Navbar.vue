<template>
    <div class="navbar-files flex-wrapper">
        <div class="items-left">

        </div>
        <div class="item-right">
            <button class="primary" @click="$refs.createFileModal.$refs.modal.show()"><span>Add file</span></button>
        </div>

        <CreateFileModal ref="createFileModal"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateFileModal from './CreateFileModal'

export default {
    name: 'filesPageNavbar',
    components: {
        CreateFileModal
    },
    data: function () { return {
    }},
    computed: {
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .navbar-files {
        display: flex;
        justify-content: space-between;
        padding: 8px 60px;
        > * {
            display: flex;
            align-items: center;
        }
    }

</style>