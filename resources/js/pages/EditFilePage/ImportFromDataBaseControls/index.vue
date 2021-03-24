<template>
    <div class="import-from-database-controls">
        <template v-if="!isFetching">
            <h4 class="header flex-list justify center-v">
                <span v-if="mode == 'Upload'">Upload a file of IDs</span>
                <span v-else-if="mode == 'Browse'">Browse for a product set</span>
                <span v-else-if="mode == 'Scan'">Scan barcodes to add products</span>
                <span v-else-if="mode == 'Search'">Search to add products</span>
                <span v-else>How would you like to get files from the database?</span>
                <button class="ghost pill back-button sm" v-if="!!mode" @click="mode = null">
                    <i class="far fa-arrow-left"></i>
                    <span>Back</span>
                </button>
                <button class="ghost pill back-button sm" v-else @click="onHide">
                    <span>Close</span>
                    <i class="far fa-times"></i>
                </button>
            </h4>

            <!-- BROWSE -->
            <BrowseProductSetSection v-if="mode == 'Browse'" />

            <!-- UPLOAD FILE -->
            <UploadFileSection
                v-if="mode == 'Upload'"
                @submit="fetchProducts"
                :selectedCompany.sync="selectedCompany"
            />

            <BaseDropdownInputField
                class="form-element"
                v-if="['Scan', 'Search'].includes(mode)"
                type="radio"
                innerLabel="Company"
                :search="availableCompanies.length > 5"
                placeholder="Choose company"
                :options="availableCompanies"
                nameKey="name"
                v-model="selectedCompany"
                :resize="false"
            >
                <button class="primary full-width" v-close-popover>
                    <span>Done</span>
                </button>
            </BaseDropdownInputField>

            <!-- SCAN BARCODES -->
            <div v-if="mode == 'Scan'" class="flex-list center-h">
                <i class="fal fa-barcode-read dark xl"></i>
            </div>

            <!-- SEARCH -->
            <BaseInputField
                v-if="mode == 'Search'"
                v-model="searchString"
                placeholder="Id or EAN. Finish with 'ENTER'"
                :focusOnMount="true"
                :selectOnFocus="true"
                v-slot="slotProps"
                @submit="onSubmitSearch"
                @paste.native="onPaste"
            >
                <button class="circle primary sm" @click="slotProps.onSubmit()">
                    <i class="far fa-arrow-right"></i>
                </button>
            </BaseInputField>
            <!-- </div> -->

            <!-- CHOOSE MODE -->
            <div class="flex-list justify choose-mode">
                <button
                    :class="mode == 'Browse' ? 'primary' : 'dark'"
                    @click="mode == 'Browse' ? (mode = null) : (mode = 'Browse')"
                >
                    <i class="far fa-folder"></i>
                    <span>Browse</span>
                </button>
                <button
                    :class="mode == 'Upload' ? 'primary' : 'dark'"
                    @click="mode == 'Upload' ? (mode = null) : (mode = 'Upload')"
                >
                    <i class="far fa-file-import"></i>
                    <span>Upload IDs</span>
                </button>
                <button
                    :class="mode == 'Scan' ? 'primary' : 'dark'"
                    @click="mode == 'Scan' ? (mode = null) : (mode = 'Scan')"
                >
                    <i class="far fa-scanner"></i>
                    <span>Scan Barcodes</span>
                </button>
                <button
                    :class="mode == 'Search' ? 'primary' : 'dark'"
                    @click="mode == 'Search' ? (mode = null) : (mode = 'Search')"
                >
                    <i class="far fa-search"></i>
                    <span>Search</span>
                </button>
            </div>
        </template>
        <BaseLoader v-else :msg="`Searching for product`" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UploadFileSection from './UploadFileSection'
import BrowseProductSetSection from './BrowseProductSetSection'

export default {
    name: 'importFromDatabaseControls',
    components: {
        UploadFileSection,
        BrowseProductSetSection,
    },
    props: ['show'],
    data: function() {
        return {
            mode: null,
            searchString: '',
            scanStarted: false,
            scanStr: '',
            isFetching: false,
            queryValueCount: 0,
            selectedCompany:
                (localStorage.getItem('dkcSelectedCompany') &&
                    JSON.parse(localStorage.getItem('dkcSelectedCompany'))) ||
                null,
        }
    },
    computed: {
        ...mapGetters('integrationDkc', {
            availableCompanies: 'getCompanyMap',
        }),
        ...mapGetters('workspaces', {
            databases: 'getWorkspaceDatabases',
        }),
        ...mapGetters('files', {
            file: 'currentFile',
        }),
        ...mapGetters('products', {
            products: 'products',
        }),
    },
    watch: {
        mode(newVal, oldVal) {
            if (newVal == 'Scan') this.addScanListener()
            if (oldVal == 'Scan') this.removeScanListener()
        },
        selectedCompany(newVal) {
            localStorage.setItem('dkcSelectedCompany', JSON.stringify(newVal))
        },
    },
    methods: {
        ...mapActions('products', ['fetchProductsFromDatabase', 'insertProducts']),
        ...mapActions('integrationDkc', ['fetchProductsById', 'fetchProductsByEAN']),
        ...mapMutations('display', ['HIDE_COMPONENT']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async fetchProducts(queryValues) {
            this.isFetching = true

            const isEAN = this.mode == 'Scan' || (this.mode == 'Search' && queryValues[0].toString().length > 11)

            let products = []
            if (isEAN) {
                products = await this.fetchProductsByEAN({ EANs: queryValues, company: this.selectedCompany })
            } else {
                products = await this.fetchProductsById({ productIds: queryValues, company: this.selectedCompany })
            }

            if (!products) {
                this.isFetching = false
                this.queryValueCount = 0
                return
            }

            // Filter out products that already exist in the file
            const productsFiltered = products.filter(
                product => !this.products.find(x => x.datasource_id == product.datasource_id)
            )
            this.SHOW_SNACKBAR({
                msg: `${queryValues.length} values searched. ${products.length} products found. ${productsFiltered.length} new.`,
                type: 'info',
                iconClass: 'far fa-info-circle',
            })
            if (productsFiltered.length > 0) {
                // Show variants with images first
                productsFiltered.map(product => {
                    product.variants.sort((a, b) => {
                        if (!!a.pictures.find(x => !!x.url) && !b.pictures.find(x => !!x.url)) return -1
                        if (!!b.pictures.find(x => !!x.url) && !a.pictures.find(x => !!x.url)) return 1
                    })
                })

                await this.insertProducts({ file: this.file, products: productsFiltered, addToState: true })
                // SCROLL TO THE BOTTOM OF THE PAGE
                const scrollContainer = document.getElementById('main')
                scrollContainer.scroll(0, scrollContainer.scrollHeight)
            }
            this.isFetching = false
            this.queryValueCount = 0
        },
        onPaste(e) {
            e.preventDefault()
            const clipData = e.clipboardData.getData('text/plain')
            clipData.trim('\r\n')
            const rows = clipData.split('\r\n')
            const allCells = []
            rows.map(row => {
                const cells = row.split('\t').filter(cellValue => !!cellValue)
                allCells.push(...cells)
            })
            const newStr = allCells.join(', ')
            this.searchString = newStr
            // this.onSubmitSearch()
        },
        onSubmitSearch() {
            const stringArray = this.searchString.split(',')
            stringArray.map((str, index) => {
                stringArray[index] = str.trim()
            })
            this.fetchProducts(stringArray)
        },
        addScanListener() {
            document.addEventListener('keydown', this.scanHandler)
        },
        removeScanListener() {
            document.removeEventListener('keydown', this.scanHandler)
        },
        scanHandler(e) {
            // Prevent default to avoid quirky behaviour from carriage or similar
            if (e.code == 'Enter') {
                e.preventDefault()
            }
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
        onHide() {
            this.HIDE_COMPONENT('importFromDatabaseControls')
        },
    },
    destroyed() {
        this.removeScanListener()
        this.onHide()
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
    background: white;
    padding: 16px 40px 20px;
    border-radius: $borderRadiusEl;
    border: $borderEl;
    box-shadow: $shadowEl;
    left: 50%;
    transform: translateX(-50%);
    width: 512px;
    .header {
        margin: 0 0 16px;
    }
    .back-button {
        margin-left: 20px;
        min-width: 68px;
    }
    .choose-mode {
        margin-top: 32px;
    }
}
</style>
