<template>
        <span ref="original" class="editableTextarea" v-if="!editActive" @click="activate">{{value ? value : placeholder}} <span v-tooltip.top="'Edit'" class="edit square true-square light-2-hover"><i class="far fa-pen"></i></span></span>
        <textarea v-else ref="input" :id="id" class="input-wrapper active" :value="value" :placeholder="placeholder"
        @input="resizeTextarea($event.target)" @keydown.enter.exact.prevent @keyup.enter.exact="submit" 
        @keydown.esc.stop @keyup.esc="cancel" @blur="submit"></textarea>
</template>

<script>
export default {
    name: 'editableTextarea',
    props: [
        'value',
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
            this.$emit('activate', true)
            this.$nextTick(() => {
                this.$refs.input.focus()
                this.$refs.input.select()
                // Set the size of the input field
                const offset = 50
                this.resizeTextarea(this.$refs.input)
            })

        },
        submit() {
            this.$emit('input', this.$refs.input.value)
            this.$emit('submit')
            this.editActive = false
            this.$emit('activate', false)
            document.activeElement.blur()
        },
        cancel() {
            this.$emit('cancel')
            this.editActive = false
            this.$emit('activate', false)
            document.activeElement.blur()
            this.$emit('input', this.oldValue)
        },
        resizeTextarea(textarea) {
            console.log('resize textarea')
            const commentField = textarea
            // Avoid weird resizing when there is only 1 character in the textarea
            // if (event.target.value.length > 1) {
                commentField.style.height = ''

                // Avoid making the textarea smaller than default
                const offset = 4
                if (commentField.scrollHeight + offset > 42) {
                    commentField.style.height = commentField.scrollHeight + offset + "px"
                }
            // }
        },
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .editableTextarea {
        cursor: pointer;
        display: block;
        .edit {
            opacity: 0;
            transition: .3s;
        }
        &:hover {
            .edit {
                opacity: 1;
            }
        }
    }
    textarea {
        resize: none;
        line-height: 1.49;
    }

</style>