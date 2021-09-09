<template>
    <div class="navbar-file flex-wrapper">
        <div class="items-left">
            <router-link
                class="button primary pill ghost"
                style="margin-right: 8px;"
                :to="{ name: 'files', params: { fileId: currentFile.id, folderId: currentFile.parent_id } }"
            >
                <i class="fas fa-arrow-left"></i>
                <span>Back to files</span>
            </router-link>

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

        <div class="items-right">
            <button class="ghost" @click="showCopyLinkModal = true">
                <i class="far fa-link"></i>
                <span>Copy link</span>
            </button>
            <button class="ghost red" @click="onEndLivestream">
                <span>End livestream</span>
            </button>
            <button class="ghost" @click="toggleScanner">
                <i class="far fa-search"></i>
                <span v-if="scanModeActive">Deactivate scanner</span>
                <span v-else>Activate scanner</span>
            </button>
            <!-- <SelectionSelector />
            <SelectionPresenterModeButton :selection="currentSelection" /> -->
        </div>

        <CopyLinkModal :show="showCopyLinkModal" @close="showCopyLinkModal = false" />
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SelectionPresenterModeButton from '../../components/SelectionPresenterModeButton'
import SelectionSelector from './SelectionSelector'
import CopyLinkModal from './CopyLinkModal'

export default {
    name: 'livestreamPageNavbar',
    components: {
        SelectionPresenterModeButton,
        SelectionSelector,
        CopyLinkModal,
    },
    data: function() {
        return {
            scanModeActive: false,
            showCopyLinkModal: false,
        }
    },
    computed: {
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', ['currentSelection']),
        ...mapGetters('products', ['products']),
        ...mapGetters('videoPlayer', {
            videoDuration: 'getDuration',
        }),
        ...mapGetters('presentation', {
            presentationId: 'getCurrentPresentationId',
        }),
    },
    methods: {
        ...mapActions('videoPresentation', ['addTiming']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        ...mapActions('presentation', ['broadcastProduct']),
        ...mapActions('selections', ['stopPresentation']),
        toggleScanner() {
            if (!this.scanModeActive) {
                // Hook up event listeners for scans
                document.addEventListener('keyup', this.scanHandler)
            } else {
                // Clean up event listeners
                document.removeEventListener('keyup', this.scanHandler)
            }
            this.scanModeActive = !this.scanModeActive
        },
        scanHandler(e) {
            // Check if we get at least 12 concecutive inputs with very small interval
            this.scanStr += e.code.substr(e.code.length - 1)
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
            const succesAudio = new Audio('/assets/SFX/pling.mp3')
            const failAudio = new Audio('/assets/SFX/error.mp3')

            // Find the matched product / variant
            const product = this.products.find(product => product.eans.includes(scanCode))
            if (!product) {
                failAudio.play()
                this.SHOW_SNACKBAR({
                    msg: `Scan didn't match any products`,
                    type: 'info',
                    iconClass: 'fa-exclamation-circle',
                })
                return
            }

            this.onAddTiming(product)
            succesAudio.play()
        },
        async onAddTiming(product) {
            const newStart = Math.round(this.videoDuration)
            this.onStopCurrent(newStart)
            const newTiming = {
                start_at_ms: newStart,
                end_at_ms: Math.ceil(this.videoDuration + 5),
                variants: [product.variants[0]],
            }
            await this.addTiming({ newTiming })
            this.broadcastProduct({ product })
        },
        onStopCurrent(newEnd) {
            if (this.currentTiming) {
                this.currentTiming.end_at_ms = newEnd ? newEnd - 1 : Math.ceil(this.videoDuration - 1)
            }
        },
        async onEndLivestream() {
            console.log('end the livestream maybe', this.presentationId)
            if (this.presentationId) {
                // End the current presentation
                await this.stopPresentation({ presentationId: this.presentationId })
            }
            this.$router.push({ name: 'files' })
        },
    },
    destroyed() {
        // Clean up event listeners
        document.removeEventListener('keyup', this.scanHandler)
    },
}
</script>

<style lang="scss" scoped>
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
