import {
    GraphQLScalarType,
    Kind,
    type ValueNode,
    type ObjectValueNode,
    type ObjectFieldNode
} from 'graphql'

const identity = (value: unknown): unknown => {
    return typeof value === 'object' ? value : null
}

export const jsonScalar = new GraphQLScalarType({
    name: 'JSON',
    description: 'Custom scalar for JSON Object and Array',
    serialize: identity,
    parseValue: identity,
    parseLiteral: (ast): unknown => {
        // Parse JSON object or array from AST
        switch (ast.kind) {
            case Kind.OBJECT:
                return parseAST(ast)
            case Kind.LIST:
                return ast.values.map(parseLiteralValue)
            default:
                return null
        }
    }
})

// Helper function to parse AST for JSON objects
const parseAST = (ast: ObjectValueNode): unknown => {
    const result: { [key: string]: unknown } = {}
    ast.fields.forEach((field: ObjectFieldNode) => {
        result[field.name.value] = parseLiteralValue(field.value)
    })
    return result
}

// Helper function to parse literal values
const parseLiteralValue = (valueNode: ValueNode): unknown => {
    switch (valueNode.kind) {
        case Kind.STRING:
            return valueNode.value
        case Kind.INT:
            return parseInt(valueNode.value, 10)
        case Kind.FLOAT:
            return parseFloat(valueNode.value)
        case Kind.BOOLEAN:
            return valueNode.value
        case Kind.OBJECT:
            return parseAST(valueNode)
        case Kind.LIST:
            return valueNode.values.map(parseLiteralValue)
        default:
            return null
    }
}
