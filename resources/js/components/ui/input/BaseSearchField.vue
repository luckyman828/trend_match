<template>
    <div class="search" v-observe-visibility="focusOnMount && onVisibilityChanged">
        <input
            class="input-wrapper"
            :class="inputClasses"
            :placeholder="placeholderText || 'Search..'"
            type="search"
            v-model="searchString"
            ref="searchField"
            @click.stop
            @input="onInput"
            @keydown.esc="onEsc"
            @paste="onPaste"
        />
        <span
            v-if="searchString.length > 0"
            class="clear"
            @click.stop="
                clear()
                setFocus()
            "
        >
            <i class="far fa-times-circle"></i>
        </span>
    </div>
</template>

<script>
import getUniqueObjectValuesByKey from '../../../helpers/getUniqueObjectValuesByKey'
export default {
    name: 'searchField',
    props: {
        arrayToSearch: {},
        searchKey: {},
        searchMultipleArrays: {},
        multipleArrayKey: {},
        placeholderText: {},
        focusOnMount: { default: false },
        inputClasses: {
            default: 'small',
        },
    },
    data: function() {
        return {
            searchString: '',
            theTimeOut: null,
        }
    },
    watch: {
        // Watch for changes in the array to search
        arrayToSearch: function(newVal, oldVal) {
            // Emit the result when a change to the provided array occours
            this.$emit('input', this.getResult())
        },
    },
    computed: {},
    methods: {
        onVisibilityChanged(isVisible) {
            if (this.focusOnMount && isVisible) {
                this.$nextTick(() => {
                    this.setFocus()
                })
            }
        },
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
                return
            }

            document.activeElement.blur()
        },
        onInput() {
            clearTimeout(this.theTimeOut)
            this.theTimeOut = setTimeout(() => {
                this.$emit('input', this.getResult(), this.searchString)
            }, 100)
        },
        onPaste(e) {
            e.preventDefault()
            const clipData = e.clipboardData.getData('text/plain')
            clipData.trim('\r\n')
            const rows = clipData.split('\r\n')
            const allCells = []
            rows.map(row => {
                const cells = row.split('\t').filter(cellValue => !!cellValue)
                allCells.push(...cells)
            })
            const newStr = allCells.join(', ')

            // Insert the modified pasta in the correct spot
            const selectionStart = e.target.selectionStart
            const selectionEnd = e.target.selectionEnd
            const oldVal = e.target.value
            const newVal = oldVal.slice(0, selectionStart) + newStr + oldVal.slice(selectionEnd)
            this.searchString = newVal
            this.$emit('input', this.getResult(), this.searchString)
        },
        getResult() {
            const array = this.arrayToSearch

            // Get the lowercase value to avoid the search being case sensitive
            let searchString = this.searchString.toLowerCase()

            // Look for modifiers
            const modifiers = searchString.match(/((?:^|[^\w]):.[^ ]*)/g) || []
            // Find the last index
            if (modifiers && modifiers.length > 0) {
                const lastMod = modifiers[modifiers.length - 1]
                const lastIndexOfMod = searchString.lastIndexOf(lastMod)
                searchString = searchString.slice(lastIndexOfMod + lastMod.length).trim()
            }

            const searchKey = this.searchKey
            // First test that we actually have a search string
            if (!searchString) {
                return array
            }

            let resultsToReturn = []

            // If search string is delimited by comma, convert to array and trim
            if (searchString.search(',') >= 0) {
                searchString = searchString.split(',')
            } else {
                searchString = [searchString]
            }
            searchString = searchString.map(str => str.trim())

            // Helpers function
            const compareMatch = compareValue => {
                // Convert the value to match to a string so we can search it
                const valueToMatch = compareValue.toString().toLowerCase()
                let isMatch = false
                searchString.forEach(str => {
                    if (valueToMatch.search(str) >= 0) isMatch = true
                })
                return isMatch
            }

            const getResults = () => {
                if (!searchKey || searchKey.length <= 0) {
                    return array.filter(x => compareMatch(x))
                }
                return array.filter(arrayItem => {
                    let isMatch = false
                    for (const key of searchKey) {
                        if (!key) continue
                        const valuesToMatch = getUniqueObjectValuesByKey(arrayItem, key)
                        for (const valueToMatch of valuesToMatch) {
                            if (compareMatch(valueToMatch)) {
                                isMatch = true
                                break
                            }
                        }
                        if (isMatch) break
                    }
                    return isMatch
                })
            }

            resultsToReturn = getResults()

            // // If no search key, search by the option itself
            // if (!searchKey || (Array.isArray(searchKey) && !searchKey.find(key => key != null))) {
            //     // If we have multiple arrays to search through
            //     if (this.searchMultipleArrays) {
            //         // Instantiate a copy of the multiple arrays object that we will use as the return object
            //         const arrayToReturn = []

            //         array.forEach(arrayObject => {
            //             // Make a copy of the array object that we can filter the options of
            //             const arrayObjectToReturn = Object.assign({}, arrayObject)
            //             arrayObjectToReturn[this.multipleArrayKey] = arrayObject[this.multipleArrayKey].filter(x =>
            //                 compareMatch(x)
            //             )
            //             arrayToReturn.push(arrayObjectToReturn)
            //         })
            //         // Return the resulting arrays
            //         resultsToReturn = arrayToReturn
            //     } else {
            //         resultsToReturn = array.filter(x => compareMatch(x))
            //     }
            // }

            // // Else If we have a search key, search by that
            // else {
            //     // If we have multiple arrays to search through
            //     if (this.searchMultipleArrays) {
            //         // Instantiate a copy of the multiple arrays object that we will use as the return object
            //         const arrayToReturn = []

            //         array.forEach(arrayObject => {
            //             // Make a copy of the array object that we can filter the options of
            //             const arrayObjectToReturn = Object.assign({}, arrayObject)
            //             arrayObjectToReturn[this.multipleArrayKey] = arrayObject[this.multipleArrayKey].filter(x => {
            //                 // If the search key is an array of keys, search for a result in each of them
            //                 if (Array.isArray(searchKey)) {
            //                     // Assume no match
            //                     let isMatch = false
            //                     searchKey.forEach(key => {
            //                         // Check if the value is an object
            //                         let valueToMatch = x
            //                         if (typeof x == 'object') {
            //                             valueToMatch = x[key]
            //                             // Check that we have a value
            //                             if (!valueToMatch) return false
            //                         }
            //                         // Convert the value to match to a string so we can search it
            //                         valueToMatch = valueToMatch.toString().toLowerCase()
            //                         // If a match is found for any of the keys, return true
            //                         searchString.forEach(str => {
            //                             if (valueToMatch.search(str) >= 0) isMatch = true
            //                         })
            //                     })
            //                     return isMatch
            //                 } else {
            //                     // Check that we have a value
            //                     if (!x[searchKey]) return false
            //                     // Convert the value to match to a string so we can search it
            //                     const valueToMatch = x[searchKey].toString().toLowerCase()
            //                     let isMatch = false
            //                     searchString.forEach(str => {
            //                         if (valueToMatch.search(str) >= 0) isMatch = true
            //                     })
            //                     return isMatch
            //                 }
            //             })
            //             arrayToReturn.push(arrayObjectToReturn)
            //         })
            //         // Return the resulting arrays
            //         resultsToReturn = arrayToReturn
            //     }

            //     // If we don't have multiple arrays
            //     else
            //         resultsToReturn = array.filter(x => {
            //             // If the search key is an array of keys, search for a result in each of them
            //             if (Array.isArray(searchKey)) {
            //                 // Assume no match
            //                 let isMatch = false
            //                 searchKey.forEach(key => {
            //                     // If a match is found for any of the keys, return true
            //                     // Check that we have a value
            //                     if (!x[key]) return false
            //                     // Convert the value to match to a string so we can search it
            //                     const valueToMatch = x[key].toString().toLowerCase()
            //                     searchString.forEach(str => {
            //                         if (valueToMatch.search(str) >= 0) isMatch = true
            //                     })
            //                 })
            //                 return isMatch
            //             } else {
            //                 // Check that we have a value
            //                 if (!x[searchKey]) return false
            //                 // Convert the value to match to a string so we can search it
            //                 const valueToMatch = x[searchKey].toString().toLowerCase()
            //                 let isMatch = false
            //                 searchString.forEach(str => {
            //                     if (valueToMatch.search(str) >= 0) isMatch = true
            //                 })
            //                 return isMatch
            //                 // return valueToMatch.search(searchString) >= 0
            //             }
            //         })
            // }

            // FLIP THE RESULT IF NEEDED
            if (modifiers.includes(':inverse') || modifiers.includes(':invert')) {
                resultsToReturn = array.filter(x => {
                    // Chech that the item is not in the search results
                    // Assume that the items we are searching has an ID property
                    return !resultsToReturn.find(result => result.id == x.id)
                })
            }

            // Sort the results by the search array
            if (searchString.length > 2) {
                return resultsToReturn.sort((a, b) => {
                    return (
                        searchString.indexOf(a.datasource_id.toString()) -
                        searchString.indexOf(b.datasource_id.toString())
                    )
                })
            }
            if (this.searchMultipleArrays) {
                // Only return arrays with results
                return resultsToReturn.filter(x => x[this.multipleArrayKey].length > 0)
            }

            return resultsToReturn
        },
    },
    mounted() {
        if (this.focusOnMount) {
            this.setFocus()
            // const focusSearchTester = setInterval(() => {
            //     if (document.activeElement.type == 'search') {
            //         clearInterval(focusSearchTester)
            //         return
            //     }
            //     this.setFocus()
            // }, 100)
        }
    },
    created() {
        if (this.arrayToSearch) {
            this.$emit('input', this.getResult())
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.search {
    position: relative;
    input.input-wrapper {
        width: 100%;
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
