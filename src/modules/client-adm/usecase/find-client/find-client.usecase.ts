import ClientGateway from "../../gateway/client.gateway"
import {FindClientInputDto, FindClientOutputDto} from "./find-client.usecase.dto"

export default class FindClientUseCase {
    private _clientRepository: ClientGateway

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository
    }

    async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
        const client = await this._clientRepository.find(input.id)

        return {
            id: client.id.value,
            name: client.name,
            email: client.email,
            address: client.address,
            document: client.document,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        }
    }
}