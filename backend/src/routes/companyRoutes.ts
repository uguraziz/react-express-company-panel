import { Router, Response } from 'express'
import { companies, products } from '../data/store'
import { Company } from '../types'
import authMiddleware, { AuthRequest } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', (req: AuthRequest, res: Response): void => {
    res.json(companies)
})

router.post('/', (req: AuthRequest, res: Response): void => {
    const { name, legalNumber, country, website } = req.body

    if (!name || !legalNumber || !country || !website) {
        res.status(400).json({ message: 'Tüm alanlar gerekli' })
        return
    }

    const newCompany: Company = {
        id: Date.now(),
        name,
        legalNumber,
        country,
        website,
    }

    companies.push(newCompany)
    res.status(201).json(newCompany)
})

router.put('/:id', (req: AuthRequest, res: Response): void => {
    const id = parseInt(req.params.id as string)
    const index = companies.findIndex(c => c.id === id)

    if (index === -1) {
        res.status(404).json({ message: 'Şirket bulunamadı' })
        return
    }

    companies[index] = { ...companies[index], ...req.body }
    res.json(companies[index])
})

router.delete('/:id', (req: AuthRequest, res: Response): void => {
    const id = parseInt(req.params.id as string)
    const index = companies.findIndex(c => c.id === id)

    if (index === -1) {
        res.status(404).json({ message: 'Şirket bulunamadı' })
        return
    }

    companies.splice(index, 1)

    const productIndexes = products
        .map((p, i) => p.companyId === id ? i : -1)
        .filter(i => i !== -1)
        .reverse()

    productIndexes.forEach(i => products.splice(i, 1))

    res.json({ message: 'Şirket ve bağlı ürünler silindi' })
})

export default router