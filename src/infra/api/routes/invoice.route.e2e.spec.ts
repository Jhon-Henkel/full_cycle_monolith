import request from "supertest"
import {app, sequelize} from "../express"

beforeAll(async () => {
    await sequelize.sync()
})

const product = {
    name: "Sample Product",
    description: "This is a sample product.",
    stock: 10,
    price: 188,
}

const client = {
    name: "John Doe",
    email: "johndoe@example.com",
    document: "123456789",
    address: "123 Elm Street",
    street: "123 Elm Street",
    number: "45A",
    complement: "Apt 10",
    city: "Some City",
    state: "CA",
    zipCode: "90210",
}

describe("Invoice", () => {
    it("should respond with 200 and the found invvoice", async () => {
        const clientResponse = await request(app).post("/clients").send(client)
        const productResponse = await request(app)
            .post("/products")
            .send(product)

        const checkout = {
            clientId: clientResponse.body.id,
            products: [{productId: productResponse.body.id}],
        }

        const checkoutResponse = await request(app)
            .post("/checkout")
            .send(checkout)

        await request(app)
            .get(`/invoice/${checkoutResponse.body.invoiceId}`)
            .set("Accept", "application/json")
            .send()
            .expect(({body}) => {
                expect(body.id).toEqual(expect.any(String))
                expect(body.name).toEqual(client.name)
                expect(body.document).toEqual(client.document)
                expect(body.address).toEqual(expect.any(Object))
                expect(body.items).toEqual([
                    {
                        name: product.name,
                        price: 188,
                    },
                ])
                expect(body.total).toEqual(1)
                expect(body.createdAt).toEqual(expect.any(String))
            })
    })

    it("should respond with 500 when there is an error getting the invoice", async () => {
        await request(app)
            .get(`/invoice/invalid-id`)
            .set("Accept", "application/json")
            .send()
            .expect(500)
    })
})