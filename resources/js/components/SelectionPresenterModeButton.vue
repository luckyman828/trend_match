<template>
    <button v-if="selection && selection.type == 'Master'" 
    :class="[!selection.presenterModeActive && 'ghost', !userHasEditAccess && 'disabled']"
    @click="togglePresenterMode(selection)">
        <template v-if="selection.presenterModeActive">
            <span>Presentation Live</span>
            <i class="fas fa-circle red"></i>
        </template>
        <template v-else>
            <span>Start presenting</span>
            <i class="fas fa-circle"></i>
        </template>
    </button>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'selectionPresenterModeButton',
    props: [
        'selection'
    ],
    computed: {
        ...mapGetters('selections', ['getAuthUserHasSelectionEditAccess']),
        userHasEditAccess() {
            return this.getAuthUserHasSelectionEditAccess(this.selection)
        }
    },
    methods: {
        ...mapActions('selections', ['togglePresenterMode']),
    }
}
</script>

<style>

</style>