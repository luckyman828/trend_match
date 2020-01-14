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
                    // If the keys have lengths - sort by their length
                    if (a[key].length) {
                        if (sortAsc) return a[key].length > b[key].length ? 1 : -1
                        else return a[key].length < b[key].length ? 1 : -1
                    }

                    // If the keys don't have length - sort by the key
                    else {
                        if (sortAsc) return a[key] > b[key] ? 1 : -1
                        else return a[key] < b[key] ? 1 : -1
                    }
                } else {
                    if (!a[key] && !b[key]) {
                        // If neither A nor B has the key, don't sort them.
                        return 0
                    } else {
                        // If a has no key, but it in the back
                        return sortAsc ? -1 : 1
                    }
                }
            })
            return dataSorted
        },
    },
}
