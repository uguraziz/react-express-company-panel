import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types'

export interface AuthRequest extends Request {
    user?: JwtPayload
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token bulunamadı, erişim reddedildi' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const secret = process.env.JWT_SECRET as string
        const decoded = jwt.verify(token, secret) as JwtPayload
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş' })
    }
}

export default authMiddleware