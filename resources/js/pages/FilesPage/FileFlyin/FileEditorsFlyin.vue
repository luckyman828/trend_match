<template>
    <BaseFlyin ref="flyin" :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" disableNavigation=true 
            @close="$emit('close')">
                <template v-slot:left>
                    <h3>File Editors {{file.name}}</h3>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-slot>
            <FileEditorsTable :file="file"/>
        </template>
    </BaseFlyin>
</template>

<script>
import FileEditorsTable from './FileEditorsTable'

export default {
    name: 'fileEditorsFlyin',
    components: {
        FileEditorsTable,
    },
    props: [
        'show',
        'selection',
        'file',
    ],
}
</script>

<style>

</style>