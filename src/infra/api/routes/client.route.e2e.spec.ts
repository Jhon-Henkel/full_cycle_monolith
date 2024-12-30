import request from "supertest"
import {app, sequelize} from "../express"

beforeAll(async () => {
    await sequelize.sync()
})

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

describe("Clients", () => {
    it("should respond with 201 and the created client data", async () => {
        await request(app)
            .post("/clients")
            .send(client)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201)
            .expect(({body}) => {
                expect(body.id).toEqual(expect.any(String))
                expect(body.createdAt).toEqual(expect.any(String))
                expect(body.updatedAt).toEqual(expect.any(String))
                expect(body.name).toEqual(client.name)
                expect(body.email).toEqual(client.email)
                expect(body.document).toEqual(client.document)
                expect(body.address).toEqual(client.address)
                expect(body.street).toEqual(client.street)
                expect(body.number).toEqual(client.number)
                expect(body.complement).toEqual(client.complement)
                expect(body.city).toEqual(client.city)
                expect(body.state).toEqual(client.state)
                expect(body.zipCode).toEqual(client.zipCode)
            })
    })

    it("should respond with 500 when client data is invalid", async () => {
        await request(app)
            .post("/clients")
            .send({})
            .set("Accept", "application/json")
            .expect(500)
    })
})