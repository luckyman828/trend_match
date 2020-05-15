<template>
    <BaseFlyin ref="flyin" :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" disableNavigation=true 
            @close="$emit('close')">
                <template v-slot:left>
                    <h3>Selection Users: {{selection.name}}</h3>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-slot>
            <SelectionTeamsTable/>
            <SelectionUsersTable style="margin-top: 40px;"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectionUsersTable from './SelectionUsersTable'
import SelectionTeamsTable from './SelectionTeamsTable'
export default {
    name: 'selectionUsersFlyin',
    components: {
        SelectionUsersTable,
        SelectionTeamsTable,
    },
    props: [
        'show',
        'selection',
    ],
}
</script>

<style>

</style>