<template>
    <div class="content-load-error">
        <i class="far fa-exclamation-triangle lg"></i>
        <h3>{{msg || 'Failed to load content'}}</h3>
        <button v-if="callback" class="ghost lg full-width"
        @click="callback">
            <span>Retry</span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'contentLoadError',
    props: [
        'msg',
        'callback'
    ]
}
</script>

<style scoped lang="scss">

.content-load-error {
    display: flex;
    flex-direction: column;
    align-content: center;
    text-align: center;
    min-height: 200px;
    width: 100%;
    margin: auto;
    max-width: 260px;
    padding: 32px 0;
    padding: 40px 0;
}
</style>