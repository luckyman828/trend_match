<template>
    <div class="flyin-header">
        <div class="left">
            <button v-if="!placement || placement== 'right'" class="circle close md" 
            @click="$emit('closeFlyin');$emit('close')">
                <i class="far fa-times"></i>
            </button>
            <slot name="left"/>
        </div>
        <div class="right">
            <slot name="right"/>
            <BaseFlyinHeaderNavigation v-if="!disableNavigation" :next="next" :prev="prev" @prev="$emit('prev')" @next="$emit('next')"/>
            <button v-if="placement == 'left'" class="circle close md" 
            @click="$emit('closeFlyin');$emit('close')">
                <i class="far fa-times"></i>
            </button>
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
        'disableNavigation',
        'placement',
    ]
}
</script>

<style lang="scss">
@import '~@/_variables.scss';

    .flyin-header {
        height: 60px;
        background: $bgContent;
        display: flex;
        width: 100%;
        justify-content: space-between;
        // align-items: center;
        padding: 16px;
        // box-shadow: 0px 2px 10px #0000001A;
        // border-bottom: solid 2px $grey2;
        border-bottom: $borderModule;
        box-shadow: $shadowModule;
        // position: relative;
        // z-index: 1;
        h3 {
            margin: 0;
            @media screen and (max-width: $screenXs) {
                font-size: 14px;
            }
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
        .left {
            .close {
                margin-right: 16px;
            }
        }
        .right {
            .close {
                margin-left: 16px;
            }
        }
    }
</style>