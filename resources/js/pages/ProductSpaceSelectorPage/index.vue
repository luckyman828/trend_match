<template>
    <PageLoader>
        <ProductSpaceSelectorPage />
    </PageLoader>
</template>

<script>
import PageLoader from '../../components/common/PageLoader'
import ProductSpaceSelectorPage from './ProductSpaceSelectorPage'
export default {
    name: 'productSpaceSelectorPageLoader',
    components: { PageLoader, ProductSpaceSelectorPage },
}
</script>

<style></style>
