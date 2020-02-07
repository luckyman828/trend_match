<template>
    <BaseFlyin :show="show">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'Folder Owners: '+folder.title" disableNavigation=true @close="$emit('close')"/>
        </template>
        <template v-slot>
            <FolderOwnersTable v-if="show" :folder="folder"/>
        </template>
    </BaseFlyin>
</template>

<script>
import FolderOwnersTable from './FolderOwnersTable'
export default {
    name: 'folderOwnersFlyin',
    components: {
        FolderOwnersTable
    },
    props: [
        'show',
        'folder'
    ]
}
</script>

<style>

</style>