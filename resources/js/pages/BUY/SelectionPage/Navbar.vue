<template>
    <portal to="navbar">
        <div class="flex-list equal-width full-w">
            <div class="left flex-list lg">
                <router-link
                    :to="{ name: 'buy.files', params: { fileId: currentFile.id, folderId: currentFile.parent_id } }"
                    class="button primary ghost pill"
                >
                    <i class="far fa-arrow-left"></i>
                    <span>Back to files</span>
                </router-link>

                <div class="flex-list flex-v min" style="line-height: 1.3;">
                    <div class="ft-bd ft-12">{{ currentFile ? currentFile.name : 'Fetching..' }}</div>
                    <div class="ft-bd ft-14">{{ currentSelection.name }}</div>
                </div>
            </div>

            <div class="center">
                <BaseSearchField
                    v-model="productsFilteredBySearch"
                    :searchKey="['datasource_id', 'title', 'category', 'eans']"
                    :arrayToSearch="products"
                />
            </div>

            <div class="right flex-list flex-end-h">
                <v-popover trigger="click" ref="exportPopover" :open.sync="showMoreContext">
                    <button class="button ghost pill">
                        <span>More</span>
                        <i class="far fa-ellipsis-h"></i>
                    </button>
                    <BaseContextMenu slot="popover" :inline="true" v-if="showMoreContext">
                        <div class="item-group">
                            <div class="scanner-mode-toggle item-wrapper">
                                <BaseToggle
                                    label="Scanner Mode"
                                    sizeClass="xs"
                                    :isActive="scannerModeActive"
                                    @toggle="onToggleScannerMode"
                                />
                            </div>
                        </div>
                    </BaseContextMenu>
                </v-popover>

                <v-popover trigger="click" ref="exportPopover" :open.sync="exportContextOpen">
                    <button class="button dark pill">
                        <span>Export</span>
                        <i class="far fa-share"></i>
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
            </div>

            <ExportProductsModal v-if="exportModalVisible" :show="exportModalVisible" />
            <ExportToCsvModal v-if="exportCsvModalVisible" :show="exportCsvModalVisible" />
            <ExportToFileModal
                v-if="exportToFileModalVisible"
                :show="exportToFileModalVisible"
                @close="exportToFileModalVisible = false"
            />
        </div>
    </portal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ExportProductsModal from '../../../components/ExportProductsModal'
import ExportToCsvModal from '../../../components/BUY/ExportToCsvModal/'
import ExportToFileModal from '../../../components/common/ExportToFileModal'
import BudgetCounter from './BudgetCounter'

export default {
    name: 'buy.SelectionPageNavbar',
    components: {
        ExportProductsModal,
        ExportToCsvModal,
        ExportToFileModal,
        BudgetCounter,
    },
    data: function() {
        return {
            exportToFileModalVisible: false,
            exportContextOpen: false,
            viewAsContextOpen: false,
            showMoreContext: false,
        }
    },
    computed: {
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', ['currentSelection']),
        productsFilteredBySearch: {
            get() {
                return this.$store.getters['products/getProductsFilteredBySearch']
            },
            set(value) {
                this.SET_PRODUCTS_FILTERED_BY_SEARCH(value)
            },
        },
        ...mapGetters('products', {
            productsStatus: 'productsStatus',
            exportModalVisible: 'getPDFModalVisible',
            exportCsvModalVisible: 'getCSVModalVisisble',
            products: 'getProductsFiltered',
        }),
        ...mapGetters('scanner', {
            scannerModeActive: 'getScannerModeActive',
        }),
        ...mapGetters('auth', {
            isSystemAdmin: 'getIsSystemAdmin',
        }),
        ...mapGetters('workspaces', {
            authUserWorkspaceRole: 'authUserWorkspaceRole',
        }),
        roleIcon() {
            let roleIcon = 'far fa-shield'
            if (!this.currentSelection) return roleIcon
            const role = this.currentSelection.your_role
            if (role == 'Owner') roleIcon = 'far fa-user-shield'
            if (role == 'Member') roleIcon = 'far fa-user'
            if (role == 'Approver') roleIcon = 'far fa-user-clock'
            return roleIcon
        },
    },
    methods: {
        ...mapMutations('products', ['SET_SHOW_CSV_MODAL', 'SET_SHOW_PDF_MODAL', 'SET_PRODUCTS_FILTERED_BY_SEARCH']),
        ...mapMutations('scanner', ['SET_SCANNER_MODE']),
        onExport() {
            this.SET_SHOW_PDF_MODAL(true)
        },
        onExportCsv() {
            this.SET_SHOW_CSV_MODAL(true)
        },
        onToggleScannerMode() {
            const modeToSet = this.scannerModeActive ? null : 'product'
            this.SET_SCANNER_MODE(modeToSet)
        },
    },
}
</script>

<style lang="scss" scoped></style>
