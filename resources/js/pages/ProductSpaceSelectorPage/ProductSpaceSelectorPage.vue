<template>
    <div class="product-space-selector">
        <div class="container">
            <h1>Hello {{ authUser ? authUser.name : 'Anon' }}</h1>
            <div class="product-list flex-list md">
                <div
                    class="product-card flex-list flex-v md wrap"
                    v-for="(space, index) in availableSpaces"
                    :key="index"
                    @click="onSetSpace(space.name)"
                >
                    <div class="logo-wrapper">
                        <img :src="space.logo" />
                    </div>
                    <div class="name ft-bd ft-20">{{ space.name }}</div>
                    <div class="dscription ft-md ft-16">{{ space.byline }}</div>
                    <button class="dark fullw-width">
                        <span>Go</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'productSpaceSelectorPage',
    computed: {
        ...mapGetters('auth', {
            authUser: 'authUser',
        }),
        ...mapGetters('workspaces', {
            availableSpaces: 'getEnabledSpaces',
        }),
    },
    methods: {
        ...mapMutations('kollekt', ['SET_KOLLEKT_SPACE', 'NAVIGATE_TO_CURRENT_SPACE']),
        onSetSpace(space) {
            this.SET_KOLLEKT_SPACE(space)
            this.NAVIGATE_TO_CURRENT_SPACE()
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.container {
    width: 100%;
    max-width: 600px;
    margin: auto;
    padding-top: 80px;
    h1 {
        margin-bottom: 60px;
    }
    .logo-wrapper {
        height: 100px;
        width: 100px;
        margin: 0 auto 16px;
        img {
            height: 100%;
            width: 100%;
            object-fit: contain;
            filter: drop-shadow($shadowXs);
        }
    }
    .go-button {
        margin-top: auto !important;
    }
}
.product-card {
    background: white;
    border: $borderEl;
    border-radius: 8px;
    transition: 0.1s ease-out;
    cursor: pointer;
    padding: 32px;
    border-radius: $borderRadiusModule;
    flex: 1;
    .name {
        text-transform: uppercase;
    }
    &.disabled {
        background: $bluegrey400;
        cursor: default;
    }
    &:not(.disabled) {
        &:hover {
            // background: $dark;
            // color: white;
            box-shadow: 0 3px 6px 0 rgba(117, 134, 156, 0.5);
            transform: translateY(-4px);
        }
    }
}
</style>
