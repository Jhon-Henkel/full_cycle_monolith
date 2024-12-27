import Client from "../../domain/client.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"
import AddClientUseCase from "../add-client/add-client.usecase"
import FindClientUseCase from "./find-client.usecase"

const client = new Client(
    {
        id: new Id('1'),
        name: 'client 1',
        email: 'x@x.com',
        address: 'address 1',
        document: '123',
        street: 'street 1',
        number: '1',
        complement: 'complement 1',
        city: 'city 1',
        state: 'state 1',
        zipCode: '123456',
    }
)

const mockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(client)),
    }
}


describe('FindClientUseCase unit test', () => {
    it('should find a client', async () => {
        const repository = mockRepository()
        const useCase = new FindClientUseCase(repository)

        const input = {
            id: '1',
        }

        const result = await useCase.execute(input)

        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toEqual(input.id)
        expect(result.name).toEqual(client.name)
        expect(result.email).toEqual(client.email)
        expect(result.address).toEqual(client.address)
        expect(result.createdAt).toEqual(client.createdAt)
        expect(result.updatedAt).toEqual(client.updatedAt)
    })
})

