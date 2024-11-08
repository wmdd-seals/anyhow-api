import { GraphQLScalarType } from 'graphql'

const dateConversion = (value?: unknown): unknown => {
    if (value instanceof Date) {
        return value.getTime()
    } else if (typeof value === 'number') {
        return new Date(value)
    }

    throw new TypeError(`Invalid Date Type`)
}

export const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Custom scalar for Date Object',
    serialize: dateConversion,
    parseValue: dateConversion
})
