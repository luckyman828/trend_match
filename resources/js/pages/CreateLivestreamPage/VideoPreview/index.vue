<template>
    <div class="video-preview" :class="{ 'drag-active': isDragging }">
        <form class="url-input" @submit.prevent v-if="!playerReady || editModeActive">
            <div class="container">
                <h3>Enter the URL osssf your video to get started</h3>
                <div class="form-element">
                    <label for="url-input">Video URL</label>
                    <BaseInputField
                        id="url-input"
                        v-model="videoUrl"
                        placeholder="Your video URL"
                        :focusOnMount="true"
                        @submit="onSetVideoByURL"
                    />
                    <p class="example">Example: https://vimeo.com/123456789</p>
                </div>

                <div class="form-element">
                    <label
                        >Selection to present from
                        <!-- <i
                            class="far fa-info-circle"
                            v-tooltip="
                                'You will be able to see the feedback and comments that are visible to this selection'
                            "
                        ></i
                        > -->
                    </label>
                    <BaseDropdownInputField
                        :options="availableSelections"
                        type="radio"
                        placeholder="Choose selection to present from"
                        v-model="selectionToPresentFrom"
                        @input="onNewSelectionToPresentFrom"
                    >
                    </BaseDropdownInputField>
                </div>

                <div class="form-element available-selection-list" v-if="selectionToPresentFrom">
                    <h4>Choose selections to present for:</h4>
                    <div class="selections-to-present">
                        <BaseSelectButton
                            v-for="theSelection in availableSelections"
                            :key="theSelection.id"
                            :modelValue="theSelection"
                            v-model="selectionsToPresent"
                            :disabled="
                                theSelection.id == selectionToPresentFrom.id ||
                                    ((theSelection.type == 'Chapter' || !!theSelection.parent_chapter) &&
                                        selectionsToPresent.find(
                                            x =>
                                                (x.type == 'Chapter' || !!x.parent_chapter) &&
                                                x.product_set_identifier != theSelection.product_set_identifier
                                        ))
                            "
                            :disabledTooltip="
                                theSelection.id == selectionToPresentFrom.id
                                    ? `You can't de-select the presentation you present from`
                                    : 'Selection belongs to different chapter.'
                            "
                        >
                            <i
                                class="far fa-presentation primary"
                                v-if="theSelection.is_presenting"
                                v-tooltip="'In presentation'"
                            ></i>
                            <SelectionChapterPill class="chapter-pill" :selection="theSelection" />
                            <SelectionIcon class="selection-icon" :selection="theSelection" />
                            <span>{{ theSelection.name }}</span>
                        </BaseSelectButton>
                    </div>
                </div>

                <button
                    class="primary full-width lg"
                    @click="onSetVideoByURL"
                    :disabled="submitDisabled"
                    disabledTooltip="Please enter a valid URL"
                >
                    <span>Go LIVE</span>
                </button>
                <div class="controls" v-if="playerReady">
                    <button v-tooltip="'Cancel'" @click="editModeActive = false">
                        <i class="far fa-times"></i>
                    </button>
                </div>
            </div>
        </form>
        <div class="video-controls" v-if="playerReady">
            <button class="white" @click="editModeActive = !editModeActive">
                <template v-if="!editModeActive">
                    <i class="far fa-pen"></i>
                    <span>Change video</span>
                </template>
                <template v-else>
                    <i class="far fa-times"></i>
                    <span>Cancel</span>
                </template>
            </button>
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
                <strong>Any existing video presentation on the file will be DELETED.</strong>
            </p>
            <p>
                All sub-selections will enter presentation mode.
            </p>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SelectionIcon from '../../../components/common/SelectionIcon'
import SelectionChapterPill from '../../../components/common/SelectionChapterPill'

export default {
    name: 'videoPreview',
    components: {
        SelectionIcon,
        SelectionChapterPill,
    },
    data: function() {
        return {
            videoUrl: '',
            editModeActive: true,
            selectionToPresentFrom: null,
            selectionsToPresent: [],
        }
    },
    computed: {
        ...mapGetters('files', {
            file: 'currentFile',
        }),
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
        }),
        ...mapGetters('products', {
            allProducts: ['getProducts'],
        }),
        ...mapGetters('videoPlayer', {
            isDragging: 'getTimelineKnobIsBeingDragged',
            provider: 'getProvider',
            videoId: 'getProviderVideoId',
        }),
        ...mapGetters('selections', {
            selections: 'getSelections',
            availableSelections: 'getSelectionsAvailableForPresentation',
        }),
        ...mapGetters('products', {
            allProducts: ['getProducts'],
        }),
        playerReady() {
            return this.provider && this.videoId
        },
        submitDisabled() {
            return this.videoUrl.length < 5 || !this.selectionToPresentFrom
        },
    },
    methods: {
        ...mapActions('selectionProducts', ['fetchSelectionProducts']),
        ...mapActions('selections', ['startPresentation']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        ...mapActions('videoPresentation', ['setVideoByURL', 'updateCurrentVideo']),
        ...mapMutations('videoPresentation', ['SET_VIDEO_TIMINGS']),
        async onSetVideoByURL() {
            if (await this.$refs.confirmGoLiveDialog.confirm()) {
                // Start a presentation with all the selections of the file
                await this.startPresentation({ selections: this.selectionsToPresent })
                if (
                    !this.allProducts[0].selectionInputList.find(x => x.selection_id == this.selectionToPresentFrom.id)
                ) {
                    await this.fetchSelectionProducts(this.selectionToPresentFrom)
                }
                this.SET_CURRENT_SELECTIONS([this.selectionToPresentFrom])

                this.editModeActive = false
                await this.setVideoByURL({ file: this.file, url: this.videoUrl })
                this.editModeActive = false
                setTimeout(() => {
                    this.editModeActive = false
                }, 1000)
            }
        },
        onNewSelectionToPresentFrom(selection) {
            // Reset the selections to present
            this.selectionsToPresent = [selection]
            // Preset the selection and its descendants
            const hasChapters = this.availableSelections.find(x => x.type == 'Chapter')
            if (!(hasChapters && selection.type == 'Master')) {
                // Pre-select the selection and all descendants
                this.presetSelectionAndDescendants(selection)
            }
        },
        presetSelectionAndDescendants(selection) {
            const existsInArray = this.selectionsToPresent.find(x => x.id == selection.id)
            if (!existsInArray) {
                // Find the selection in the available selections list
                const selectionToPush = this.availableSelections.find(x => x.id == selection.id)
                if (selectionToPush) {
                    this.selectionsToPresent.push(selectionToPush)
                }
            }

            selection.children.map(child => {
                this.presetSelectionAndDescendants(child)
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.video-preview {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    &.drag-active {
        cursor: grabbing;
    }
    .video-controls {
        position: absolute;
        right: 8px;
        top: 8px;
        opacity: 0;
        z-index: 3;
        pointer-events: all;
        .player-overlay:hover & {
            opacity: 1;
        }
    }
    .form-element {
        width: 100%;
    }
}
.url-input {
    background: white;
    height: 100%;
    pointer-events: all;
    .container {
        margin: auto;
        height: 100%;
        max-width: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .controls {
        position: absolute;
        right: 8px;
        top: 8px;
    }
    .input-field {
        width: 100%;
    }
    .example {
        margin-top: 4px;
        color: $fontSoft;
        font-size: 12px;
        margin-bottom: -8px;
    }
    .available-selection-list {
        h4 {
            margin: 4px 0;
        }
    }
    .selections-to-present {
        max-height: 200px;
        overflow-y: auto;
        background: $bg;
        border-radius: $borderRadiusEl;
        border: $borderEl;
        max-height: 200px;
        overflow-y: auto;
    }
    .selection-icon {
        margin-left: 8px;
    }
}
</style>
