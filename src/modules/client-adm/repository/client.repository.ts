import ClientGateway from "../gateway/client.gateway"
import Client from "../domain/client.entity"
import {ClientModel} from "./client.model"
import Id from "../../@shared/domain/value-object/id.value-object"

export default class ClientRepository implements ClientGateway {
    async find(id: string): Promise<Client> {
        const client = await ClientModel.findOne({where: {id}, raw: true})
        if (!client) {
            throw new Error('Client not found')
        }
        return new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt
        })
    }

    async add(client: Client): Promise<void> {
        await ClientModel.create({
            id: client.id.value,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }
}