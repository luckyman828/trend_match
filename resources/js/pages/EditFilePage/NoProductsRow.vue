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

                <div
                    class="card"
                    :class="{ disabled: !workspaceFeatures.import_from_integration }"
                    @click="!!workspaceFeatures.import_from_integration && onImportFromDatabase()"
                    v-tooltip="
                        !workspaceFeatures.import_from_integration &&
                            'No databases available. Ask your admin to get an integration to Kollekt.'
                    "
                >
                    <i class="fas fa-database icon"></i>
                    <h4 class="title">
                        Integration
                    </h4>
                    <div class="white ghost pill" :class="{ disabled: !workspaceFeatures.import_from_integration }">
                        <span>Import from integration</span>
                        <i class="far fa-arrow-right"></i>
                    </div>
                    <span class="description">Get products from a connected Integration</span>
                </div>

                <div class="card" @click="onImportFromKollekt">
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
    computed: {
        ...mapGetters('workspaces', {
            databases: 'getWorkspaceDatabases',
            workspaceFeatures: 'getEnabledFeatures',
        }),
    },
    methods: {
        ...mapMutations('display', ['SHOW_COMPONENT', 'HIDE_COMPONENT']),
        onImportFromSpreadsheet() {
            this.SHOW_COMPONENT('importFromSpreadsheetModal')
        },
        onImportFromDatabase() {
            this.SHOW_COMPONENT('importFromDatabaseControls')
        },
        onImportFromKollekt() {
            this.SHOW_COMPONENT('importFromKollektModal')
        },
    },
}
</script>

<style scoped lang="scss">
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
        transition: background 0.1s ease-out, transform 0.2s ease-out;
        cursor: pointer;
        &.disabled {
            background: $bluegrey400;
            cursor: default;
            .pill {
                background: none;
                color: white;
                i {
                    color: white;
                    font-weight: 400;
                }
            }
        }
        &:not(.disabled) {
            &:hover {
                background: $primary;
                box-shadow: 0 3px 6px 0 rgba(117, 134, 156, 0.5);
                transform: translateY(-4px);
                .pill {
                    background: white;
                    color: $font;
                    i {
                        color: $font;
                        font-weight: 900;
                    }
                }
            }
        }
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
