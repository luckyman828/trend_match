<template>
    <FlowBaseScreen
        class="choose-type-screen"
        :hideNavigation="true"
        header="Create presentation"
        subHeader="Choose presentation type"
    >
        <div class="flex-list full-width equal-width space-md">
            <div class="button-card" @click="$emit('next', 'video')">
                <div class="inner flex-list flex-v center-h center-v space-lg">
                    <img src="images/svg/undraw_Upload_re_pasx.svg" />

                    <div class="flex-list flex-v space-sm center-h">
                        <div class="label ft-16 ft-md">
                            Upload a video
                        </div>
                        <div class="description ft-12">
                            Add styles to a video
                        </div>
                    </div>
                    <BaseButton buttonClass="pill dark">
                        <span>Upload video</span>
                    </BaseButton>
                </div>
            </div>

            <div class="button-card disabled" @click="!true && $emit('next', 'livestream')">
                <div class="label-list">
                    <div class="primary square xs">
                        <span>COMING SOON</span>
                    </div>
                </div>
                <div class="inner flex-list flex-v center-h center-v space-lg">
                    <img src="images/svg/undraw_fashion_photoshoot_mtq8.svg" />
                    <div class="flex-list flex-v space-sm center-h">
                        <div class="label ft-16 ft-md">
                            Livestream
                        </div>
                        <div class="description ft-12">
                            Go live now, or plan for later
                        </div>
                    </div>
                    <BaseButton buttonClass="pill dark" :disabled="true">
                        <span>Not available</span>
                    </BaseButton>
                </div>
            </div>
        </div>
    </FlowBaseScreen>
</template>

<script>
import FlowBaseScreen from './FlowBaseScreen'

export default {
    name: 'chooseTypeScreen',
    components: { FlowBaseScreen },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.button-card {
    cursor: pointer;
    // width: 248px;
    // min-height: 248px;
    padding: 16px 32px 48px;
    position: relative;
    border: $borderEl;
    border-radius: $borderRadiusEl;
    background: white;
    transition: 0.2s;
    height: 328px;
    &:hover {
        background: $bgWhiteHover;
    }
    &:active {
        background: $bgWhiteActive;
    }
    img {
        height: 92px;
        width: 92px;
        object-fit: contain;
    }
    .label-list {
        position: absolute;
        top: 12px;
        left: 12px;
    }
    .inner {
        width: 100%;
        height: 100%;
    }
    &.disabled {
        .inner {
            opacity: 0.5;
            cursor: default;
        }
    }
}
</style>
