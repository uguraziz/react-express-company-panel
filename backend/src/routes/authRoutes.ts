import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { users } from '../data/store'
import { User } from '../types'

const router = Router()

router.post('/register', (req: Request, res: Response): void => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({ message: 'Kullanıcı adı ve şifre gerekli' })
        return
    }

    if (password.length < 6) {
        res.status(400).json({ message: 'Şifre en az 6 karakter olmalı' })
        return
    }

    const exists = users.find(u => u.username === username)
    if (exists) {
        res.status(409).json({ message: 'Bu kullanıcı adı zaten alınmış' })
        return
    }

    const newUser: User = {
        id: Date.now(),
        username,
        password: bcrypt.hashSync(password, 10),
    }

    users.push(newUser)
    res.status(201).json({ message: 'Kayıt başarılı' })
})

router.post('/login', (req: Request, res: Response): void => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({ message: 'Kullanıcı adı ve şifre gerekli' })
        return
    }

    const user = users.find(u => u.username === username)
    if (!user) {
        res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' })
        return
    }

    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
        res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' })
        return
    }

    const secret = process.env.JWT_SECRET as string
    const token = jwt.sign(
        { id: user.id, username: user.username },
        secret,
        { expiresIn: '24h' }
    )

    res.json({
        token,
        user: { id: user.id, username: user.username }
    })
})

export default router