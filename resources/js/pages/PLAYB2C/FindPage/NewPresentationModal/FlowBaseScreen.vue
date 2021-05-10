<template>
    <div class="create-flow-screen flex-list flex-v space-lg center-h">
        <div class="flex-list flex-v center-h space-xs" v-if="header || subHeader">
            <div class="ft-16 ft-bd" v-if="header">
                {{ header }}
            </div>
            <div class="ft-12 ft-md color-grey" v-if="subHeader">
                {{ subHeader }}
            </div>
        </div>
        <div class="main">
            <slot />
        </div>
        <div class="navigation">
            <BaseButton @click="$emit('back')">
                <span>{{ backText ? backText : 'Back' }}</span>
            </BaseButton>
            <BaseButton @click="$emit('next')" :disabled="nextDisabled" :disabledTooltip="nextDisabled">
                <span>{{ nextText ? nextText : 'Next' }}</span>
            </BaseButton>
        </div>
    </div>
</template>

<script>
export default {
    name: 'flowBaseScreen',
    props: ['backText', 'nextText', 'nextDisabled', 'subHeader', 'header'],
}
</script>

<style lang="scss" scoped>
.main {
    width: 512px;
}
</style>
