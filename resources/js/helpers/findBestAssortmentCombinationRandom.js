export default (assortments, desiredSizeSplit, desiredSize, precision, iterations) => {
    const maxSize = precision ? parseInt(desiredSize) + precision : parseInt(desiredSize)

    if (!assortments || !desiredSizeSplit) return

    // Generate the base combo
    const baseCombo = {}
    for (const assortment of assortments) {
        baseCombo[assortment.name] = 0
    }

    function generateCombination() {
        let combo = JSON.parse(JSON.stringify(baseCombo))
        let comboSize = 0
        let comboBoxCount = 0
        const comboSizeSplit = {}

        // Start picking random assortments
        while (comboSize <= maxSize) {
            // Pick a random assortment
            const assortment = assortments[Math.floor(Math.random() * assortments.length)]
            if (comboSize + assortment.box_size > maxSize) break
            comboSize += assortment.box_size
            combo[assortment.name]++
            comboBoxCount++
            for (const assortmentSize of assortment.sizeQuantities) {
                if (comboSizeSplit[assortmentSize.size] != null) {
                    comboSizeSplit[assortmentSize.size] += parseInt(assortmentSize.quantity)
                } else {
                    comboSizeSplit[assortmentSize.size] = parseInt(assortmentSize.quantity)
                }
            }
        }
        // Calculate the diff of the combo
        let comboDiff = 0
        for (const sizeName of Object.keys(comboSizeSplit)) {
            const matchingSize = desiredSizeSplit.find(x => x.name == sizeName)
            const desiredQuantity = matchingSize ? matchingSize.qty : 0
            // console.log(
            //     'calculate diff',
            //     comboSizeSplit,
            //     comboSizeSplit[sizeName],
            //     desiredQuantity,
            //     Math.abs(comboSizeSplit[sizeName] - desiredQuantity)
            // )
            comboDiff += Math.abs(comboSizeSplit[sizeName] - desiredQuantity)
        }

        return { combination: combo, diff: comboDiff, boxCount: comboBoxCount, sizeSplit: comboSizeSplit }
    }

    let bestCombination = generateCombination()

    // for (let i = 0; i < iterations; i++) {
    //     // Generate a random combination
    //     const contender = generateCombination()

    //     // Compare the new combination to our current best to see if it is better
    //     if (contender.diff < bestCombination.diff || contender.boxCount == bestCombination.boxCount) {
    //         bestCombination = contender
    //     }
    // }
    let attemptCount = 1
    while (bestCombination.diff > precision && attemptCount < 300) {
        attemptCount++
        // Generate a random combination
        const contender = generateCombination()

        // Compare the new combination to our current best to see if it is better
        if (contender.diff < bestCombination.diff || contender.boxCount == bestCombination.boxCount) {
            bestCombination = contender
        }
    }
    console.log('Attemps used:', attemptCount)

    return bestCombination
}
