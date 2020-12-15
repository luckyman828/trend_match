<template>
    <div class="navbar-file flex-wrapper">
        <div class="items-left">
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

        <div class="items-center">
            <BudgetCounter
                v-if="productsStatus == 'success' && currentSelection && showQty"
                :selection="currentSelection"
            />
        </div>

        <div class="items-right">
            <!-- START SYSTEM ADMIN -->
            <v-popover
                v-if="isSystemAdmin && !!currentSelection"
                trigger="click"
                ref="viewAsPopover"
                :open.sync="viewAsContextOpen"
            >
                <button class="button primary">
                    <i :class="roleIcon"></i>
                    <span>View as: {{ currentSelection.your_role || 'No role' }}</span>
                    <i class="far fa-angle-down"></i>
                </button>
                <BaseContextMenu slot="popover" :inline="true" v-if="viewAsContextOpen">
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-user"
                            hotkey="KeyM"
                            @click="
                                $refs.viewAsPopover.hide()
                                onViewSelectionAsRole('Member')
                            "
                        >
                            <span><u>M</u>ember</span>
                        </BaseContextMenuItem>
                    </div>
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-user-shield"
                            hotkey="KeyO"
                            @click="
                                $refs.viewAsPopover.hide()
                                onViewSelectionAsRole('Owner')
                            "
                        >
                            <span><u>O</u>wner</span>
                        </BaseContextMenuItem>
                    </div>
                    <div class="item-group" v-if="currentSelection.type == 'Master'">
                        <BaseContextMenuItem
                            iconClass="far fa-user-clock"
                            hotkey="KeyA"
                            @click="
                                $refs.viewAsPopover.hide()
                                onViewSelectionAsRole('Approver')
                            "
                        >
                            <span><u>A</u>pprover</span>
                        </BaseContextMenuItem>
                    </div>
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-times"
                            hotkey="KeyN"
                            @click="
                                $refs.viewAsPopover.hide()
                                onViewSelectionAsRole()
                            "
                        >
                            <span><u>N</u>o role</span>
                        </BaseContextMenuItem>
                    </div>
                </BaseContextMenu>
            </v-popover>
            <!-- END SYSTEM ADMIN -->

            <div class="scanner-mode-toggle">
                <BaseToggle
                    label="Scanner Mode"
                    sizeClass="xs"
                    :isActive="scannerModeActive"
                    @toggle="onToggleScannerMode"
                />
            </div>

            <SelectionPresenterModeButton :selection="currentSelection" />

            <v-popover trigger="click" ref="exportPopover" :open.sync="exportContextOpen">
                <button class="button primary">
                    <i class="far fa-upload"></i>
                    <span>Export</span>
                    <i class="far fa-angle-down"></i>
                </button>
                <BaseContextMenu slot="popover" :inline="true" v-if="exportContextOpen">
                    <div class="item-group">
                        <BaseContextMenuItem
                            iconClass="far fa-file-pdf"
                            hotkey="KeyP"
                            @click="
                                $refs.exportPopover.hide()
                                onExport()
                            "
                        >
                            <span>Export as <u>P</u>DF</span>
                        </BaseContextMenuItem>
                    </div>
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
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ExportProductsModal from '../../components/ExportProductsModal'
import ExportToCsvModal from '../../components/ExportToCsvModal'
import ExportToFileModal from '../../components/common/ExportToFileModal'
import SelectionPresenterModeButton from '../../components/SelectionPresenterModeButton'
import BudgetCounter from './BudgetCounter'

export default {
    name: 'selectionPageNavbar',
    components: {
        ExportProductsModal,
        ExportToCsvModal,
        ExportToFileModal,
        SelectionPresenterModeButton,
        BudgetCounter,
    },
    data: function() {
        return {
            exportToFileModalVisible: false,
            exportContextOpen: false,
            viewAsContextOpen: false,
        }
    },
    computed: {
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', ['currentSelection']),
        ...mapGetters('selections', {
            showQty: 'getQuantityModeActive',
        }),
        ...mapGetters('products', {
            productsStatus: 'productsStatus',
            exportModalVisible: 'getPDFModalVisible',
            exportCsvModalVisible: 'getCSVModalVisisble',
        }),
        ...mapGetters('scanner', {
            scannerModeActive: 'getScannerModeActive',
        }),
        ...mapGetters('auth', {
            isSystemAdmin: 'getIsSystemAdmin',
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
        ...mapMutations('products', ['SET_SHOW_CSV_MODAL', 'SET_SHOW_PDF_MODAL']),
        ...mapMutations('scanner', ['SET_SCANNER_MODE']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTION_REAL_ROLE']),
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
        onViewSelectionAsRole(role) {
            this.SET_CURRENT_SELECTION_REAL_ROLE(this.currentSelection.your_role)
            this.currentSelection.your_role = role
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
        display: flex;
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
