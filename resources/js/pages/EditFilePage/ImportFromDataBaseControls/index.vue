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

            <!-- SEASON -->
            <BaseInputField
                class="form-element"
                innerLabel="Season"
                v-model="selectedSeason"
                placeholder="Enter Season Code"
            />

            <!-- LABELS -->
            <BaseDropdownInputField
                class="form-element"
                innerLabel="Labels to add"
                placeholder="(Optional) Select labels to add"
                :options="availableLabels"
                v-model="selectedLabels"
                :resize="false"
            >
                <button class="primary full-width" v-close-popover>
                    <span>Done</span>
                </button>
            </BaseDropdownInputField>

            <!-- SCAN BARCODES -->
            <div v-if="mode == 'Scan'" class="flex-list center-h flex-v space-md">
                <i class="fal fa-barcode-read dark xl"></i>
                <div class="scan-log-wrapper">
                    <div class="ft-bd ft-12">Scan Log</div>
                    <div class="scan-log flex-list flex-v">
                        <div
                            class="scan-log-item flex-list center-v lh-sm"
                            v-for="(logItem, index) in scanLog"
                            :key="index"
                        >
                            <i
                                class="far"
                                :class="
                                    logItem.type == 'success'
                                        ? 'green fa-check-circle'
                                        : logItem.type == 'error'
                                        ? 'red fa-exclamation-triangle'
                                        : 'fa-info-circle'
                                "
                            />
                            <span class="msg" v-html="logItem.msg"></span>
                        </div>
                    </div>
                </div>
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
            selectedSeason:
                (localStorage.getItem('dkcSelectedSeason') && JSON.parse(localStorage.getItem('dkcSelectedSeason'))) ||
                null,
            selectedLabels: [],
            scanLog: [],
        }
    },
    computed: {
        ...mapGetters('integrationDkc', {
            availableCompanies: 'getCompanyMap',
        }),
        ...mapGetters('workspaces', {
            databases: 'getWorkspaceDatabases',
            availableLabels: 'getAvailableProductLabels',
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
        selectedSeason(newVal) {
            localStorage.setItem('dkcSelectedSeason', JSON.stringify(newVal))
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
                products = await this.fetchProductsByEAN({
                    EANs: queryValues,
                    company: this.selectedCompany,
                    season: this.selectedSeason,
                })
            } else {
                products = await this.fetchProductsById({
                    productIds: queryValues,
                    company: this.selectedCompany,
                    season: this.selectedSeason,
                })
            }

            if (!products || products.length == 0) {
                this.isFetching = false
                this.queryValueCount = 0
                this.scanLog.push({
                    type: 'error',
                    msg: `Product with ${isEAN ? 'EAN' : 'ID'}: <strong>${queryValues.join(',')}</strong> not found.`,
                })
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
                // Find delivery dates on our non-NOOS styles
                const seasonDeliveries = []
                const allProducts = this.products
                allProducts.map(product => {
                    if (product.delivery_dates.length >= 12) return
                    product.delivery_dates.map(deliveryDate => {
                        if (!seasonDeliveries.includes(deliveryDate)) seasonDeliveries.push(deliveryDate)
                    })
                })

                // Process the fetched products
                products.map(product => {
                    // Fix delivery dates for NOOS and RERUN styles
                    if (product.delivery_dates.length >= 12) {
                        product.delivery_dates = seasonDeliveries
                        product.variants.map(variant => {
                            variant.delivery_dates = seasonDeliveries
                        })
                    }

                    // Show variants with images first
                    product.variants.sort((a, b) => {
                        if (!!a.pictures.find(x => !!x.url) && !b.pictures.find(x => !!x.url)) return -1
                        if (!!b.pictures.find(x => !!x.url) && !a.pictures.find(x => !!x.url)) return 1
                    })

                    // Add selected labels if any
                    product.labels = this.selectedLabels
                    product.variants.map(variant => {
                        variant.labels = this.selectedLabels
                    })
                })

                await this.insertProducts({ file: this.file, products: productsFiltered, addToState: true })
                // SCROLL TO THE BOTTOM OF THE PAGE
                const scrollContainer = document.getElementById('main')
                scrollContainer.scroll(0, scrollContainer.scrollHeight)

                this.scanLog.push({
                    type: 'success',
                    msg: `Product with ${isEAN ? 'EAN' : 'ID'}: <strong>${queryValues.join(',')}</strong> added.`,
                })
            } else {
                // If products already exists
                this.scanLog.push({
                    type: 'info',
                    msg: `Product with ${isEAN ? 'EAN' : 'ID'}: <strong>${queryValues.join(
                        ','
                    )}</strong> ignored. It already exists in file.`,
                })
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
    .scan-log-wrapper {
        width: 100%;
        .scan-log {
            width: 100%;
            height: 200px;
            border-radius: $borderRadiusEl;
            border: $borderEl;
            background: $bg;
            padding: 8px 12px;
            max-height: 200px;
            overflow-y: auto;
        }
    }
}
</style>
