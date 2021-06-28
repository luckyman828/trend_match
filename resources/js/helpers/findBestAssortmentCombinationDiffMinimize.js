export default (assortments, desiredSizeSplit, desiredSize, precision, iterations) => {
    const maxSize = precision ? parseInt(desiredSize) + precision : parseInt(desiredSize)

    if (!assortments || !desiredSizeSplit) return

    // Generate the base combo
    const baseCombo = {}
    for (const assortment of assortments) {
        baseCombo[assortment.name] = 0
    }

    const combo = baseCombo
    let comboSize = 0
    let comboBoxCount = 0
    const comboSizeSplit = {}
    let comboDiff = 0

    // Generate a base sizesplit
    const baseSizeSplit = {}
    desiredSizeSplit.map(sizeQuantity => {
        baseSizeSplit[sizeQuantity.name] = 0
    })

    // Start picking random assortments
    while (comboSize <= maxSize) {
        // Pick a random assortment
        const bestMatch = assortments.reduce(
            (bestMatch, assortment) => {
                // Make the easy test first: Will adding this assortment bring us over our max size
                const testComboSize = comboSize + parseInt(assortment.box_size)
                if (testComboSize > maxSize) return false

                // Try adding the assortment
                // Test how much adding the assortment will reduce our diff
                const testCombo = JSON.parse(JSON.stringify(combo))
                testCombo[assortment.name]++
                const testComboSizeSplit = JSON.parse(JSON.stringify(baseSizeSplit))

                // Calculate the size split of our new combo
                for (const assortmentSize of assortment.sizeQuantities) {
                    if (testComboSizeSplit[assortmentSize.size] != null) {
                        testComboSizeSplit[assortmentSize.size] += parseInt(assortmentSize.quantity)
                    } else {
                        testComboSizeSplit[assortmentSize.size] = parseInt(assortmentSize.quantity)
                    }
                }

                // Calculate the diff of the combo
                let diff = 0
                // for (const sizeQuantity of desiredSizeSplit) {
                //     const desiredQuantity = sizeQuantity.qty
                // }
                for (const sizeName of Object.keys(testComboSizeSplit)) {
                    const matchingSize = desiredSizeSplit.find(x => x.name == sizeName)
                    const desiredQuantity = matchingSize ? matchingSize.qty : 0
                    diff += Math.abs(testComboSizeSplit[sizeName] - desiredQuantity)
                }

                if (!bestMatch || bestMatch.diff > diff) {
                    return { diff, assortment }
                } else {
                    return bestMatch
                }
            },
            { diff: 99999, assortment: null }
        )
        if (!bestMatch) break

        const assortment = bestMatch.assortment

        // Test if adding the assortment would put us over the size limit
        if (comboSize + assortment.box_size > maxSize) break

        // Recalc with the new assortment
        comboSize += assortment.box_size
        combo[assortment.name]++
        comboBoxCount++

        // Calculate the resulting sizesplit
        for (const assortmentSize of assortment.sizeQuantities) {
            if (comboSizeSplit[assortmentSize.size] != null) {
                comboSizeSplit[assortmentSize.size] += parseInt(assortmentSize.quantity)
            } else {
                comboSizeSplit[assortmentSize.size] = parseInt(assortmentSize.quantity)
            }
        }
    }
    // Done creating the combination

    // Calculate the resulting diff
    for (const sizeName of Object.keys(comboSizeSplit)) {
        const matchingSize = desiredSizeSplit.find(x => x.name == sizeName)
        const desiredQuantity = matchingSize ? matchingSize.qty : 0
        comboDiff += Math.abs(comboSizeSplit[sizeName] - desiredQuantity)
    }

    return {
        combination: combo,
        sizeSplit: comboSizeSplit,
        diff: comboDiff,
        boxCount: comboBoxCount,
        quantity: comboSize,
    }
}
