import ProductGateway from "../../gateway/product.gateway"
import {FindProductInputDto, FindProductOutputDto} from "./find-product.dto"

export default class FindProductUseCase {
    constructor(private readonly ProductRepository: ProductGateway) {}

    async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {
        const product = await this.ProductRepository.find(input.id)
        return {
            id: product.id.value,
            name: product.name,
            description: product.description,
            salePrice: product.salesPrice
        }
    }
}