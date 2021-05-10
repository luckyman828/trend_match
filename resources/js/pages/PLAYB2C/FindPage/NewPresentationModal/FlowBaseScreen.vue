<template>
    <div class="create-flow-screen">
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
    props: ['backText', 'nextText', 'nextDisabled'],
}
</script>

<style></style>
