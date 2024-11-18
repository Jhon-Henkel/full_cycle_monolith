import {Sequelize} from "sequelize-typescript"
import {ClientModel} from "./client.model"
import ClientRepository from "./client.repository"
import Client from "../domain/client.entity"
import Id from "../../@shared/domain/value-object/id.value-object"

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

    it('should add a client', async () => {
        const client = new Client({
            id: new Id('1'),
            name: 'Client 1',
            email: 'x@x.com',
            address: 'Rua 1',
        })

        const repository = new ClientRepository()
        await repository.add(client)

        const result = await ClientModel.findOne({where: {id: '1'}, raw: true})
        expect(result).toBeDefined()
        expect(result.id).toBe(client.id.value)
        expect(result.name).toBe(client.name)
        expect(result.email).toBe(client.email)
        expect(result.address).toBe(client.address)
        expect(result.createdAt).toBeDefined()
        expect(result.updatedAt).toBeDefined()
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