export interface CheckStockInputDto {
    productId: string
}

export interface CheckStockOutputDto {
    id: string
    stock: number
}