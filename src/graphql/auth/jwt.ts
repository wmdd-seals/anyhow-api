import { createSecretKey } from 'crypto'
import { jwtVerify, SignJWT, type JWTPayload } from 'jose'

const secret = createSecretKey(process.env.JWT_SECRET!, 'utf-8')

export const generateToken = async (payload: JWTPayload): Promise<string> => {
    const token = await new SignJWT(payload)
        .setProtectedHeader({
            alg: 'HS256'
        })
        .setIssuer(process.env.JWT_ISSUER!)
        .setAudience(process.env.JWT_AUDIENCE!)
        .setExpirationTime(process.env.JWT_EXPIRATION_TIME!)
        .sign(secret)

    return token
}

export const verifyToken = async (token: string): Promise<string> => {
    try {
        if (!token) return ''

        const result = await jwtVerify(token, secret, {
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE
        })

        return typeof result.payload.userid === 'string'
            ? result.payload.userid
            : ''
    } catch (e) {
        console.error(e)
    }

    return 'Invalid token'
}
