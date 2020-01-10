<template>
    <tr class="table-top-bar">
        <div class="left">
            <slot name="left"></slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </tr>
</template>

<script>
export default {
    name: 'tableTopBar'
}
</script>

<style lang="scss" scoped>

    .table-top-bar {
        height: 48px;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0;
        .left, .right {
            display: flex;
            align-items: center;
        }
        .left {
            > * {
                margin-right: 16px;
            }
        }
        .right {
            > * {
                margin-left: 16px;
            }
        }
    }

</style>