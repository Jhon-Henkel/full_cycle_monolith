import UseCaseInterface from "../../../@shared/usecase/use-case.interface"
import ProductGateway from "../../gateway/product.gateway"

export default class FindAllProductsUseCase implements UseCaseInterface {
    constructor(private repository: ProductGateway) {
    }

    async execute() {
        const products = await this.repository.findAll()

        return {
            products: products.map(product => ({
                id: product.id.value,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice
            }))
        }
    }
}