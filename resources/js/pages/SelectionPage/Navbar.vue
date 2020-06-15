<template>
    <div class="navbar-file flex-wrapper">

        <div class="items-left">

            <router-link :to="{name: 'files', params: {fileId: currentFile.id, folderId: currentFile.parent_id}}" class="back-link"><span class="circle primary"><i class="far fa-arrow-left"></i></span><span>Back to File</span></router-link>
            <div class="breadcrumbs">
                <router-link class="text-link" :to="{name: 'files', params: {folderId: currentFile.parent_id}}">Files</router-link>
                <router-link class="text-link current" :to="{name: 'files', params: {fileId: currentFile.id, folderId: currentFile.parent_id}}">
                    <strong>{{currentFile ? currentFile.name : 'Fetching..'}}</strong>
                </router-link>
            </div>

        </div>

        <div class="items-center">
            <BudgetCounter v-if="currentSelection && currentSelection.budget > 0"/>
        </div>

        <div class="items-right">
            <SelectionPresenterModeButton :selection="currentSelection"/>

            <button class="button primary wide" @click="onExport"><span>Export PDF</span></button>
            <button class="button primary wide" @click="onExportCsv"><span>Export CSV</span></button>
        </div>

        <ExportProductsModal v-if="exportModalVisible" :show="exportModalVisible" @close="exportModalVisible = false"/>
        <ExportToCsvModal v-if="exportCsvModalVisible" :show="exportCsvModalVisible" @close="exportCsvModalVisible = false"/>
    </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ExportProductsModal from '../../components/ExportProductsModal'
import ExportToCsvModal from '../../components/ExportToCsvModal'
import SelectionPresenterModeButton from '../../components/SelectionPresenterModeButton'
import BudgetCounter from './BudgetCounter'

export default {
    name: "editFilePageNavbar",
    components: {
        ExportProductsModal,
        ExportToCsvModal,
        SelectionPresenterModeButton,
        BudgetCounter,
    },
    data: function () { return {
        exportModalVisible: false,
        exportCsvModalVisible: false,
    }},
    computed: {
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', ['currentSelection']),
    },
    methods: {
        onExport() {
            this.exportModalVisible = true
        },
        onExportCsv() {
            this.exportCsvModalVisible = true
        }
    },
};
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
            font-family: "Font Awesome 5 Pro";
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
