<template>
    <div class="flyin-header">
        <div class="left">
            <span class="circle light-2 close" @click="onClose"><i class="fal fa-times"></i></span>
            <h3>{{title}}</h3>
        </div>
        <div class="right">
            <slot/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'flyinHeader',
    props: [
        'title'
    ],
    methods: {
        onClose() {
            this.$emit('closeFlyin')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .flyin-header {
        height: 72px;
        background: $light1;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0px 2px 10px #0000001A;
        padding: 16px;
        .left, .right {
            display: flex;
            align-items: center;
        }
        .close {
            margin-right: 32px;
        }
    }
</style>