import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/invoice.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"

const invoice = new Invoice({
    id: new Id('1'),
    name: "test name",
    document: "test document",
    address: {
        street: "test street",
        // @ts-ignore
        number: 1234,
        complement: "test complement",
        city: "test city",
        state: "test state",
        zipCode: "test zipCode",
    },
    items: [
        // @ts-ignore
        {
            name: "Product 1",
            price: 100,
        },
        // @ts-ignore
        {
            name: "Product 2",
            price: 200,
        },
    ],
    total: 2,
    createdAt: new Date(),
})

const mockRepository = () => {
    return {
        save: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    }
}

describe('GenerateInvoiceUseCase', () => {
    it('should generate a invoice', async () => {
        const repository = mockRepository()
        const useCase = new FindInvoiceUseCase(repository)

        const result = await useCase.execute({id: '1'})

        expect(result).toEqual({
            id: '1',
            name: "test name",
            document: "test document",
            address: {
                street: "test street",
                number: 1234,
                complement: "test complement",
                city: "test city",
                state: "test state",
                zipCode: "test zipCode",
            },
            items: [
                {
                    name: "Product 1",
                    price: 100,
                },
                {
                    name: "Product 2",
                    price: 200,
                },
            ],
            total: 2,
            createdAt: invoice.createdAt,
        })
    })
})