export default (object, key) => {
    const keyParts = key.split('.')
    const values = []
    let lastKeyObjects = [object]
    keyParts.map((keyPart, index) => {
        // Test if this is the last key
        const isLast = index == keyParts.length - 1
        let keyObjects = []

        lastKeyObjects.map(keyObject => {
            const keyObjectValues = Array.isArray(keyObject[keyPart]) ? keyObject[keyPart] : [keyObject[keyPart]]
            if (isLast) {
                const uniqueValues = keyObjectValues.filter(value => value != null && !values.includes(value))
                values.push(...uniqueValues)
            } else {
                keyObjects.push(...keyObjectValues)
            }
        })

        lastKeyObjects = keyObjects
    })
    return values
}
