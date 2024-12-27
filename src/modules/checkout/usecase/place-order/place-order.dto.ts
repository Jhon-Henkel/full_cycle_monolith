export interface PlaceOrderInputDTO {
    clientId: string
    products: {
        productId: string
    }[]
}

export interface PlaceOrderOutputDTO {
    orderId: string
    invoiceId: string
    status: string
    total: number
    products: {
        productId: string
    }[]
}