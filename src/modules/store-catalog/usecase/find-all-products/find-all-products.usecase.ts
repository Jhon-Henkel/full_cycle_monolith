import UseCaseInterface from "../../../@shared/usecase/use-case.interface"
import ProductGateway from "../../gateway/product.gateway"
import {FindAllProductsDto} from "./find-all-products.dto"

export default class FindAllProductsUseCase implements UseCaseInterface {
    constructor(private repository: ProductGateway) {
    }

    async execute(): Promise<FindAllProductsDto> {
        const products = await this.repository.findAll()

        return {
            products: products.map(product => ({
                id: product.id.value,
                name: product.name,
                description: product.description,
                price: product.price
            }))
        }
    }
}