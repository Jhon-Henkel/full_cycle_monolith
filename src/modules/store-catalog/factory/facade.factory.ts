import ProductRepository from "../repository/product.repository"
import FindProductUseCase from "../usecase/find-product/find-product.usecase"
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase"
import StoreCatalogFacade from "../facade/store-catalog.facade"

export default class StoreCatalogFacadeFactory {
    static create(): StoreCatalogFacade {
        const repository = new ProductRepository();
        const findUseCase = new FindProductUseCase(repository);
        const findAllUseCase = new FindAllProductsUseCase(repository);

        return new StoreCatalogFacade({findUseCase: findUseCase, findAllUseCase: findAllUseCase});
    }
}