export default {
    methods: {
        selectRange(index, fullArr, selectedArr) {
            // Find the lowest currently selected index
            let lowestIndex = index
            let highestIndex = index
            selectedArr.map(item => {
                const itemIndex = fullArr.findIndex(x => x.id == item.id)
                if (itemIndex >= 0 && itemIndex < lowestIndex) lowestIndex = itemIndex
                if (itemIndex >= 0 && itemIndex > highestIndex) highestIndex = itemIndex
            })
            // select all teams from the lowest index to the highest index
            const newArr = fullArr.slice(lowestIndex, highestIndex + 1)
            selectedArr.splice(0, selectedArr.length, ...newArr)
            return newArr
        },
    },
}
