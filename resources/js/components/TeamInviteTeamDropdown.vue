<template>
    <div class="team-dropdown dropdown dark collapsed">
        <div class="header">
            <span>{{teams.length}} Teams</span>
            <span class="close"><i class="fal fa-times"></i></span>
        </div>
        <div class="body">
            <div class="radio-buttons">
                <label v-for="team in teams" :key="team.id">
                    <input type="radio" name="team" :id="'radio-option-' + team.id" :value="team.id" v-model="selection">
                    <span class="radio-mark"></span>
                    {{team.title}}
                </label>
            </div>
        </div>
        <div class="footer">
            <div class="grid-2 small-gap">
                <span class="button green" @click="submitModal">Save</span>
                <span class="button invisible" @click="closeModal">Cancel</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'teamInviteTeamDropdown',
    props: [
        'teams',
        'currentTeam'
    ],
    data: function () { return {
        selection: ''
    }},
    methods: {
        consoleLog() {
            console.log('changed')
        },
        submitModal() {
            this.$emit('onSubmit', this.selection)
            this.$emit('onClose')
        },
        closeModal() {
            this.$emit('onClose')
        }
    },
    mounted() {
        // Set the height of the component
        const el = this.$el
        const parent = el.closest('.dropdown-parent')
        if (parent != null)
            el.style.cssText = `top: ${parent.scrollHeight}px; max-height: ${el.scrollHeight}px;`
        else el.style.cssText = `max-height: ${el.scrollHeight}px;`
        el.classList.remove('collapsed')

        // Preset the 
        document.querySelector('#radio-option-' + this.currentTeam.id).checked = true
    },
    beforeDestroy() {
        // Set the height of the component
        const el = this.$el
        el.classList.add('collapsed')
    },
    destroyed() {
        console.log('I was destroyed')
    }
}
</script>

<style scopes lang="scss">
@import '~@/_variables.scss';


</style>