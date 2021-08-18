<template>
    <div class="create-flow-screen">
        <div class="header ft-14 ft-bd" v-if="header">
            {{ header }}
        </div>
        <div class="sub-header ft-20 ft-bd" v-if="subHeader">
            {{ subHeader }}
        </div>
        <div class="main">
            <slot />
        </div>
        <div class="navigation flex-list flex-end-h" v-if="!hideBack || !hideNext">
            <BaseButton class="back-button" buttonClass="circle" @click="$emit('back')" v-if="!hideBack">
                <i class="far fa-arrow-left"></i>
            </BaseButton>
            <BaseButton
                v-if="!hideNext"
                buttonClass="pill lg dark"
                :disabled="nextDisabled"
                :disabledTooltip="nextDisabled"
                @click="$emit('next')"
            >
                <span>{{ nextText ? nextText : 'Next' }}</span>
                <i class="far fa-arrow-right"></i>
            </BaseButton>
        </div>
    </div>
</template>

<script>
export default {
    name: 'flowBaseScreen',
    props: ['backText', 'nextText', 'nextDisabled', 'subHeader', 'header', 'hideBack', 'hideNext'],
}
</script>

<style lang="scss" scoped>
.header {
    margin-top: -12px;
    margin-bottom: 40px;
    line-height: 1;
    text-align: center;
}
.sub-header {
    margin-bottom: 16px;
    line-height: 1;
}
.main {
    width: 578px;
}
.back-button {
    position: absolute;
    left: 16px;
    top: 10px;
}
.navigation {
    margin-top: 48px;
}
</style>
