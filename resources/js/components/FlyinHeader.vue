<template>
    <div class="flyin-header">
        <div class="left">
            <span class="circle light-2 close" @click="$emit('closeFlyin')"><i class="fal fa-times"></i></span>
            <h3>{{title}}</h3>
        </div>
        <div class="right">
            <slot/>
            <FlyinHeaderNavigation v-if="!disableNavigation" :next="next" :prev="prev" @prev="$emit('prev')" @next="$emit('next')"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'flyinHeader',
    props: [
        'title',
        'next',
        'prev',
        'disableNavigation'
    ]
}
</script>

<style lang="scss">
@import '~@/_variables.scss';

    .flyin-header {
        height: 74px;
        background: $light1;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0px 2px 10px #0000001A;
        padding: 16px;
        border-bottom: solid 2px $grey2;
        .left, .right {
            display: flex;
            align-items: center;
            .item-group {
                display: flex;
                align-items: center;
            }
        }
        .close {
            margin-right: 32px;
        }
        .navigation {
            margin-left: 32px;
            display: flex;
            > *:first-child {
                margin-right: 8px;
            }
            i {
                font-size: 16px;
            }
        }
    }
</style>