<template>
    <div class="card selected-controller" :class="{ active: selected.length }">
        <div class="inner">
            <span>{{ selected.length }} of {{ totalCount }} selected</span>
            <span
                :class="[{ green: method === 1 }, { ghost: method !== 1 }]"
                class="button icon-right green-hover"
                @click="setMethod(1)"
                >In <i class="far fa-heart"></i
            ></span>
            <span
                :class="[{ red: method === 0 }, { ghost: method !== 0 }]"
                class="button icon-right red-hover"
                @click="setMethod(0)"
                >Out <i class="far fa-times-circle"></i
            ></span>
            <span :class="{ disabled: method === null }" class="button primary wide submit" @click="onSubmitAction()"
                >Choose action</span
            >
        </div>
        <span class="clear-selection" @click="clearSelection">Clear selection</span>
    </div>
</template>

<script>
export default {
    name: 'selectedController',
    props: ['selected', 'totalCount'],
    data: function() {
        return {
            method: null,
        }
    },
    methods: {
        setMethod(method) {
            if (this.method === method) this.method = null
            else this.method = method
        },
        onSubmitAction() {
            this.$emit('onSelectedAction', this.method)
            this.method = ''
        },
        clearSelection() {
            this.$emit('onClearSelection')
        },
    },
}
</script>

<style scoped lang="scss">
.selected-controller {
    position: fixed;
    bottom: 20px;
    left: calc(50% + 100px); //Sidebar width / 2
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
    transform: translateX(-50%) translateY(calc(100% + 20px));
    margin: 0;
    transition: 0.3s;
    background: $light1;
    padding: 28px 32px 20px;
    &.active {
        transform: translateX(-50%) translateY(0);
    }
    .inner > * {
        &:not(:last-child) {
            margin-right: 8px;
        }
        &:first-child {
            display: inline-block;
            font-size: 14px;
            font-weight: 700;
            margin-right: 12px;
        }
    }
}
.clear-selection {
    position: absolute;
    z-index: 1;
    top: 8px;
    color: $red;
    cursor: pointer;
    font-size: 12px;
    &:hover {
        opacity: 0.8;
    }
}
// .button {
//     width: 86px;
//     height: 32px;
//     line-height: 32px;
//     font-size: 12px;
//     border-radius: 4px;
//     padding: 0;
//     line-height: 28px;
//     position: relative;
//     font-weight: 700;
//     padding-right: 22px;
//     // color: $dark;
//     // border-color: white;
//     // background: white;
//     &.submit {
//         width: 155px;
//         background: $green;
//         color: white;
//         border-color: $green;
//         padding: 0;
//         &.disabled {
//             pointer-events: none;
//             opacity: .5;
//         }
//     }
//     i {
//         font-size: 16px;
//         position: absolute;
//         right: 10px;
//         top: 5px;
//         margin: 0;
//     }
//     &.active {
//         i {
//             font-weight: 900;
//         }
//     }
// }
</style>
