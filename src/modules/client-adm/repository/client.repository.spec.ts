import {Sequelize} from "sequelize-typescript"
import {ClientModel} from "./client.model"
import ClientRepository from "./client.repository"

describe('Client repository test', () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        })

        sequelize.addModels([ClientModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it('should find a client', async () => {
        const client = await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'x@x.com',
            address: 'Rua 1',
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const repository = new ClientRepository()
        const result = await repository.find(client.dataValues.id)

        expect(result).not.toBeNull()
        expect(result.id.value).toBe(client.dataValues.id)
        expect(result.name).toBe(client.dataValues.name)
        expect(result.email).toBe(client.dataValues.email)
        expect(result.address).toBe(client.dataValues.address)
    })
})