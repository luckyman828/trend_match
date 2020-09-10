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
            <p style="margin-top: 12px">
                <i class="fas fa-info-circle"></i>
                <span style="margin-left: 4px;">Editor's can create/edit/delete products in the file.</span>
            </p>
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