export interface User {
    id: number
    username: string
    password: string
}

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

export interface AuthRequest extends Request {
    user?: {
        id: number
        username: string
    }
}

export interface JwtPayload {
    id: number
    username: string
}