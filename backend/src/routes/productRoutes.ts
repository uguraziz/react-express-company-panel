import { Router, Response } from 'express'
import { products, companies } from '../data/store'
import { Product } from '../types'
import authMiddleware, { AuthRequest } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', (req: AuthRequest, res: Response): void => {
    res.json(products)
})

router.post('/', (req: AuthRequest, res: Response): void => {
    const { name, category, amount, unit, companyId } = req.body

    if (!name || !category || !amount || !unit || !companyId) {
        res.status(400).json({ message: 'Tüm alanlar gerekli' })
        return
    }

    const companyExists = companies.find(c => c.id === companyId)
    if (!companyExists) {
        res.status(404).json({ message: 'Seçilen şirket bulunamadı' })
        return
    }

    const newProduct: Product = {
        id: Date.now(),
        name,
        category,
        amount: Number(amount),
        unit,
        companyId: Number(companyId),
    }

    products.push(newProduct)
    res.status(201).json(newProduct)
})

router.put('/:id', (req: AuthRequest, res: Response): void => {
    const id = parseInt(req.params.id as string)
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        res.status(404).json({ message: 'Ürün bulunamadı' })
        return
    }

    products[index] = { ...products[index], ...req.body }
    res.json(products[index])
})

router.delete('/:id', (req: AuthRequest, res: Response): void => {
    const id = parseInt(req.params.id as string)
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        res.status(404).json({ message: 'Ürün bulunamadı' })
        return
    }

    products.splice(index, 1)
    res.json({ message: 'Ürün silindi' })
})

export default router