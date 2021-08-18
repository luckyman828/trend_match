<template>
    <div
        class="presentation-card"
        :style="{ backgroundImage: presentation.thumbnail && `url(${presentation.thumbnail})` }"
        @contextmenu.prevent="$emit('contextmenu', $event)"
    >
        <div class="inner flex-list flex-v min justify">
            <div class="top-items flex-list justify">
                <div class="left-items">
                    <div
                        v-if="presentation.uploadChannel"
                        class="square xs"
                        :class="presentation.uploadChannel.progress.status == 'Available' ? 'secondary' : 'primary'"
                    >
                        <span>{{ presentation.uploadChannel.progress.status.toUpperCase() }}</span>
                    </div>
                    <div class="yellow square xs" v-else-if="presentation.video_count <= 0">
                        <span>NEW</span>
                    </div>
                </div>
                <div class="right-items">
                    <!-- <div class="dark pill xs">
                        <i class="fas fa-tshirt"></i>
                        <span>45</span>
                    </div> -->
                    <div class="dark pill xs" v-if="isUploading">
                        <i class="fas fa-upload"></i>
                        <span>{{ uploadPercentage }}</span>
                    </div>
                </div>
            </div>
            <div class="bottom-items flex-list space-lg flex-v">
                <div class="name">
                    <span v-if="!editName">{{ presentation.name }}</span>
                    <BaseTextarea
                        @click.native.stop
                        v-else
                        v-model="presentation.name"
                        ref="nameInput"
                        :inheritStyles="true"
                        @blur="editName = false"
                        @submit="
                            updatePresentationDetails(presentation)
                            editName = false
                        "
                    />
                </div>
                <div class="flex-list flex-end-h action-list">
                    <button class="white pill">
                        <i class="far fa-edit"></i>
                        <span>Edit presentation</span>
                    </button>
                    <button class="circle white" @click.stop="$emit('contextmenu', $event)">
                        <i class="far fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'presentationCard',
    props: ['presentation'],
    data() {
        return {
            editName: false,
        }
    },
    computed: {
        isUploading() {
            return this.presentation.uploadChannel && this.presentation.uploadChannel.progress.status == 'Uploading'
        },
        uploadPercentage() {
            const uploadChannel = this.presentation.uploadChannel
            if (!uploadChannel) return
            return uploadChannel.progress.progressPercentage
        },
    },
    methods: {
        ...mapActions('playPresentations', ['updatePresentationDetails']),
        rename() {
            this.editName = true
            this.$nextTick(() => {
                this.$refs.nameInput.focus()
                this.$refs.nameInput.select()
            })
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.presentation-card {
    // width: 288px;
    // height: 208px;
    // max-width: 398px;
    // max-height: 398px;
    overflow: hidden;
    border-radius: 8px;
    padding: 16px;
    background-color: white;
    background-size: cover;
    background-position: center;
    transition: 0.1s ease-out;
    cursor: pointer;
    .inner {
        height: 100%;
        width: 100%;
        position: relative;
        z-index: 1;
    }
    &.disabled {
        background-color: $bluegrey400;
        cursor: default;
    }
    &:not(.disabled) {
        &:hover {
            box-shadow: 0 3px 6px 0 rgba(117, 134, 156, 0.5);
            transform: translateY(-4px);
            .action-list {
                opacity: 1;
            }
        }
    }
    &::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: rgba(black, 0.4);
    }
    .name {
        font-size: 28px;
        font-weight: 800;
        color: white;
        max-width: 80%;
        white-space: pre-wrap;
    }
    .action-list {
        opacity: 0.8;
    }
}
</style>
