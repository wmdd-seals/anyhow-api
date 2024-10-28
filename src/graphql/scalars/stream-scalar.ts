import { GraphQLScalarType } from 'graphql'
import { Readable } from 'stream'

const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/

const streamConversion = (base64String: unknown): Readable => {
    if (typeof base64String !== 'string' || !base64String.trim()) {
        throw new TypeError('Invalid Base64 string')
    }
    const base64Data = base64String.replace(/^data:.+;base64,/, '')

    if (!isValidBase64(base64Data)) {
        throw new TypeError('Invalid Base64 string format')
    }
    const buffer = Buffer.from(base64Data, 'base64')
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    return stream
}

const isValidBase64 = (str: string): boolean => {
    return base64Regex.test(str) && str.length % 4 === 0
}
export const streamScalar = new GraphQLScalarType({
    name: 'Stream',
    description: 'Base64 to Stream Conversion',
    serialize: streamConversion,
    parseValue: streamConversion
})
