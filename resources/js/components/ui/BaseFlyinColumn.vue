<template>
    <div class="fly-in-column">
        <div class="header" v-if="$slots.header != null">
            <slot name="header"/>
        </div>
        <div class="body">
            <slot/>
        </div>
    </div>
</template>

<script>

export default {
    name: 'baseFlyinColumn',
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .fly-in-column {
        &:not(:last-child) {
            border-right: solid 2px $divider;
        }
        .header {
            height: 60px;
            padding: 8px 16px;
            border-bottom: solid 2px $divider;
            background: white;
        }
        .body {
            padding: 16px;
        }
    }
</style>
