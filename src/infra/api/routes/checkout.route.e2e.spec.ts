import request from "supertest"
import {app, sequelize} from "../express"

beforeAll(async () => {
    await sequelize.sync()
})

const product = {
    name: "Sample Product",
    description: "This is a sample product.",
    stock: 50,
    price: 19.99,
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

describe("Checkout", () => {
    it("should respond with 201 and the created checkout data", async () => {
        const clientResponse = await request(app).post("/clients").send(client)
        const productResponse = await request(app).post("/products").send(product)

        const checkout = {
            clientId: clientResponse.body.id,
            products: [{productId: productResponse.body.id}],
        }

        await request(app)
            .post("/checkout")
            .send(checkout)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201)
            .expect(({body}) => {
                expect(body.orderId).toEqual(expect.any(String))
                expect(body.invoiceId).toBeNull()
                expect(body.status).toEqual("pending")
                expect(body.total).toEqual(19.99)
                expect(body.products).toEqual([{productId: productResponse.body.id}])
            })
    })

    it("should respond with 500 when checkout data is invalid", async () => {
        await request(app)
            .post("/checkout")
            .send({})
            .set("Accept", "application/json")
            .expect(500)
    })
})