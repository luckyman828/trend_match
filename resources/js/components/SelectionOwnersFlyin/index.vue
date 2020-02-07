<template>
    <BaseFlyin ref="flyin" :show="show">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'Selection Owners: '+selection.name" disableNavigation=true 
            @close="$emit('close')"/>
        </template>
        <template v-slot>
            <SelectionOwnersTable v-if="show" :selection="selection"/>
        </template>
    </BaseFlyin>
</template>

<script>
import SelectionOwnersTable from './SelectionOwnersTable'
export default {
    name: 'selectionOwnersFlyin',
    components: {
        SelectionOwnersTable
    },
    props: [
        'show',
        'selection',
    ]
}
</script>

<style>

</style>