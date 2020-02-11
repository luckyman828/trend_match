<template>
    <BaseFlyin ref="fileApproversFlyin" :show="show">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'File Approvers: '+file.title" disableNavigation=true @close="$emit('close')"/>
        </template>
        <template v-slot>
            <FileApproversTable v-if="show" :file="file"/>
        </template>
    </BaseFlyin>
</template>

<script>
import FileApproversTable from './FileApproversTable'
export default {
    name: 'fileApproversFlyin',
    components: {
        FileApproversTable
    },
    props: [
        'show',
        'file'
    ]
}
</script>

<style>

</style>