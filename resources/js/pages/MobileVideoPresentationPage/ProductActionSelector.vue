<template>
    <div class="product-action-selector" v-if="product">
        <button @click="showActionList = !showActionList" :class="buttonClass">
            <i class="far" :class="iconClass" v-if="product.yourAction != 'None'"></i>
            <span>{{ product.yourAction }}</span>
        </button>
        <div class="available-action-list flex-list flex-v" :class="{ show: showActionList }">
            <button class="primary" @click="onSetAction('Focus')">
                <i class="far fa-star"></i>
                <span>Focus</span>
            </button>
            <button class="green" @click="onSetAction('In')">
                <i class="far fa-heart"></i>
                <span>In</span>
            </button>
            <button class="red" @click="onSetAction('Out')">
                <i class="far fa-times"></i>
                <span>Out</span>
            </button>
            <button @click="onSetAction('None')">
                <i class="far fa-question"></i>
                <span>Undecided</span>
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'productActionSelector',
    data: function() {
        return {
            showActionList: false,
        }
    },
    computed: {
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
        }),
        buttonClass() {
            const action = this.product.yourAction
            if (action == 'Focus') return 'primary'
            if (action == 'In') return 'green'
            if (action == 'Out') return 'red'
        },
        iconClass() {
            const action = this.product.yourAction
            if (action == 'Focus') return 'fa-star'
            if (action == 'In') return 'fa-heart'
            if (action == 'Out') return 'fa-times'
        },
    },
    methods: {
        ...mapActions('actions', ['updateCurrentProductAction']),
        onSetAction(action) {
            this.product.yourAction = action
            this.showActionList = false
            this.updateCurrentProductAction(this.product)
        },
    },
}
</script>

<style scoped lang="scss">
.product-action-selector {
    position: relative;
    pointer-events: all;
    .available-action-list {
        position: absolute;
        left: 0;
        bottom: 40px;
        > * {
            transform: translateX(calc(-100% - 12px));
            // animation: flyout 0.1s forwards ease-out;
            // // animation-duration: 0.1s;
            // // animation-timing-function: ease-out;
            // // animation-fill-mode: forwards;
            // // animation-direction: reverse;
            // @for $i from 1 through 4 {
            //     &:nth-child(#{$i}) {
            //         animation-delay: #{0.05 * ($i - 1)}s;
            //     }
            // }
        }
        &.show {
            > * {
                // transform: none;
                animation: flyin 0.1s forwards ease-out;
                // animation-duration: 0.1s;
                // animation-timing-function: ease-out;
                // animation-fill-mode: forwards;
                // animation-direction: normal;
                @for $i from 1 through 4 {
                    &:nth-child(#{$i}) {
                        animation-delay: #{0.025 * ($i - 1)}s;
                    }
                }
            }
        }
    }
}
@keyframes flyin {
    0% {
        transform: translateX(calc(-100% - 12px));
    }
    100% {
        transform: none;
    }
}
@keyframes flyout {
    0% {
        transform: none;
    }
    100% {
        transform: translateX(calc(-100% - 12px));
    }
}
</style>
