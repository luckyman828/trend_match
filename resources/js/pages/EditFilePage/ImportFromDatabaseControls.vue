<template>
    <div class="import-from-database-controls">
        <h4 class="header flex-list justify center-v">
            <span v-if="mode == 'Upload'">Upload a file of IDs</span>
            <span v-else-if="mode == 'Scan'">Scan barcodes to add products</span>
            <span v-else-if="mode == 'Search'">Search to add products</span>
            <span v-else>How would you like to get files from the database</span>
            <button class="white pill back-button sm" v-if="!!mode" @click="mode = null">
                <i class="far fa-arrow-left"></i>
                <span>Back</span>
            </button>
        </h4>

        <!-- UPLOAD FILE -->
        <UploadFileSection v-if="mode == 'Upload'" @submit="fetchProducts" />

        <!-- SCAN BARCODES -->
        <div v-if="mode == 'Scan'" class="flex-list center-h">
            <i class="fal fa-barcode-read white xl"></i>
        </div>

        <!-- SCAN BARCODES -->
        <!-- <div v-if="mode == 'Search'" class="flex-list center-h"> -->
        <BaseInputField
            v-if="mode == 'Search'"
            v-model="searchString"
            placeholder="Id or EAN. Finish with 'ENTER'"
            :focusOnMount="true"
            :selectOnFocus="true"
            v-slot="slotProps"
            @submit="fetchProducts([searchString])"
        >
            <button class="circle primary sm" @click="slotProps.onSubmit()">
                <i class="far fa-arrow-right"></i>
            </button>
        </BaseInputField>
        <!-- </div> -->

        <!-- CHOOSE MODE -->
        <div class="flex-list md justify choose-mode">
            <button
                :class="mode == 'Upload' ? 'primary' : 'white'"
                @click="mode == 'Upload' ? (mode = null) : (mode = 'Upload')"
            >
                <i class="far fa-file-import"></i>
                <span>Upload IDs</span>
            </button>
            <button
                :class="mode == 'Scan' ? 'primary' : 'white'"
                @click="mode == 'Scan' ? (mode = null) : (mode = 'Scan')"
            >
                <i class="far fa-scanner"></i>
                <span>Scan Barcodes</span>
            </button>
            <button
                :class="mode == 'Search' ? 'primary' : 'white'"
                @click="mode == 'Search' ? (mode = null) : (mode = 'Search')"
            >
                <i class="far fa-search"></i>
                <span>Search</span>
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UploadFileSection from './UploadFileSection'
export default {
    name: 'importFromDatabaseControls',
    components: {
        UploadFileSection,
    },
    props: ['show'],
    data: function() {
        return {
            mode: null,
            searchString: '',
            scanStarted: false,
            scanStr: '',
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            databases: 'getWorkspaceDatabases',
        }),
    },
    watch: {
        mode(newVal, oldVal) {
            if (newVal == 'Scan') this.addScanListener()
            if (oldVal == 'Scan') this.removeScanListener()
        },
    },
    methods: {
        ...mapActions('products', ['fetchProductsFromDatabase']),
        ...mapMutations('display', ['HIDE_COMPONENT']),
        async fetchProducts(queryValues) {
            const products = await this.fetchProductsFromDatabase({
                databaseId: this.databases[0].id,
                // columnNameList: ['EAN_NO', 'STYLE_NUMBER'],
                columnNameList: ['EAN_NO'],
                queryValues,
            })
        },
        addScanListener() {
            document.addEventListener('keydown', this.scanHandler)
        },
        removeScanListener() {
            document.removeEventListener('keydown', this.scanHandler)
        },
        scanHandler(e) {
            // Prevent default to avoid quirky behaviour from carriage or similar
            e.preventDefault()
            // Check if we get at least 12 concecutive inputs with very small interval
            // If that is the case, we have a scan
            const digit = e.code.substr(e.code.length - 1)
            // Check that the digit is actually a numberc
            const regex = /[0-9]/
            const isNumber = !!regex.exec(digit)
            if (isNumber) this.scanStr += digit
            if (!this.scanStarted) {
                this.scanStarted = true
                setTimeout(() => {
                    if (this.scanStr.length >= 10) {
                        this.onScan(this.scanStr)
                    }
                    this.scanStr = ''

                    this.scanStarted = false
                }, 50)
            }
        },
        onScan(scanCode) {
            // const succesAudio = new Audio('/assets/SFX/pling.mp3')
            // const failAudio = new Audio('/assets/SFX/error.mp3')
            this.fetchProducts([scanCode])
        },
    },
    destroyed() {
        this.removeScanListener()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.import-from-database-controls {
    display: block;
    position: fixed;
    bottom: 20px;
    z-index: 1;
    background: $dark;
    padding: 16px 40px 20px;
    border-radius: $borderRadiusEl;
    box-shadow: $shadowEl;
    left: 50%;
    transform: translateX(-50%);
    width: 424px;
    color: white;
    .header {
        color: white;
        margin: 0 0 16px;
    }
    .back-button {
        margin-left: 20px;
    }
    .choose-mode {
        margin-top: 32px;
    }
}
</style>
