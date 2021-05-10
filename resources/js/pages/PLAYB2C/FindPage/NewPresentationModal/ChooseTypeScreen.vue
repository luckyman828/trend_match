<template>
    <div class="choose-type-screen flex-list flex-v center-h space-lg">
        <div class="flex-list flex-v center-h space-xs">
            <div class="ft-16 ft-bd">
                Add new presentation
            </div>
            <div class="ft-12 ft-md color-grey">
                Choose how you want to present you styles
            </div>
        </div>

        <div class="flex-list full-width equal-width space-md">
            <div class="button-card" @click="$emit('next', 'video')">
                <div class="inner flex-list flex-v center-h center-v space-md">
                    <div class="white xxl true-square">
                        <i class="fas fa-upload primary"></i>
                    </div>
                    <div class="label ft-16 ft-md">
                        Upload video
                    </div>
                    <BaseButton buttonClass="pill dark">
                        <span>Upload video</span>
                    </BaseButton>
                </div>
            </div>

            <div class="button-card disabled" @click="!true && $emit('next', 'livestream')">
                <div class="label-list">
                    <div class="secondary square xs">
                        <span>COMING SOON</span>
                    </div>
                </div>
                <div class="inner flex-list flex-v center-h center-v space-md">
                    <div class="white xxl true-square">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="label ft-16 ft-md">
                        Livestream
                    </div>
                    <BaseButton buttonClass="pill dark" :disabled="true">
                        <span>Not available</span>
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'chooseTypeScreen',
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.button-card {
    cursor: pointer;
    width: 248px;
    height: 248px;
    padding: 32px;
    position: relative;
    border: $borderEl;
    border-radius: $borderRadiusEl;
    background: white;
    transition: 0.2s;
    &:hover {
        background: $bgWhiteHover;
    }
    &:active {
        background: $bgWhiteActive;
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
