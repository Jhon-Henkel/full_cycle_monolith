import ProductAdmFacade from "../facade/product-adm.facade"
import AddProductUseCase from "../usecase/add-product/add-product.usecase"
import ProductRepository from "../repository/product.repository"

export default class ProductAdmFacadeFactory {
    static create() {
        return new ProductAdmFacade({
            addUseCase: new AddProductUseCase(new ProductRepository()),
            checkStockUseCase: undefined
        })
    }
}