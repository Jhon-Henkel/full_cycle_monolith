import Product from "../domain/product.entity"

export interface AddProductFacadeInputDTO {
    id?: string
    name: string
    description: string
    price: number
    stock: number
}

export interface CheckStockFacadeInputDTO {
    productId: string
}

export interface CheckStockFacadeOutputDTO {
    id: string
    stock: number
}

export default interface ProductAdmFacadeInterface {
    addProduct(product: AddProductFacadeInputDTO): Promise<void>
    checkStock(id: CheckStockFacadeInputDTO): Promise<CheckStockFacadeOutputDTO>
}