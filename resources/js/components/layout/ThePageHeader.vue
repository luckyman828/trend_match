<template>
    <div class="page-header">
        <div class="left">
            <h1>{{ title }}</h1>
        </div>
        <div class="right"></div>
    </div>
</template>

<script>
export default {
    name: 'thePageHeader',
    props: ['title'],
}
</script>

<style lang="scss" scoped>
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding-bottom: 16px;
    // margin-bottom: 16px;
    // border-bottom: solid 2px $light2;
    > div {
        display: flex;
        align-items: center;
    }
    h1 {
        display: inline-block;
        // margin: 0;
        margin-right: 12px;
    }
    .stat {
        margin-left: 24px;
    }
    .title {
        display: block;
        text-align: left;
        font-size: 12px;
        font-weight: 700;
        color: $dark2;
    }
}
</style>
