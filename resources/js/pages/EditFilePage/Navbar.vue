<template>
    <div class="navbar-file flex-wrapper">
        <div class="items-left flex-list">
            <router-link
                :to="{ name: 'files', params: { fileId: currentFile.id, folderId: currentFile.parent_id } }"
                class="back-link"
                ><span class="circle primary"><i class="far fa-arrow-left"></i></span
                ><span>Back to File</span></router-link
            >
            <div class="breadcrumbs">
                <router-link class="text-link" :to="{ name: 'files', params: { folderId: currentFile.parent_id } }"
                    >Files</router-link
                >
                <router-link
                    class="text-link current"
                    :to="{ name: 'files', params: { fileId: currentFile.id, folderId: currentFile.parent_id } }"
                >
                    <strong>{{ currentFile ? currentFile.name : 'Fetching..' }}</strong>
                </router-link>
            </div>
        </div>

        <!-- <div class="items-center">
        </div> -->

        <div class="items-right flex-list">
            <v-popover trigger="click" ref="exportPopover" :open.sync="exportContextOpen">
                <button class="button primary">
                    <i class="far fa-upload"></i>
                    <span>Export</span>
                    <i class="far fa-angle-down"></i>
                </button>
                <BaseContextMenu slot="popover" :inline="true" v-if="exportContextOpen">
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-file-csv"
                            hotkey="KeyC"
                            @click="
                                $refs.exportPopover.hide()
                                onExportCsv()
                            "
                        >
                            <span>Export as <u>C</u>SV</span>
                        </BaseContextMenuItem>
                    </div>
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-file-import"
                            hotkey="KeyF"
                            @click="
                                $refs.exportPopover.hide()
                                exportToFileModalVisible = true
                            "
                        >
                            <span>Export to another <u>F</u>ile</span>
                        </BaseContextMenuItem>
                    </div>
                </BaseContextMenu>
            </v-popover>
            <v-popover trigger="click" ref="importPopover" :open.sync="importContextOpen">
                <button class="button primary">
                    <i class="far fa-download"></i>
                    <span>Import</span>
                    <i class="far fa-angle-down"></i>
                </button>
                <BaseContextMenu slot="popover" :inline="true" v-if="importContextOpen">
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-file-excel"
                            hotkey="KeyS"
                            @click="
                                $refs.importPopover.hide()
                                SHOW_COMPONENT('importFromSpreadsheetModal')
                            "
                        >
                            <span>Import from <u>S</u>preadsheet</span>
                        </BaseContextMenuItem>
                    </div>
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-database"
                            hotkey="KeyD"
                            :disabled="databases.length <= 0"
                            disabledTooltip="No databases connected. Ask your admin to get an integration with Kollekt"
                            @click="
                                $refs.importPopover.hide()
                                SHOW_COMPONENT('importFromDatabaseControls')
                            "
                        >
                            <span>Import from <u>D</u>atabase</span>
                        </BaseContextMenuItem>
                    </div>
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-file-import"
                            hotkey="KeyK"
                            @click="
                                $refs.importPopover.hide()
                                SHOW_COMPONENT('importFromKollektModal')
                            "
                        >
                            <span>Import from <u>K</u>ollekt</span>
                        </BaseContextMenuItem>
                    </div>
                </BaseContextMenu>
            </v-popover>
            <button class="button primary" @click="onNewProduct">
                <i class="far fa-plus"></i>
                <span>Add product</span>
            </button>
        </div>

        <!-- <ExportProductsModal v-if="currentFile" :show="exportModalVisible" @close="exportModalVisible = false"/> -->
        <ExportToCsvModal v-if="currentFile" :show="exportCsvModalVisible" @close="exportCsvModalVisible = false" />

        <ExportToFileModal
            v-if="exportToFileModalVisible"
            :show="exportToFileModalVisible"
            @close="exportToFileModalVisible = false"
        />

        <ImportFromDatabaseControls
            v-if="importFromDatabaseControlsVisible"
            :show="importFromDatabaseControlsVisible"
        />

        <ImportFromKollektModal v-if="importFromKollektModalVisible" :show="importFromKollektModalVisible" />

        <ImportFromSpreadsheetModal
            v-if="currentFile"
            :show="importFromSpreadsheetModalVisible"
            @close="importFromSpreadsheetModalVisible = false"
            :key="uploadToFileKey"
            @reset="uploadToFileKey++"
        />
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ExportProductsModal from '../../components/ExportProductsModal'
import ExportToCsvModal from '../../components/ExportToCsvModal'
import ExportToFileModal from '../../components/common/ExportToFileModal'
import ImportFromKollektModal from '../../components/common/ImportFromKollektModal'
import ImportFromSpreadsheetModal from '../../components/ImportFromSpreadsheetModal'
import ImportFromDatabaseControls from './ImportFromDatabaseControls'

export default {
    name: 'editFilePageNavbar',
    components: {
        ExportProductsModal,
        ExportToCsvModal,
        ImportFromSpreadsheetModal,
        ExportToFileModal,
        ImportFromKollektModal,
        ImportFromDatabaseControls,
    },
    data: function() {
        return {
            exportModalVisible: false,
            exportCsvModalVisible: false,
            uploadToFileKey: 0,
            exportToFileModalVisible: false,
            exportContextOpen: false,
            importContextOpen: false,
        }
    },
    computed: {
        ...mapGetters('display', ['getComponentIsVisible']),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('products', ['products']),
        ...mapGetters('workspaces', {
            databases: 'getWorkspaceDatabases',
        }),
        importFromSpreadsheetModalVisible() {
            return this.getComponentIsVisible('importFromSpreadsheetModal')
        },
        importFromDatabaseControlsVisible() {
            return this.getComponentIsVisible('importFromDatabaseControls')
        },
        importFromKollektModalVisible() {
            return this.getComponentIsVisible('importFromKollektModal')
        },
    },
    methods: {
        ...mapActions('products', ['instantiateNewProduct']),
        ...mapMutations('products', ['setCurrentProduct', 'setSingleVisisble', 'updateProduct']),
        ...mapMutations('display', ['SHOW_COMPONENT']),
        async onNewProduct() {
            const newProduct = await this.instantiateNewProduct()
            this.setCurrentProduct(newProduct)
            this.setSingleVisisble(true)
        },
        onExport() {
            this.exportModalVisible = true
        },
        onExportCsv() {
            this.exportCsvModalVisible = true
        },
        onUploadToFile() {
            this.importFromSpreadsheetModalVisible = true
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.navbar-file {
    width: 100%;
    display: flex;
    justify-content: space-between;
    > * {
        align-items: center;
    }
}
.items-center {
    flex: 1;
    padding: 0 40px;
}
.back-link {
    padding-right: 28px;
    border-right: solid 2px $light2;
    margin-right: 28px;
    .circle {
        margin-right: 8px;
    }
}
.breadcrumbs {
    display: flex;
    > * {
        display: inline-flex;
        align-items: center;
    }
    > *:not(:first-child)::before {
        content: '';
        pointer-events: none;
        color: $dark1;
        margin-left: 8px;
        margin-right: 10px;
        margin-bottom: 2px;
        font-size: 10px;
        font-family: 'Font Awesome 5 Pro';
        font-weight: 900;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        line-height: 1;
    }
    > *:last-child::before {
        content: '';
    }
}
</style>
