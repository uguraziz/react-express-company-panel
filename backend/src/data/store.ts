import { User, Company, Product } from '../types'
import bcrypt from 'bcryptjs'

export const users: User[] = [
    { id: 1, username: 'admin', password: bcrypt.hashSync('123456', 10) },
    { id: 2, username: 'test', password: bcrypt.hashSync('123456', 10) },
]

export const companies: Company[] = [
    { id: 1, name: 'Arçelik A.Ş.', legalNumber: '0001234567', country: 'Türkiye', website: 'https://www.arcelik.com.tr' },
    { id: 2, name: 'Trendyol Group', legalNumber: '0009876543', country: 'Türkiye', website: 'https://www.trendyol.com' },
    { id: 3, name: 'Peak Games', legalNumber: '0004561234', country: 'Türkiye', website: 'https://www.peakgames.net' },
]

export const products: Product[] = [
    { id: 1, name: 'Bulaşık Makinesi', category: 'Beyaz Eşya', amount: 150, unit: 'Adet', companyId: 1 },
    { id: 2, name: 'Çamaşır Makinesi', category: 'Beyaz Eşya', amount: 200, unit: 'Adet', companyId: 1 },
    { id: 3, name: 'Premium Üyelik', category: 'Dijital Servis', amount: 5000, unit: 'Lisans', companyId: 2 },
    { id: 4, name: 'Toy Blast', category: 'Mobil Oyun', amount: 1, unit: 'Uygulama', companyId: 3 },
]