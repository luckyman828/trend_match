<template>
    <PageLoader :isLoading="false">
        <div class="container">
            <h1>Component Library Showcase</h1>
            <div class="section-wrapper">
                <DemoBaseButton />
                <DemoBaseButtonV2 />
                <DemoBaseCheckbox />
            </div>
        </div>
    </PageLoader>
</template>

<script>
import PageLoader from '../../../components/common/PageLoader'
import DemoBaseButton from './DemoBaseButton'
import DemoBaseButtonV2 from './DemoBaseButtonV2'
import DemoBaseCheckbox from './DemoBaseCheckbox'

export default {
    name: 'ComponentShowcasePage',
    components: {
        PageLoader,
        DemoBaseButton,
        DemoBaseButtonV2,
        DemoBaseCheckbox,
    },
    data() {
        return {
            showAddUsersModal: false,
        }
    },
}
</script>

<style scoped lang="scss">
.container {
    max-width: 800px;
    margin-top: 40px;
}
</style>
