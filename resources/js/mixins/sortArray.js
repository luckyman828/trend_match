export default {
    methods: {
        sortArray(array, sortAsc, key) {
            const dataSorted = array.sort((a, b) => {
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
            })
            return dataSorted
        },
    },
}
