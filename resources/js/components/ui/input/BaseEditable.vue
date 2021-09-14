<template>
    <div ref="original" class="editable" v-if="!editActive" @click="activate">
        <span>{{ value ? value : placeholder | truncate(truncateLength) }}</span>
        <span v-tooltip.top="'Edit'" class="edit square true-square light-2-hover">
            <i class="far fa-pen"></i>
        </span>
    </div>
    <input
        v-else
        ref="input"
        :id="id"
        class="input-wrapper active"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        @keyup.enter="submit"
        @keydown.esc.stop
        @keyup.esc="cancel"
        @blur="submit"
    />
</template>

<script>
export default {
    name: 'editable',
    props: ['value', 'type', 'id', 'placeholder', 'truncateLength'],
    data: function() {
        return {
            editActive: false,
            oldValue: null,
        }
    },
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
                this.$refs.input.style.width = width + offset + 'px'
            })
        },
        submit() {
            if (this.editActive) {
                this.$emit('input', this.$refs.input.value)
                this.$emit('submit', this.$refs.input.value)
                this.editActive = false
                document.activeElement.blur()
            }
        },
        cancel() {
            this.$emit('cancel')
            this.editActive = false
            document.activeElement.blur()
            this.$emit('input', this.oldValue)
        },
    },
}
</script>

<style scoped lang="scss">
.editable {
    cursor: pointer;
    display: block;
    .edit {
        opacity: 0;
        transition: 0.3s;
    }
    &:hover {
        .edit {
            opacity: 1;
        }
    }
}
</style>
