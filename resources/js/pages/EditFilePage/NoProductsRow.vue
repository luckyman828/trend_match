<template>
    <BaseTableInnerRow>
        <div class="no-products-row">
            <h2>Add products</h2>
            <div class="flex-list center-h md">
                <div class="card" @click="onImportFromSpreadsheet">
                    <i class="fas fa-file-excel icon"></i>
                    <h4 class="title">
                        Spreadsheet
                    </h4>
                    <div class="pill white ghost">
                        <span>Import from file</span>
                        <i class="far fa-arrow-right"></i>
                    </div>
                    <span class="description">
                        .csv or .xlsx
                    </span>
                </div>

                <div class="card" @click="onImportFromDatabase">
                    <i class="fas fa-database icon"></i>
                    <h4 class="title">
                        Database
                    </h4>
                    <div class="white ghost pill">
                        <span>Import from database</span>
                        <i class="far fa-arrow-right"></i>
                    </div>
                    <span class="description">Get products from a connected Database</span>
                </div>

                <div class="card" @click="onImportFromFile">
                    <i class="fas fa-file-import icon"></i>
                    <h4 class="title">
                        Kollekt
                    </h4>
                    <div class="white ghost pill">
                        <span>Import from Kollekt</span>
                        <i class="far fa-arrow-right"></i>
                    </div>
                    <span class="description">Browse existing files on Kollekt</span>
                </div>
            </div>
        </div>
    </BaseTableInnerRow>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'noProductsRow',
    methods: {
        ...mapMutations('display', ['SHOW_COMPONENT', 'HIDE_COMPONENT']),
        onImportFromSpreadsheet() {
            this.SHOW_COMPONENT('uploadToFileModal')
        },
        onImportFromDatabase() {},
        onImportFromFile() {},
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.no-products-row {
    width: 100%;
    text-align: center;
    padding: 20px 0 40px;
    img {
        margin: 20px 0;
        height: 200px;
    }
    h2 {
        margin-bottom: 32px;
    }
    .card {
        background: $dark;
        border-radius: 16px;
        padding: 48px 20px 20px;
        width: 260px;
        transition: 0.1s ease-out;
        &:hover {
            background: $primary;
            box-shadow: $shadowEl;
            transform: translateY(-1px);
        }
        cursor: pointer;
        > *:not(.pill) {
            display: block;
            color: white;
        }
        .title {
            font-size: 20px;
            font-weight: 700;
            margin: 28px 0;
        }
        .icon {
            font-size: 28px;
        }
        .description {
            font-size: 12px;
            margin-top: 8px;
            white-space: normal;
        }
    }
}
</style>
