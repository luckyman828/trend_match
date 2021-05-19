<template>
    <PageLoader>
        <KollektAppSelectorPage />
    </PageLoader>
</template>

<script>
import PageLoader from '../../../components/common/PageLoader'
import KollektAppSelectorPage from './KollektAppSelectorPage'
export default {
    name: 'kollektAppSelectorPageLoader',
    components: { PageLoader, KollektAppSelectorPage },
}
</script>

<style></style>
