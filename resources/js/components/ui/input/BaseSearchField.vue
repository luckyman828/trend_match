<template>
    <div class="search">
        <input class="input-wrapper" :class="inputClasses" :placeholder="placeholderText || 'Search..'" type="search" v-model="searchString" ref="searchField"
        @click.stop @input="onInput" @keydown.esc="onEsc">
        <span v-if="searchString.length > 0" class="clear" @click.stop="clear();setFocus()">
            <i class="far fa-times-circle"></i>
        </span>
    </div>
</template>

<script>
export default {
    name: 'searchField',
    props: {
        arrayToSearch: {},
        searchKey: {},
        searchMultipleArrays: {},
        multipleArrayKey: {},
        placeholderText: {},
        inputClasses: {
            default: 'small'
        }
    },
    data: function () { return {
        searchString: '',
        theTimeOut: null
    }},
    watch: {
        // Watch for changes in the array to search
        arrayToSearch: function(newVal, oldVal) {
            // Emit the result when a change to the provided array occours
            this.$emit('input', this.getResult())
        }
    },
    computed: {
    },
    methods: {
        setFocus() {
            this.$refs.searchField.focus()
            this.$refs.searchField.select()
        },
        clear() {
            this.searchString = ''
            this.$emit('input', this.getResult())
        },
        onEsc(e) {
            // If we have a search string, clear that and prevent bubbling
            if (this.searchString.length > 0) {
                e.stopPropagation()
                this.clear()
            }
            // Else do nothing
        },
        onInput() {
            clearTimeout(this.theTimeOut)
            this.theTimeOut = setTimeout(() => {
                this.$emit('input', this.getResult(), this.searchString)
            }, 100)
        },
        getResult() {
            const array = this.arrayToSearch
            // Get the lowercase value to avoid the search being case sensitive
            let searchString = this.searchString.toLowerCase()
            const searchKey = this.searchKey
            // First test that we actually have a search string
            if (!searchString) {
                return array
            }

            let resultsToReturn = []

            // If search string is delimited by comma, convert to array and trim
            if (searchString.search(',') >= 0) {
                searchString = searchString.split(',')
            } else if (searchString.search(' ') >= 0) {
                searchString = searchString.split(' ')
            } else {
                searchString = [searchString]
            }
            searchString = searchString.map(str => str.trim())

            // If we have a search key, search by that
            if (searchKey) {

                // If we have multiple arrays to search through
                if (this.searchMultipleArrays) {

                    // Instantiate a copy of the multiple arrays object that we will use as the return object
                    const arrayToReturn = []

                    array.forEach(arrayObject => {
                        // Make a copy of the array object that we can filter the options of
                        const arrayObjectToReturn = Object.assign({}, arrayObject)
                        arrayObjectToReturn[this.multipleArrayKey] = arrayObject[this.multipleArrayKey].filter(x => {
                            // If the search key is an array of keys, search for a result in each of them
                            if (Array.isArray(searchKey)) {
                                // Assume no match
                                let isMatch = false
                                searchKey.forEach(key => {
                                    // Check that we have a value
                                    if (!x[key]) return false
                                    // Convert the value to match to a string so we can search it
                                    const valueToMatch = x[key].toString().toLowerCase()
                                    // If a match is found for any of the keys, return true
                                    searchString.forEach(str => {
                                        if (valueToMatch.search(str) >= 0) isMatch = true
                                    })
                                })
                                return isMatch
                            }
                            else {
                                // Check that we have a value
                                if (!x[searchKey]) return false
                                // Convert the value to match to a string so we can search it
                                const valueToMatch = x[searchKey].toString().toLowerCase()
                                let isMatch = false
                                searchString.forEach(str => {
                                    if (valueToMatch.search(str) >= 0) isMatch = true
                                })
                                return isMatch
                            }
                        })
                        arrayToReturn.push(arrayObjectToReturn)
                    })
                    // Return the resulting arrays
                    resultsToReturn = arrayToReturn
                }

                // If we don't have multiple arrays 
                else resultsToReturn = array.filter(x => {
                    // If the search key is an array of keys, search for a result in each of them
                    if (Array.isArray(searchKey)) {
                        // Assume no match
                        let isMatch = false
                        searchKey.forEach(key => {
                            // If a match is found for any of the keys, return true
                            // Check that we have a value
                            if (!x[key]) return false
                            // Convert the value to match to a string so we can search it
                            const valueToMatch = x[key].toString().toLowerCase()
                            searchString.forEach(str => {
                                if (valueToMatch.search(str) >= 0) isMatch = true
                            })
                        })
                        return isMatch
                    }
                    else {
                        // Check that we have a value
                        if (!x[searchKey]) return false
                        // Convert the value to match to a string so we can search it
                        const valueToMatch = x[searchKey].toString().toLowerCase()
                        let isMatch = false
                        searchString.forEach(str => {
                            if (valueToMatch.search(str) >= 0) isMatch = true
                        })
                        return isMatch
                        // return valueToMatch.search(searchString) >= 0
                    }
                })

            }
            // Else search by the option itself
            else {

                // If we have multiple arrays to search through
                if (this.searchMultipleArrays) {

                    // Instantiate a copy of the multiple arrays object that we will use as the return object
                    const arrayToReturn = []

                    array.forEach(arrayObject => {
                        // Make a copy of the array object that we can filter the options of
                        const arrayObjectToReturn = Object.assign({}, arrayObject)
                        arrayObjectToReturn[this.multipleArrayKey] = arrayObject[this.multipleArrayKey].filter(x => {
                            // Convert the value to match to a string so we can search it
                            const valueToMatch = x.toString().toLowerCase()
                            let isMatch = false
                            searchString.forEach(str => {
                                if (valueToMatch.search(str) >= 0) isMatch = true
                            })
                            return isMatch
                        })
                        arrayToReturn.push(arrayObjectToReturn)
                    })
                    // Return the resulting arrays
                    resultsToReturn = arrayToReturn
                }

                else {
                    resultsToReturn = array.filter(x => {
                        // Convert the value to match to a string so we can search it
                        const valueToMatch = x.toString().toLowerCase()
                        let isMatch = false
                        searchString.forEach(str => {
                            if (valueToMatch.search(str) >= 0) isMatch = true
                        })
                        return isMatch
                    })
                }

            }

            // Sort the results by the search array
            if (searchString.length > 2) {
                return resultsToReturn.sort((a,b) => {
                    return searchString.indexOf(a.datasource_id.toString()) - searchString.indexOf(b.datasource_id.toString())
                })
            }
            if (this.searchMultipleArrays) {
                // Only return arrays with results
                return resultsToReturn.filter(x => x[this.multipleArrayKey].length > 0)
            }

            return resultsToReturn
        }
    },
    created() {
        if (this.arrayToSearch) {
            this.$emit('input', this.getResult())
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .search {
        position: relative;
        input.input-wrapper {
            padding-right: 32px;
            box-sizing: border-box;
        }
        .clear {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 14px;
            color: $fontIcon;
            cursor: pointer;
            padding: 4px 12px;
            height: 100%;
            display: flex;
            align-items: center;
            &:hover i {
                color: $font;
            }
        }
    }

</style>