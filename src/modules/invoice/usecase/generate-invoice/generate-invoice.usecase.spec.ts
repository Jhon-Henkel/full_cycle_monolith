import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const mockRepository = () => {
    return {
        save: jest.fn(),
        find: jest.fn(),
    }
}

describe('GenerateInvoiceUseCase', () => {
    it('should generate a invoice', async () => {
        const repository = mockRepository()
        const useCase = new GenerateInvoiceUseCase(repository)

        const input = {
            name: "test name",
            document: "test document",
            street: "test street",
            number: 1234,
            complement: "test complement",
            city: "test city",
            state: "test state",
            zipCode: "test zipCode",
            items: [
                {
                    id: "11",
                    name: "Product 1",
                    price: 100,
                },
                {
                    id: "22",
                    name: "Product 2",
                    price: 200,
                },
            ]
        }

        // @ts-ignore
        const result = await useCase.execute(input)

        expect(result).toEqual({
            id: expect.any(String),
            name: "test name",
            document: "test document",
            street: "test street",
            number: 1234,
            complement: "test complement",
            city: "test city",
            state: "test state",
            zipCode: "test zipCode",
            items: [
                {
                    id: "11",
                    name: "Product 1",
                    price: 100,
                },
                {
                    id: "22",
                    name: "Product 2",
                    price: 200,
                },
            ],
            total: 2
        })
    })
})