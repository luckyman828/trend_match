<template>
    <div class="product-space-selector">
        <div class="container">
            <h1>Hello {{ authUser ? authUser.name : 'Anon' }}</h1>
            <div class="product-list flex-list md">
                <div class="product-card flex-list flex-v md" @click="onSetSpace('select')">
                    <div class="logo-wrapper">
                        <img src="/images/kollekt_logo_00_1024x1024-color.svg" alt="SELECT logo" />
                    </div>
                    <div class="name ft-bd ft-20">Kollekt SELECT</div>
                    <div class="dscription ft-md ft-16">Collaborative estimates</div>
                    <button class="dark fullw-width">
                        <span>Go</span>
                    </button>
                </div>
                <div class="product-card flex-list flex-v md" @click="onSetSpace('buy')">
                    <div class="logo-wrapper">
                        <img src="/images/kollekt_logo_00_1024x1024-color.svg" alt="BUY logo" />
                    </div>
                    <div class="name ft-bd ft-20">Kollekt BUY</div>
                    <div class="dscription ft-md ft-16">Multi-brand purchasing</div>
                    <button class="dark full-width go-button">
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
    },
    methods: {
        ...mapMutations('kollekt', ['SET_KOLLEKT_SPACE']),
        onSetSpace(space) {
            this.SET_KOLLEKT_SPACE(space)
            this.$router.push({ name: space })
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
        height: 68px;
        width: 68px;
        margin: 0 auto 16px;
        background: $bg;
        border-radius: 16px;
        img {
            height: 100%;
            width: 100%;
            object-fit: contain;
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
