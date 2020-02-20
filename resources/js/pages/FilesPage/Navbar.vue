<template>
    <div class="navbar-files flex-wrapper">
        <div class="items-left">

        </div>
        <div class="item-right">
            <button class="primary" @click="createFileModalVisible = true"><span>Add file</span></button>
        </div>

        <CreateFileModal :show="createFileModalVisible" ref="createFileModal" 
        @close="createFileModalVisible = false"/>
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
        createFileModalVisible: false,
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