import {Sequelize} from "sequelize-typescript"
import {CheckoutOrderModel} from "./checkout-order.model"
import {CheckoutProductModel} from "./checkout-product.model"
import Order from "../domain/order.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import {ClientModel} from "../../client-adm/repository/client.model"
import Client from "../domain/client.entity"
import Product from "../domain/product.entity"
import CheckoutRepository from "./checkout.repository"

const client = {
    id: "1",
    name: "John Doe",
    email: "john@doe.com",
    document: "1234-567",
    address: "Rua 123",
    street: "Rua 123",
    number: "99",
    complement: "Green House",
    city: "Criciúma",
    state: "SC",
    zipCode: "88888-888",
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe("Invoice Repository test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        })

        sequelize.addModels([
            CheckoutOrderModel,
            CheckoutProductModel,
            ClientModel,
        ])
        await sequelize.sync()

        await ClientModel.create(client)
    })

    afterEach(async () => {
        await sequelize.close()
    })

    describe("addOrder", () => {
        it("should add an order and products", async () => {
            const order = new Order({
                id: new Id("123"),
                status: "pending",
                client: new Client({
                    id: new Id(client.id),
                    name: client.name,
                    email: client.email,
                    address: client.street,
                    document: client.document,
                    street: client.street,
                    number: client.number,
                    complement: client.complement,
                    city: client.city,
                    state: client.state,
                    zipCode: client.zipCode,
                }),
                products: [
                    new Product({
                        id: new Id("1"),
                        name: "Product 1",
                        price: 100,
                        description: "Description 1",
                    }),
                    new Product({
                        id: new Id("2"),
                        name: "Product 2",
                        price: 100,
                        description: "Description 2",
                    }),
                ],
            })

            const repository = new CheckoutRepository()
            await repository.addOrder(order)

            const orderDb = await CheckoutOrderModel.findOne({
                where: {id: order.id.value},
                include: {all: true},
                raw: true,
            })

            expect(orderDb).toBeDefined()
            expect(orderDb.id).toEqual(order.id.value)
            expect(orderDb.status).toEqual(order.status)
            expect(orderDb.clientId).toEqual(order.client.id.value)
        })
    })

    test("should throw an error when order is not found", async () => {
        const repository = new CheckoutRepository()
        await expect(repository.findOrder("123")).rejects.toThrow(
            "Order not found",
        )
    })
})