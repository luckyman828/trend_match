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
            <button class="ghost primary" @click="onGoLive">
                <i class="far fa-presentation"></i>
                <span>Start new LIVE presentation</span>
            </button>
            <div class="pill ghost sm" :class="[status]">
                <i class="far" :class="statusIconClasss"></i>
                <span>{{ statusText }}</span>
            </div>
        </div>

        <BaseDialog
            ref="confirmGoLiveDialog"
            type="confirm"
            confirmColor="primary"
            confirmText="Yes, go live!"
            cancelText="No, i'm not ready yet"
        >
            <div class="icon-graphic">
                <i class="lg primary far fa-file"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-presentation"></i>
            </div>
            <h3>Really go live?</h3>
            <p>
                <strong
                    >The current video presentation will be DELETED, and all sub-selections will enter presentation
                    mode.</strong
                >
            </p>
        </BaseDialog>
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'editVideoPresentationNavbar',
    components: {},
    data: function() {
        return {
            currentStatus: this.status,
            statusUpdateTimeout: null,
        }
    },
    computed: {
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('videoPresentation', {
            status: 'getStatus',
        }),
        statusIconClasss() {
            if (this.currentStatus == 'success') return 'fa-check-circle green'
            if (this.currentStatus == 'error') return 'fa-exclamation-circle red'
            if (this.currentStatus == 'saving') return 'fa-save primary'
        },
        statusText() {
            if (this.currentStatus == 'success') return 'All changes saved'
            if (this.currentStatus == 'error') return 'Error saving!'
            if (this.currentStatus == 'saving') return 'Saving..'
        },
    },
    watch: {
        status(newVal) {
            // Make sure we show that we are saving for a little while to affirm the user
            const delay = 500
            if (newVal == 'saving') this.currentStatus = newVal
            else {
                if (this.statusUpdateTimeout) {
                    clearTimeout(this.statusUpdateTimeout)
                }
                this.statusUpdateTimeout = setTimeout(() => {
                    this.currentStatus = newVal
                }, delay)
            }
        },
    },
    methods: {
        ...mapActions('selections', ['fetchSelections', 'startPresentation']),
        async onGoLive() {
            this.$router.push({ name: 'createLivestream', params: { fileId: this.currentFile.id } })
            // if (await this.$refs.confirmGoLiveDialog.confirm()) {
            //     // Start a presentation with all the selections of the file
            //     // Get file selections
            //     const selections = await this.fetchSelections({ fileId: this.currentFile.id })
            //     await this.startPresentation({ selections })
            //     this.$router.push({ name: 'createLivestream', params: { fileId: this.currentFile.id } })
            // }
        },
    },
    created() {
        this.currentStatus = this.status
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
