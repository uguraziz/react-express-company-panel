import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import companyRoutes from './routes/companyRoutes'
import productRoutes from './routes/productRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://company-panel.altuntech.com'
    ],
    credentials: true,
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/products', productRoutes)

app.get('/api/health', (_, res) => {
    res.json({ status: 'ok', message: 'Server çalışıyor' })
})

app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`)
})

export default app