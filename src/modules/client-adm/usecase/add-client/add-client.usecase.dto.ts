export interface AddClientUseCaseInputDto {
    id?: string
    name: string
    email: string
    address: string
    document: string
    street: string
    number: string
    complement: string
    city: string
    state: string
    zipCode: string
}

export interface AddClientUseCaseOutputDto {
    id: string
    name: string
    email: string
    address: string
    document: string
    street: string
    number: string
    complement: string
    city: string
    state: string
    zipCode: string
    createdAt: Date
    updatedAt: Date
}