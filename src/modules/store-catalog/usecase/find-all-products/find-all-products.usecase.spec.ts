import Product from "../../domain/product.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"
import FindAllProductsUseCase from "./find-all-products.usecase"

const product = new Product({
    id: new Id("1"),
    name: 'Product 1',
    description: 'Product 1 description',
    salesPrice: 100
})

const product2 = new Product({
    id: new Id("2"),
    name: 'Product 2',
    description: 'Product 2 description',
    salesPrice: 200
})

const mockRepository = {
    findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
    find: jest.fn()
}

describe('find all products use case', () => {
    it('find all products', async () => {
        const useCase = new FindAllProductsUseCase(mockRepository)
        const result = await useCase.execute()

        expect(mockRepository.findAll).toHaveBeenCalled()
        expect(result.products).toEqual([
            {
                id: '1',
                name: 'Product 1',
                description: 'Product 1 description',
                salesPrice: 100
            },
            {
                id: '2',
                name: 'Product 2',
                description: 'Product 2 description',
                salesPrice: 200
            }
        ])
    })
})