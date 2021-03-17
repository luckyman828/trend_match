export async function getWeightedSplit(qty, sizes, weights) {
    // First instantiate an array of size objects and match the sizes with their respective weights
    const split = sizes.map(size => {
        const weightObj = weights && weights.find(x => x.name == size.size)
        const weight = weightObj ? weightObj.weight : 1
        return {
            weight,
            name: size.size,
            qty: 0,
        }
    })
    const totalWeight = split.reduce((acc, curr) => (acc += curr.weight), 0)
    // Then simply divide the qty by the weights
    const divideQtyByWeights = (qtyToSplit, isSubtract) => {
        split.map(splitObj => {
            // Find the qty for the size as the weightet fraction of it's weight
            const diff = Math.round((qtyToSplit / totalWeight) * splitObj.weight)
            if (isSubtract) splitObj.qty -= diff
            else splitObj.qty += diff
        })
    }
    divideQtyByWeights(qty)
    const calculateLeftover = () => {
        const total = split.reduce((acc, curr) => (acc += curr.qty), 0)
        return total - qty
    }
    let leftover = calculateLeftover()
    if (leftover > 0) {
        // Subtract the leftover from the size with the lowest weight
        const lowestWeight = split.reduce((currentLowest, curr) => {
            return curr.weight < currentLowest.weight && curr.qty > 0 ? curr : currentLowest
        }, split[0])
        lowestWeight.qty -= leftover
    }
    if (leftover < 0) {
        // Subtract the leftover from the size with the lowest weight
        const highestWeight = split.reduce((currentHighest, curr) => {
            return curr.weight > currentHighest.weight ? curr : currentHighest
        }, split[0])
        highestWeight.qty += Math.abs(leftover)
    }
    // Leftover should be 0 now
    leftover = calculateLeftover()
    if (leftover != 0) {
        console.log('Error in size split! Leftover not equal to 0. Leftover:', leftover)
    }
    return split
}
