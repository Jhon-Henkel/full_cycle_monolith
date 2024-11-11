import StoreCatalogFacadeInterface, { FindAllStoreCatalogFacadeInterfaceOutputDTO, StoreCatalogFacadeInterfaceInputDTO, StoreCatalogFacadeInterfaceOutputDTO } from "./store-catalog.facade.interface"
import FindProductUseCase from "../usecase/find-product/find-product.usecase"
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase"

export interface UseCaseProps {
    findUseCase: FindProductUseCase;
    findAllUseCase: FindAllProductsUseCase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
    private _findUseCase: FindProductUseCase;
    private _findAllUseCase: FindAllProductsUseCase;

    constructor(props: UseCaseProps) {
        this._findUseCase = props.findUseCase;
        this._findAllUseCase = props.findAllUseCase;
    }

    async find(id: StoreCatalogFacadeInterfaceInputDTO): Promise<StoreCatalogFacadeInterfaceOutputDTO> {
        return await this._findUseCase.execute(id);
    }

    async findAll(): Promise<FindAllStoreCatalogFacadeInterfaceOutputDTO> {
        return await this._findAllUseCase.execute();
    }

}