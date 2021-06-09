<template>
    <div class="search" :class="[theme && 'theme-' + theme]" v-observe-visibility="focusOnMount && onVisibilityChanged">
        <input
            class="input-wrapper"
            :class="[inputClasses]"
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
        theme: {},
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

            // Make sure the searchkey is an array if it has a value
            const searchKey = this.searchKey && !Array.isArray(this.searchKey) ? [this.searchKey] : this.searchKey
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

            // START Helper functions
            const compareMatch = compareValue => {
                // Convert the value to match to a string so we can search it
                const valueToMatch = compareValue.toString().toLowerCase()
                let isMatch = false
                searchString.forEach(str => {
                    if (valueToMatch.search(str) >= 0) isMatch = true
                })
                return isMatch
            }

            const getResults = searchArray => {
                if (!searchKey || searchKey.length <= 0) {
                    return searchArray.filter(x => compareMatch(x))
                }
                let results = searchArray.filter(arrayItem => {
                    let isMatch = false
                    for (const key of searchKey) {
                        if (!key) continue
                        const valuesToMatch = getUniqueObjectValuesByKey(arrayItem, key)
                        // console.log('compare match', key, valuesToMatch, arrayItem)
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

                // console.log('results', results)

                // Modify results by modifiers
                results = modifyResults(results, searchArray)
                // console.log('results modified', results)

                // Sort results
                results = sortResults(results)
                // console.log('results sorted', results)

                return results
            }

            const modifyResults = (resultArray, originalArray) => {
                let modifiedResults = [...resultArray]
                // FLIP THE RESULT IF NEEDED
                if (modifiers.includes(':inverse') || modifiers.includes(':invert')) {
                    modifiedResults = [...originalArray].filter(original => {
                        // Chech that the item is not in the search results
                        // Assume that the items we are searching has an ID property
                        return !resultArray.find(result => result.id == original.id)
                    })
                }
                return modifiedResults
            }

            // Half-baked sort results function. It can only sort products by datasource id..
            const sortResults = resultArray => {
                let resultsSorted = [...resultArray]
                // Sort the results by the search array
                if (searchString.length > 2) {
                    resultsSorted = resultsSorted.sort((a, b) => {
                        if (!(a.datasource_id && b.datasource_id)) return
                        return (
                            searchString.indexOf(a.datasource_id.toString()) -
                            searchString.indexOf(b.datasource_id.toString())
                        )
                    })
                }
                return resultsSorted
            }
            // END Helper functions

            // Normal Search
            if (!this.searchMultipleArrays) {
                resultsToReturn = getResults(array)
            }
            // Search Multiple Objects
            else {
                array.map(searchObj => {
                    const key = this.multipleArrayKey
                    // Make a copy of the object
                    const objClone = Object.assign({}, searchObj)
                    // Get the values to search on the object
                    const searchArray = getUniqueObjectValuesByKey(searchObj, key)
                    // Get the results
                    const objResults = getResults(searchArray)
                    // console.log('obj results', objResults, searchArray)
                    if (objResults.length > 0) {
                        objClone[key] = objResults
                        resultsToReturn.push(objClone)
                    }
                })
            }

            // console.log('getResult', resultsToReturn)

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
    &.theme-light {
        // background: ;
        &::v-deep {
            input {
                border-radius: 16px;
                border-color: transparent;
                background: $themeGreyBg;
            }
        }
    }
}
</style>
