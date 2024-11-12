import AddClientUseCase from "./add-client.usecase"

const mockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    }
}

describe('AddClientUseCase unit test', () => {
    it('should add a client', async () => {
        const repository = mockRepository()
        const useCase = new AddClientUseCase(repository)

        const input = {
            name: 'Client 1',
            email: 'x@x.com',
            address: 'Address 1',
        }

        const result = await useCase.execute(input)

        expect(repository.add).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(input.name)
        expect(result.email).toEqual(input.email)
        expect(result.address).toEqual(input.address)
    })
})