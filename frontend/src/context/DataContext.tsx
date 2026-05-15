import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

export interface Company {
  id: number
  name: string
  legalNumber: string
  country: string
  website: string
}

export interface Product {
  id: number
  name: string
  category: string
  amount: number
  unit: string
  companyId: number
}

interface DataContextType {
  companies: Company[]
  products: Product[]
  loading: boolean
  addCompany: (company: Omit<Company, 'id'>) => Promise<void>
  editCompany: (id: number, updated: Partial<Company>) => Promise<void>
  deleteCompany: (id: number) => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  editProduct: (id: number, updated: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      if (!isAuthenticated) return
      
      try {
        setLoading(true)
        const [companiesRes, productsRes] = await Promise.all([
          api.get('/companies'),
          api.get('/products'),
        ])
        setCompanies(companiesRes.data)
        setProducts(productsRes.data)
      } catch (error) {
        console.error('Veri çekme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [isAuthenticated])

  const addCompany = async (company: Omit<Company, 'id'>) => {
    const { data } = await api.post('/companies', company)
    setCompanies(prev => [...prev, data])
  }

  const editCompany = async (id: number, updated: Partial<Company>) => {
    const { data } = await api.put(`/companies/${id}`, updated)
    setCompanies(prev => prev.map(c => c.id === id ? data : c))
  }

  const deleteCompany = async (id: number) => {
    await api.delete(`/companies/${id}`)
    setCompanies(prev => prev.filter(c => c.id !== id))
    setProducts(prev => prev.filter(p => p.companyId !== id))
  }

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { data } = await api.post('/products', product)
    setProducts(prev => [...prev, data])
  }

  const editProduct = async (id: number, updated: Partial<Product>) => {
    const { data } = await api.put(`/products/${id}`, updated)
    setProducts(prev => prev.map(p => p.id === id ? data : p))
  }

  const deleteProduct = async (id: number) => {
    await api.delete(`/products/${id}`)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <DataContext.Provider value={{ companies, products, loading, addCompany, editCompany, deleteCompany, addProduct, editProduct, deleteProduct }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}