<template>
    <BaseFlyin ref="flyin" :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'Selection Users: '+selection.name" disableNavigation=true 
            @close="$emit('close')"/>
        </template>
        <template v-slot>
            <SelectionUsersTable v-if="show" :selection="selection"/>
        </template>
    </BaseFlyin>
</template>

<script>
import SelectionUsersTable from './SelectionUsersTable'
export default {
    name: 'selectionUsersFlyin',
    components: {
        SelectionUsersTable
    },
    props: [
        'show',
        'selection',
    ]
}
</script>

<style>

</style>