export default {
    methods: {
        sortArray(array, sortAsc, key) {
            const dataSorted = array.sort((a, b) => {
                // Sort by multiple keys
                if (Array.isArray(key)) {
                    let returnValue = 0
                    key.forEach(theKey => {
                        // Check that we have not already found a tie-breaker
                        if (returnValue != 0) {
                            console.log('return early')
                            return sortAsc ? returnValue : returnValue * -1
                        }
                        // console.log(a[theKey])
                        // console.log(b[theKey])

                        // If both a and b has a key
                        if (a[theKey] && b[theKey]) {
                            // If the keys are arrays - sort by their length
                            if (Array.isArray(a[theKey])) {
                                if (a[theKey].length > b[theKey].length) returnValue = 1
                                if (a[theKey].length < b[theKey].length) returnValue = -1
                            }

                            // If the keys are not arrays - sort by the key
                            else {
                                const aKey = typeof a[theKey] == 'string' ? a[theKey].toLowerCase() : a[theKey]
                                const bKey = typeof b[theKey] == 'string' ? b[theKey].toLowerCase() : b[theKey]
                                if (aKey > bKey) returnValue = 1
                                if (aKey < bKey) returnValue = -1
                            }
                        }

                        // If only A has a key
                        if (a[theKey] && !b[theKey]) {
                            returnValue = 1
                        }

                        // If only B has a key
                        if (!a[theKey] && b[theKey]) {
                            returnValue = -1
                        }
                    })

                    // If nothing else, return the result
                    return sortAsc ? returnValue : returnValue * -1
                }

                // Sort by single key
                else {
                    // If a has a key
                    if (a[key]) {
                        if (!b[key]) {
                            //If B does not have a key
                            return sortAsc ? 1 : -1
                        }
                        // If the keys are arrays - sort by their length
                        if (Array.isArray(a[key])) {
                            if (sortAsc) return a[key].length > b[key].length ? 1 : -1
                            else return a[key].length < b[key].length ? 1 : -1
                        }

                        // If the keys are not arrays - sort by the key
                        else {
                            const aKey = typeof a[key] == 'string' ? a[key].toLowerCase() : a[key]
                            const bKey = typeof b[key] == 'string' ? b[key].toLowerCase() : b[key]
                            if (sortAsc) return aKey > bKey ? 1 : -1
                            else return aKey < bKey ? 1 : -1
                        }
                    } else {
                        if (!a[key] && !b[key]) {
                            // If neither A nor B has the key, don't sort them.
                            return 0
                        } else {
                            // If a has no key, put it in the back
                            return sortAsc ? -1 : 1
                        }
                    }
                }
            })
            return dataSorted
        },
    },
}
