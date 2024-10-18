import { GraphQLScalarType } from 'graphql'

const jsonConversion = (value?: unknown): unknown => {
    console.log(typeof value)
    if (typeof value === 'string') {
        value = JSON.parse(value)
    } else if (
        (typeof value !== 'object' && !Array.isArray(value)) ||
        value === null
    ) {
        throw new TypeError(`JSONObject cannot represent non-object value`)
    }
    console.log(typeof value)
    console.log(value)
    return value
}

export const jsonScalar = new GraphQLScalarType({
    name: 'JSON',
    description: 'Custom scalar for JSON Object and Array',
    serialize: jsonConversion,
    parseValue: jsonConversion
})
