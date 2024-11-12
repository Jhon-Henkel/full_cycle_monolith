import ClientGateway from "../../gateway/client.gateway"
import {AddClientUseCaseInputDto, AddClientUseCaseOutputDto} from "./add-client.usecase.dto"
import Client from "../../domain/client.entity"

export default class AddClientUseCase {
    private _clientRepository: ClientGateway

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository
    }

    async execute(input: AddClientUseCaseInputDto): Promise<AddClientUseCaseOutputDto> {
        const props = {
            name: input.name,
            email: input.email,
            address: input.address,
        }

        const client = new Client(props)
        await this._clientRepository.add(client)

        return {
            id: client.id.value,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        }
    }
}