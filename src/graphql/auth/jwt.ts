import * as jose from 'jose'
import * as crypto from 'crypto'

const secret = crypto.createSecretKey(process.env.JWT_SECRET!, 'utf-8')

export const generateToken = async (
    payload: jose.JWTPayload
): Promise<string> => {
    const token = await new jose.SignJWT(payload)
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

        const result = await jose.jwtVerify(token, secret, {
            issuer: 'AnyHow',
            audience: 'AnyHow-Client'
        })

        return typeof result.payload.userid === 'string'
            ? result.payload.userid
            : ''
    } catch (e) {
        console.error(e)
    }

    return 'Invalid token'
}
