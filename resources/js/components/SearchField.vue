<template>
    <div class="search">
        <input class="input-wrapper small" placeholder="Search.." type="search" v-model="searchString" ref="searchField"
        @click.stop @input="$emit('input', result)" @keydown.esc="onEsc">
        <span v-if="searchString.length > 0" class="close" @click="clear()">
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
    watch: {
        // Watch for changes in the array to search
        arrayToSearch: function(newVal, oldVal) {
            // Emit the result when a change to the provided array occours
            this.$emit('input', this.result)
        }
    },
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
                return array.filter(x => {
                    // If the search key is an array of keys, search for a result in each of them
                    if (Array.isArray(searchKey)) {
                        // Assume no match
                        let match = false
                        searchKey.forEach(key => {
                            // If a match is found for any of the keys, return true
                            if (x[key].toLowerCase().search(searchString) >= 0) {
                                match = true
                            }
                        })
                        return match
                    }
                    else return x[searchKey].toLowerCase().search(searchString) >= 0
                })
            // Else search by the option itself
            return array.filter(x => x.toLowerCase().search(searchString) >= 0)
        }
    },
    methods: {
        setFocus() {
            this.$refs.searchField.focus()
            this.$refs.searchField.select()
        },
        clear() {
            this.searchString = '',
            this.$emit('input', this.result)
        },
        onEsc(e) {
            // If we have a search string, clear that and prevent bubbling
            if (this.searchString.length > 0) {
                e.stopPropagation()
                this.clear()
            }
            // Else do nothing
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .search {
        position: relative;
        input.input-wrapper.small {
            padding-right: 32px;
            box-sizing: border-box;
        }
        .close {
            position: absolute;
            right: 0;
            top: 2px;
            font-size: 12px;
            color: $fontIcon;
            cursor: pointer;
            padding: 4px 12px;
            &:hover {
                opacity: .8;
            }
        }
    }

</style>