const getVancouverOffset = (date: Date, timeZone: string): number => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        timeZoneName: 'shortOffset'
    })
    const parts = formatter.formatToParts(date)
    const offsetPart = parts.find(part => part.type === 'timeZoneName')
    if (offsetPart) {
        const match = offsetPart.value.match(/GMT([+-]\d{2})(\d{2})/)
        if (match) {
            const hours = parseInt(match[1], 10)
            const minutes = parseInt(match[2], 10)
            return hours * 60 + minutes
        }
    }
    return 0
}

export const adjustToUTC = (date: Date, timeZone: string): Date => {
    const offset = getVancouverOffset(date, timeZone)
    return new Date(date.getTime() + offset * 60000)
}
