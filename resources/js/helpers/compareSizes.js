export default (sizeA, sizeB) => {
    const isNumerical = isFinite(sizeA)
    if (isNumerical) return parseInt(b) - parseInt(a)

    // Alphanumeric
    const aCode = sizeA.toLowerCase()
    const bCode = sizeB.toLowerCase()
    if (aCode == 'xxs') return -1
    if (aCode == 'xs' && !['xxs'].includes(bCode)) return -1
    if (aCode == 's' && !['xxs', 'xs'].includes(bCode)) return -1
    if (aCode == 'm' && !['xxs', 'xs', 's'].includes(bCode)) return -1
    if (aCode == 'l' && !['xxs', 'xs', 's', 'm'].includes(bCode)) return -1
    if (aCode == 'xl' && !['xxs', 'xs', 's', 'm', 'l'].includes(bCode)) return -1
    if (aCode == 'xxl' && !['xxs', 'xs', 's', 'm', 'l', 'xl'].includes(bCode)) return -1
    if (aCode == 'xxxl' && !['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].includes(bCode)) return -1
    return 1
}
