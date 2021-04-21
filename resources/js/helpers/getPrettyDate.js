import { DateTime } from 'luxon'
export default (date, style) => {
    if (!date) return ''
    if (!style) {
        return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('MMMM yyyy')
    }
    if (style == 'short') {
        return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('MMM yy')
    }
    if (style == 'medium') {
        return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('MMM yyyy')
    }

    return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('MMMM yyyy')
}
