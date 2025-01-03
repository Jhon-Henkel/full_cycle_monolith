import {AddProductInputDto, AddProductOutputDto} from "./add-product.dto"
import Product from "../../domain/product.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"
import ProductGateway from "../../gateway/product.gateway"

export default class AddProductUseCase {
    private _productRepository: ProductGateway

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository
    }

    async execute(input: AddProductInputDto): Promise<AddProductOutputDto> {
        const props = {
            id: new Id(input.id),
            name: input.name,
            description: input.description,
            price: input.price,
            stock: input.stock
        }

        const product = new Product(props)
        await this._productRepository.add(product)

        return {
            id: product.id.value,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }
    }
}