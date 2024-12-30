import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "../domain/client.entity"
import Order from "../domain/order.entity"
import Product from "../domain/product.entity"
import CheckoutGateway from "../gateway/checkout.gateway"
import {CheckoutOrderModel} from "./checkout-order.model"
import {CheckoutProductModel} from "./checkout-product.model"

export default class CheckoutRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        const transaction = await CheckoutOrderModel.sequelize.transaction()
        try {
            await CheckoutOrderModel.create(
                {
                    id: order.id.value,
                    clientId: order.client.id.value,
                    status: order.status,
                },
                {transaction},
            )
            await Promise.all(
                order.products.map(async (product: Product) => {
                    await CheckoutProductModel.create(
                        {
                            id: product.id.value,
                            orderId: order.id.value,
                            name: product.name,
                            price: product.price,
                            description: product.description,
                        },
                        {transaction},
                    )
                }),
            )
            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }

    async findOrder(id: string): Promise<Order | null> {
        const order = await CheckoutOrderModel.findOne({
            where: {id},
            include: {all: true},
            raw: true
        })

        if (!order) {
            throw new Error("Order not found")
        }

        return new Order({
            id: new Id(order.id),
            status: order.status,
            client: new Client({
                id: new Id(order.client.id),
                name: order.client.name,
                email: order.client.email,
                address: order.client.street,
                document: order.client.document,
                street: order.client.street,
                number: order.client.number,
                complement: order.client.complement,
                city: order.client.city,
                state: order.client.state,
                zipCode: order.client.zipCode,
            }),
            products: order.products.map(
                (product: CheckoutProductModel) =>
                    new Product({
                        id: new Id(product.id),
                        name: product.name,
                        price: product.price,
                        description: product.description,
                    }),
            ),
        })
    }
}