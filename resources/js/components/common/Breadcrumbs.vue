<template>
    <div class="breadcrumbs">
        <button class="invisible ghost-hover sm" @click="onGoToHome">
            <i class="far fa-building"></i><span>{{ currentWorkspace.title }}</span>
        </button>
        <div class="breadcrumb" v-for="(folder, index) in getCurrentFilePath" :key="folder.id">
            <template v-if="!currentFolder || folder.id != currentFolder.id">
                <button @click="setCurrentFolder(folder, index)" class="invisible ghost-hover sm">
                    <i class="far fa-folder"></i>
                    <span>{{ folder.name }}</span>
                    <!-- <i class="fas fa-caret-down contextual-menu-icon"></i> -->
                </button>
            </template>
            <template v-else>
                <button class="invisible ghost-hover sm">
                    <i class="far fa-folder-open"></i>
                    <span>{{ folder.name }}</span>
                    <!-- <i class="fas fa-caret-down contextual-menu-icon"></i> -->
                </button>
            </template>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'breadcrumbs',
    props: ['root'],
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['getCurrentFilePath', 'currentFolder']),
    },
    methods: {
        ...mapActions('files', ['setCurrentFolder']),
        onGoToHome() {
            const toName = this.root ? `${this.root}.files` : 'files'
            if (this.$route.name != toName) this.$router.push({ name: toName })
            this.setCurrentFolder(null)
        },
    },
}
</script>

<style lang="scss" scoped>
button {
    margin-right: 4px;
    &.sm > span:last-child {
        margin-right: 4px;
    }
    &:hover {
        i.fa-folder::before {
            content: '\F07C';
        }
    }
}
</style>
