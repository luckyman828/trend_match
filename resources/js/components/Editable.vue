<template>
        <span ref="original" class="editable" v-if="!editActive" @click="activate">{{value}}</span>
        <input v-else ref="input" :id="id" class="input-wrapper active" :type="type" :value="value" :placeholder="placeholder"
            @keyup.enter="submit" @keydown.esc.stop @keyup.esc="cancel">
</template>

<script>
export default {
    name: 'editable',
    props: [
        'value',
        'type',
        'id',
        'placeholder'
    ],
    data: function () { return {
        editActive: false,
        oldValue: null
    }},
    methods: {
        activate() {
            this.oldValue = this.value
            // Get the width of the current value
            const width = this.$refs.original.getBoundingClientRect().width

            this.editActive = true
            this.$nextTick(() => {
                this.$refs.input.focus()
                this.$refs.input.select()
                // Set the size of the input field
                const offset = 50
                this.$refs.input.style.minWidth = width + offset + 'px'
            })

        },
        submit() {
            this.$emit('input', this.$refs.input.value)
            this.editActive = false
            document.activeElement.blur()
        },
        cancel() {
            this.editActive = false
            document.activeElement.blur()
            this.$emit('cancel')
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .editable {
        cursor: pointer;
    }

</style>