<template>
    <div class="flyin-header">
        <div class="left">
            <button class="circle close" @click="$emit('closeFlyin');$emit('close')"><i class="fal fa-times"></i></button>
            <slot name="left"/>
        </div>
        <div class="right">
            <slot name="right"/>
            <BaseFlyinHeaderNavigation v-if="!disableNavigation" :next="next" :prev="prev" @prev="$emit('prev')" @next="$emit('next')"/>
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
        background: $bgContent;
        display: flex;
        width: 100%;
        justify-content: space-between;
        // align-items: center;
        box-shadow: 0px 2px 10px #0000001A;
        padding: 16px;
        border-bottom: solid 2px $grey2;
        // position: relative;
        // z-index: 1;
        h3 {
            margin: 0;
        }
        .left, .right {
            display: flex;
            align-items: center;
            .item-group {
                display: flex;
                // align-items: center;
                > *:not(:last-child) {
                    margin-right: 8px;
                }
                &:not(:first-child) {
                    margin-left: 16px;
                }
            }
        }
        .close {
            margin-right: 32px;
        }
    }
</style>