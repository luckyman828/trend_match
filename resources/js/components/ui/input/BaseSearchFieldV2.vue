<template>
    <div
        class="search flex-list center-v"
        :class="{ empty: searchString.length <= 0 }"
        v-observe-visibility="focusOnMount && onVisibilityChanged"
        @click="setFocus"
    >
        <i class="search-icon far fa-search"></i>
        <input
            class="lh-min"
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
        <div class="true-square dark xs hotkey ghost" v-if="hotkeyEnabled">S</div>
        <button
            class="clear invisible circle sm"
            @click.stop="
                clear()
                setFocus()
            "
        >
            <i class="far fa-times-circle"></i>
        </button>
    </div>
</template>

<script>
import getUniqueObjectValuesByKey from '../../../helpers/getUniqueObjectValuesByKey'
export default {
    name: 'SearchFieldV2',
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
        hotkeyEnabled: false,
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

            return resultsToReturn
        },
        hotkeyHandler(e) {
            console.log('hotkey', e)
            const key = e.code
            if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT') return

            // Focus search
            if (key == 'KeyS') {
                e.preventDefault()
                this.setFocus()
            }
        },
    },
    mounted() {
        if (this.focusOnMount) {
            this.setFocus()
        }
    },
    created() {
        if (this.hotkeyEnabled) {
            document.addEventListener('keydown', this.hotkeyHandler)
        }
        if (this.arrayToSearch) {
            this.$emit('input', this.getResult())
        }
    },
    destroyed() {
        if (this.hotkeyEnabled) {
            document.removeEventListener('keydown', this.hotkeyHandler)
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.search {
    position: relative;
    background: $themeGreyBg;
    border: solid 2px transparent;
    border-radius: 50px;
    padding: 4px 4px 4px 12px;
    overflow: hidden;
    cursor: text;
    height: 32px;
    .search-icon {
        transition: 0.2s ease-out;
        margin-right: 4px;
        color: $dark100;
    }
    .hotkey {
        transition: 0.2s ease-out;
    }
    &.empty,
    &.empty:focus-within {
        .clear {
            display: none;
        }
    }
    &:not(.empty) {
        .hotkey {
            display: none;
        }
    }
    .clear {
        &:hover {
            i {
                font-weight: 900;
            }
        }
    }
    &::v-deep {
        &:focus-within {
            background: $themeWhiteBg;
            border-color: $primary;
            .search-icon {
                opacity: 0;
            }
            .search-icon,
            input {
                transform: translateX(-20px);
            }
            input {
                color: $font;
            }
            .hotkey {
                transform: translateX(20px);
                opacity: 0;
            }
        }
        input {
            border: none;
            background: none;
            transition: 0.2s ease-out;
            font-size: 12px;
            font-weight: 700;
            color: $bluegrey700;
            width: 100%;
            &:focus {
                outline: none;
                border: none;
            }
        }
    }
}
</style>
