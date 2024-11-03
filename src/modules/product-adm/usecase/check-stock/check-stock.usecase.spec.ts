import Product from "../../domain/product.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"
import CheckStockUseCase from "./check-stock.usecase"

const product = new Product({
    id: new Id('1'),
    name: 'Product',
    description: 'Description',
    stock: 10,
    purchasePrice: 100
})

const mockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product))
    }
}

describe('CheckStockUseCase unit test', () => {
    it('should get a stock of a product', async () => {
        const productRepository = mockRepository()
        const checkStockUseCase = new CheckStockUseCase(productRepository)
        const input = {
            productId: '1'
        }

        const result = await checkStockUseCase.execute(input)

        expect(productRepository.find).toHaveBeenCalled()
        expect(result.id).toBe('1')
        expect(result.stock).toBe(10)
    })
})