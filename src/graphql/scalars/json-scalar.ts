import { GraphQLScalarType } from 'graphql'

const jsonConversion = (value?: unknown): unknown => {
    if (typeof value === 'string') {
        value = JSON.parse(value)
    } else if (typeof value !== 'object' || !Array.isArray(value)) {
        console.log(Array.isArray(value))
        console.log(value)
        throw new TypeError(`JSONObject cannot represent non-object value`)
    }

    return value
}

export const jsonScalar = new GraphQLScalarType({
    name: 'JSON',
    description: 'Custom scalar for JSON Object and Array',
    serialize: jsonConversion,
    parseValue: jsonConversion
})
