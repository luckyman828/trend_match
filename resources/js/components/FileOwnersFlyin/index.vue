<template>
    <BaseFlyin :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'File Owners: '+file.title" disableNavigation=true @close="$emit('close')"/>
        </template>
        <template v-slot>
            <FileOwnersTable v-if="show" :file="file"/>
        </template>
    </BaseFlyin>
</template>

<script>
import FileOwnersTable from './FileOwnersTable'
export default {
    name: 'fileOwnersFlyin',
    components: {
        FileOwnersTable
    },
    props: [
        'file',
        'show'
    ]
}
</script>

<style>

</style>