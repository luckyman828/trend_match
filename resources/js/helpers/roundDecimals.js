export default function roundDecimals(value, decimalCount) {
    const amountOfDecimals = decimalCount != null ? decimalCount : 0
    return Number(Math.round(value + `e${amountOfDecimals}`) + `e-${amountOfDecimals}`)
}
