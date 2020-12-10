<template>
    <BaseModal :show="show" @close="$emit('close')" classes="sm">
        <h3>Choose selection to copy link from</h3>
        <div class="selection-list flex-list flex-v xs">
            <div
                class="selection-list-item flex-list justify center-v"
                v-for="selection in availableSelections"
                :key="selection.id"
                @click="onCopySelectionLink(selection)"
            >
                <span class="name">{{ selection.name }}</span>
                <button class="primary sm" v-if="!fetchingFrom.includes(selection.id)">
                    <i class="far fa-link"></i>
                    <span>Copy link</span>
                </button>
                <BaseLoader v-else />
            </div>
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'copyLinkModal',
    props: ['show'],
    data: function() {
        return {
            fetchingFrom: [],
        }
    },
    computed: {
        ...mapGetters('selections', {
            availableSelections: 'getSelectionsAvailableForPresentation',
        }),
    },
    methods: {
        ...mapActions('selections', ['getSelectionLink']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async onCopySelectionLink(selection) {
            this.fetchingFrom.push(selection.id)
            const link = await this.getSelectionLink(selection.id)
            this.copyToClipboard(link)
            this.SHOW_SNACKBAR({
                msg: 'Link copied',
                iconClass: 'fa-clipboard-check',
                type: 'success',
            })
            const index = this.fetchingFrom.findIndex(x => x == selection.id)
            this.fetchingFrom.splice(index, 1)
        },
        init() {
            // Check if we have already fetched selections
            // console.log('available selections', this.availableSelections)
            if (this.availableSelections.length >= 0) return
        },
    },
    created() {
        this.init()
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.selection-list {
    padding: 4px;
    border: $borderEl;
    border-radius: $borderRadiusEl;
    .selection-list-item {
        padding: 8px 12px;
        border-radius: 4px;
        font-weight: 500;
        cursor: copy;
        &:hover {
            background: $bgContentAlt;
        }
    }
    .loader {
        height: 24px;
    }
}
</style>
