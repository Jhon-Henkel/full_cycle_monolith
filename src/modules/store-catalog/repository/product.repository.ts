import ProductGateway from "../gateway/product.gateway"
import Product from "../domain/product.entity"
import ProductModel from "./product.model"
import Id from "../../@shared/domain/value-object/id.value-object"

export default class ProductRepository implements ProductGateway {
    async findAll(): Promise<Product[]> {
        const products = await ProductModel.findAll({ raw: true })
        return products.map(product => new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            price: product.price
        }))
    }

    async find(id: string): Promise<Product> {
        const product = await ProductModel.findOne({ where: { id }, raw: true })
        return new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            price: product.price
        })
    }
}