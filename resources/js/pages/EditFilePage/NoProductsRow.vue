<template>
    <BaseTableInnerRow>
        <div class="no-products-row">
            <h2>It looks empty here..</h2>
            <img src="/images/undraw_empty_xct9.svg" alt="empty image" />
            <h3>Import products to get started</h3>
            <div class="flex-list center-h md">
                <button class="primary md" @click="onImportFromCSV">
                    <i class="far fa-file-csv"></i>
                    <span>from CSV/Excel</span>
                </button>
                <button class="primary md" @click="onImportFromFile">
                    <i class="far fa-file-import"></i>
                    <span>from Kollekt</span>
                </button>
                <button class="primary md">
                    <i class="far fa-download"></i>
                    <span>from Database</span>
                </button>
            </div>
        </div>
    </BaseTableInnerRow>
</template>

<script>
export default {
    name: 'noProductsRow',
    methods: {
        onImportFromCSV() {},
        onImportFromFile() {},
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.no-products-row {
    width: 100%;
    text-align: center;
    padding: 20px 0 32px;
    img {
        margin: 20px 0;
        height: 200px;
    }
    h3 {
        margin-top: 0;
    }
}
</style>
