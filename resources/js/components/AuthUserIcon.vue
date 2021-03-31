<template>
    <div class="circle auth-user-icon">
        <div class="user">
            {{
                authUser.name
                    .split(' ')
                    .map(x => x.slice(0, 1))
                    .join('')
            }}
        </div>
        <div class="bg"></div>
        <div class="circle xxs dark">
            <i class="fas white" :class="authUserWorkspaceRole == 'Admin' ? 'fa-crown' : 'fa-user'"></i>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'authUserIcon',
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.auth-user-icon {
    cursor: pointer;
    border: none;
    position: relative;
    background: brown;
    @keyframes spin {
        100% {
            transform: rotate(360deg), translate(-59%, -60%);
        }
    }
    &:hover {
        .bg::after {
            animation: spin linear forwards 1s infinite;
        }
    }
    .user {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: white;
        position: relative;
    }
    .bg {
        overflow: hidden;
        border-radius: 50px;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: transparent radial-gradient(closest-side at 3% 0%, #2a46ffa3 0%, #ffb0395e 100%) 0% 0% no-repeat
            padding-box;
        mix-blend-mode: screen;
        &::after {
            content: '';
            display: block;
            background: transparent radial-gradient(closest-side at 44% 53%, #2a46ff 54%, #ffb0395e 100%) 16% 0%
                no-repeat padding-box;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-59%, -60%);
            height: 46px;
            width: 46px;
            /* opacity: .5; */
            z-index: 0;
            mix-blend-mode: overlay;
            opacity: 0.6;
        }
    }
    .circle {
        position: absolute;
        right: 0;
        bottom: 0;
        transform: translate(35%, 35%);
        i {
            margin: 0;
            font-size: 10px;
        }
    }
}
</style>
