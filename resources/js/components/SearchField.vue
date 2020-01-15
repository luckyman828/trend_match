<template>
    <div class="search">
        <input class="input-wrapper small" placeholder="Search.." type="search" v-model="searchString" ref="searchField"
        @click.stop @input="$emit('input', result)" @keydown.esc="onEsc">
        <span v-if="searchString.length > 0" class="close" @click="searchString = ''">
            <i class="fas fa-times"></i>
        </span>
    </div>
</template>

<script>
export default {
    name: 'searchField',
    props: [
        'arrayToSearch',
        'searchKey'
    ],
    data: function () { return {
        searchString: '',
    }},
    computed: {
        result() {
            const array = this.arrayToSearch
            // Get the lowercase value to avoid the search being case sensitive
            const searchString = this.searchString.toLowerCase()
            const searchKey = this.searchKey
            // First test that we actually have a search string
            if (!searchString) {
                return array
            }
            // If we have a search key, search by that
            if (searchKey)
                return array.filter(x => x[searchKey].toLowerCase().search(searchString) >= 0)
            // Else search by the option itself
            return array.filter(x => x.toLowerCase().search(searchString) >= 0)
        }
    },
    methods: {
        setFocus() {
            this.$refs.searchField.focus()
            this.$refs.searchField.select()
        },
        onEsc(e) {
            // If we have a search string, clear that and prevent bubbling
            if (this.searchString.length > 0) {
                e.stopPropagation()
                this.searchString = ''
            }
            // Else do nothing
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .search {
        padding: 8px;
        position: relative;
        input.input-wrapper.small {
            padding-right: 32px;
            box-sizing: border-box;
        }
        .close {
            position: absolute;
            right: 8px;
            top: 11px;
            font-size: 12px;
            color: $dark05;
            cursor: pointer;
            padding: 4px 12px;
            &:hover {
                opacity: .8;
            }
        }
    }

</style>