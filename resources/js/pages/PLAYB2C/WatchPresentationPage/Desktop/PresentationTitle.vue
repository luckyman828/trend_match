<template>
    <div class="video-title-wrapper">
        <div class="video-title">
            <!-- <button
                class="white circle"
                @click="
                    $router.push({
                        name: 'play.find',
                    })
                "
            >
                <i class="fas fa-arrow-left"></i>
            </button> -->
            <div class="title">
                <div class="video-name">{{ presentation.name }}</div>
                <div class="brand-name">{{ workspace.title }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'presentationTitle',
    props: ['presentation'],
    computed: {
        ...mapGetters('workspaces', {
            workspace: 'currentWorkspace',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.video-title-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    background: none;
    padding: 16px;
    width: 100%;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100px;
        // animation: fadeout 0.2s ease-out forwards;
        animation: fadeout 0.4s ease-out forwards;
        animation-delay: 0.1s;
        background: linear-gradient(180deg, black 40%, transparent);
        // opacity: 0;
        z-index: -1;
        pointer-events: none;
    }
    .desired-paused &::before,
    .recently-started &::before {
        animation: none;
        opacity: 1;
    }
}
.video-title {
    display: flex;
    transition: transform $videoPauseTransition, opacity $videoPauseTransition;
    transform: translateX(-40px);
    opacity: 0;
    .desired-paused &,
    .recently-started & {
        transform: none;
        opacity: 1;
    }
    button {
        margin-right: 12px;
    }
    .video-name,
    .brand-name {
        line-height: 1;
        color: white;
    }
    .video-name {
        font-size: 20px;
        font-weight: 700;
    }
    .brand-name {
        font-size: 12px;
        font-weight: 500;
        margin-top: 4px;
    }
}
@keyframes fadeout {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
