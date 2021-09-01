export default (assortments, size, precision) => {
    const maxSize = parseInt(precision ? size + precision : size)
    const combinations = []

    if (!assortments || !size) return combinations

    // Generate the base combo
    const baseCombo = {}
    for (const assortment of assortments) {
        baseCombo[assortment.name] = 0
    }

    // Helper function
    function findExistingCombo(combo) {
        return !!combinations.find(exinstingCombo => JSON.stringify(exinstingCombo) == JSON.stringify(combo))
    }

    let moreCombinationsLeft = true
    while (moreCombinationsLeft) {
        let combo = JSON.parse(JSON.stringify(baseCombo))
        let comboSize = 0

        for (const assortment of assortments) {
            const boxSize = parseInt(assortment.box_size)

            // Create a clone of the current state of our combo to use as a basis for simulating adding the current assortment to it
            let resultingCombo = JSON.parse(JSON.stringify(combo))

            // Add the current assortment to simulat the newCombo
            resultingCombo[assortment.name]++

            let resultingComboAlreadyAdded = findExistingCombo(resultingCombo)
            let resultingSize = comboSize + boxSize

            while (resultingSize <= maxSize && !resultingComboAlreadyAdded) {
                combo[assortment.name]++
                comboSize += boxSize

                // Recalculate resulting combo
                resultingCombo = JSON.parse(JSON.stringify(combo))
                resultingCombo[assortment.name]++
                resultingComboAlreadyAdded = findExistingCombo(resultingCombo)
                resultingSize = comboSize + boxSize
            }
        }

        // BREAK If we didn't add any assortments
        if (comboSize == 0) {
            moreCombinationsLeft = false
        } else {
            // Push our combo to our result array
            combinations.push(combo)
            // Reset the loop
            combo = JSON.parse(JSON.stringify(baseCombo))
            comboSize = 0
        }
    }

    // return combinations

    // Filter the combinations based on the precision
    return combinations.filter(combination => {
        let combinationSize = 0
        Object.keys(combination).map(assortmentName => {
            // Find the assortment
            const assortment = assortments.find(assortment => assortment.name == assortmentName)
            if (!assortment) {
                console.log('something has gone wrong')
                return
            }
            const pcs = combination[assortmentName]
            combinationSize += pcs * parseInt(assortment.box_size)
        })
        return combinationSize > size - precision && combinationSize < size + precision
    })
}
